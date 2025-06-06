import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { hideLoading, setAlertContent, showLoading } from "../redux/rootSlice";

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
  const { allUsersData, userRole } = useAppSelector((state) => state.root);
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

  const fetchTasks = async () => {
    dispatch(showLoading());
    try {
      const res = await axios.get(`/api/task/getTasks?projectId=${projectId}`);
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

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId
        ? { ...task, status: destination.droppableId as Task["status"] }
        : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`/api/task/updateStatus/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

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
      dispatch(setAlertContent({ type: "error", message: "Task title is required" }));
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
        ? await axios.put(`/api/task/editTask/${editTaskId}`, payload)
        : await axios.post("/api/task/insert", payload);

      if (response.status === 200 || response.status === 201) {
        resetForm();
        await fetchTasks();
        dispatch(setAlertContent({ type: "success", message: response.data.message }));
      }
    } catch (err: any) {
      dispatch(
        setAlertContent({
          type: "error",
          message: err.response?.data?.message || err.message || "Task not added",
        })
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/task/deleteTask/${id}`);
      if (res.status === 200) {
        await fetchTasks();
        dispatch(setAlertContent({ type: "success", message: res.data.message }));
      }
    } catch (err: any) {
      dispatch(
        setAlertContent({
          type: "error",
          message: err.response?.data?.message || err.message || "Failed to delete task.",
        })
      );
    }
  };

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white p-4 rounded shadow min-h-[400px]"
              >
                <h2 className="font-bold text-xl capitalize mb-4">{columnId.replace("-", " ")}</h2>
                {columnTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2 p-3 bg-gray-100 rounded shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div onClick={() => openEditForm(task)} className="cursor-pointer">
                            <h4 className="font-semibold">{task.title}</h4>
                            {task.description && <p className="text-sm">{task.description}</p>}
                          </div>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 font-bold"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
