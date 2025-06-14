import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { hideLoading, setAlertContent, showLoading } from "../redux/rootSlice";

// Define User interface explicitly to fix TS errors on allUsersData
interface User {
  _id: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "MEMBER"; // Adjust roles as needed
}

interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  description?: string;
  assignedTo?: {
    _id: string;
    name: string;
  };
}

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  // Tell TS allUsersData is an array of User objects
  const { allUsersData, userRole } = useAppSelector(
    (state) => state.root as { allUsersData: User[]; userRole: string }
  );

  const dispatch = useAppDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
    status: "todo" as Task["status"],
  });

  // ** Fix these calls, you probably had some error with empty calls somewhere else,
  // but here fetchTasks expects no args, so this is fine **
  const fetchTasks = async () => {
    dispatch(showLoading());
    try {
      const res = await axios.get(`https://server-team-collaboration.onrender.com/api/task/getTasks?projectId=${projectId}`);
      setTasks(res.data.tasks || []);
    } catch (error: any) {
      dispatch(setAlertContent({ type: "error", message: error.message }));
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const openAddForm = () => {
    setNewTask({ title: "", description: "", assigneeId: "", status: "todo" });
    setEditTaskId(null);
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setNewTask({
      title: task.title,
      description: task.description || "",
      assigneeId: task.assignedTo?._id || "",
      status: task.status,
    });
    setEditTaskId(task._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setNewTask({ title: "", description: "", assigneeId: "", status: "todo" });
    setEditTaskId(null);
    setShowForm(false);
  };

  const handleAddOrUpdate = async () => {
    if (!newTask.title.trim()) {
      dispatch(
        setAlertContent({ type: "error", message: "Task title is required" })
      );
      return;
    }

    const payload = {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      projectId,
      assignedTo: newTask.assigneeId || null,
    };

    try {
      const response = editTaskId
        ? await axios.put(`https://server-team-collaboration.onrender.com/api/task/editTask/${editTaskId}`, payload)
        : await axios.post("https://server-team-collaboration.onrender.com/api/task/insert", payload);

      if (response.status === 200 || response.status === 201) {
        resetForm();
        await fetchTasks();
        dispatch(
          setAlertContent({ type: "success", message: response.data.message })
        );
      }
    } catch (err: any) {
      dispatch(
        setAlertContent({
          type: "error",
          message:
            err.response?.data?.message || err.message || "Task not added",
        })
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`https://server-team-collaboration.onrender.com/api/task/deleteTask/${id}`);
      if (res.status === 200) {
        await fetchTasks();
        dispatch(
          setAlertContent({ type: "success", message: res.data.message })
        );
      }
    } catch (err: any) {
      dispatch(
        setAlertContent({
          type: "error",
          message:
            err.response?.data?.message ||
            err.message ||
            "Failed to delete task.",
        })
      );
    }
  };

  const columns = {
    todo: {
      title: "To Do",
      color: "border-red-400",
      tasks: tasks.filter((t) => t.status === "todo"),
    },
    "in-progress": {
      title: "In Progress",
      color: "border-yellow-400",
      tasks: tasks.filter((t) => t.status === "in-progress"),
    },
    done: {
      title: "Done",
      color: "border-green-400",
      tasks: tasks.filter((t) => t.status === "done"),
    },
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          className="p-1 border rounded-md text-white bg-[#0a0233] px-3 cursor-pointer"
          onClick={openAddForm}
        >
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className={`bg-white overflow-y-auto max-h-[70vh] dark:bg-gray-800 rounded p-4 shadow-md min-h-[400px] border-t-4 ${column.color}`}
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-white">
              {column.title}
            </h3>
            {column.tasks.map((task) => (
              <div
                key={task._id}
                className="p-3 mb-3 flex bg-[#f2f3fb] dark:bg-gray-700 rounded border border-gray-300 shadow"
                onDoubleClick={() => openEditForm(task)}
              >
                <div className="mb-2 w-[90%]">
                  <h4 className="font-semibold text-lg">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <span
                    className="relative -top-3 left-7 text-red-500 font-bold cursor-pointer"
                    onClick={() => handleDelete(task._id)}
                  >
                    X
                  </span>
                  <div className="relative group">
                    {task.assignedTo?._id ? (
                      <div className="relative -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#3a16f1] text-white flex items-center justify-center text-sm font-medium">
                        {task.assignedTo.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="relative -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-medium">
                        U
                      </div>
                    )}
                    <div className="absolute top-0 right-2 transform -translate-x-1/2 px-3 py-1 rounded-lg bg-gray-800 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                      {task.assignedTo?._id
                        ? task.assignedTo.name
                        : "Unassigned"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editTaskId ? "Edit Task" : "Add New Task"}
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={newTask.assigneeId}
                onChange={(e) =>
                  setNewTask({ ...newTask, assigneeId: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Unassign</option>
                {allUsersData
                  .filter((user) => {
                    if (userRole === "ADMIN")
                      return ["MANAGER", "MEMBER"].includes(user.role);
                    if (userRole === "MANAGER") return user.role === "MEMBER";
                    if (userRole === "MEMBER") return user._id === currentUser;
                    return false;
                  })
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value as Task["status"],
                  })
                }
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddOrUpdate}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editTaskId ? "Update" : "Save"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanBoard;
