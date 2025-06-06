import React, { useState } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setAlertContent, setReloadData } from "../redux/rootSlice";

type Project = {
  _id: string;
  name: string;
  description: string;
  teamId: { name?: string } | string;
};

type ProjectFormData = {
  name: string;
  description: string;
  teamId: string;
};

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Explicitly type projectData as Project[]
  const { projectData, userRole, userTeam } = useAppSelector(
    (state) => ({
      projectData: state.root.projectData as Project[],
      userRole: state.root.userRole,
      userTeam: state.root.userTeam,
    })
  );

  const canEditOrAdd = userRole === "ADMIN" || userRole === "MANAGER";
  const canDelete = userRole === "ADMIN";

  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    teamId: userTeam.id,
  });

  const openForm = () => {
    setFormData({ name: "", description: "", teamId: userTeam.id });
    setShowForm(true);
    setIsEditMode(false);
    setEditProjectId(null);
  };

  const openEditForm = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      teamId: userTeam.id,
    });
    setShowForm(true);
    setIsEditMode(true);
    setEditProjectId(project._id);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditProjectId(null);
    setFormData({ name: "", description: "", teamId: userTeam.id });
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (isEditMode && editProjectId) {
        response = await axios.put("/api/projects/editProject", {
          id: editProjectId,
          ...formData,
        });
      } else {
        response = await axios.post("/api/projects/insert", formData);
      }
      if (response.status === 200 || response.status === 201) {
        dispatch(setReloadData(true));
        dispatch(
          setAlertContent({ type: "success", message: response.data.message })
        );
        closeForm();
      }
    } catch (error) {
      console.error(error);
      dispatch(
        setAlertContent({ type: "error", message: "Couldn’t save project." })
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/projects/deleteProject/${id}`);
      if (res.status === 200) {
        dispatch(setReloadData(true));
        dispatch(
          setAlertContent({ type: "success", message: res.data.message })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        setAlertContent({ type: "error", message: "Couldn't delete project." })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-[#0a0233] dark:text-white mb-4">
          All Projects
        </h2>
        {canEditOrAdd && (
          <button
            onClick={openForm}
            className="text text-white bg-[#0a0233] px-2 rounded"
          >
            Add Project
          </button>
        )}
      </div>

      {projectData.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No projects available.</p>
      ) : (
        <table className="w-full text-[10px] lg:text-sm text-left border-collapse border border-[#0a0233] dark:border-gray-700">
          <thead className="bg-[#0a0233] dark:bg-gray-700 text-gray-100 dark:text-gray-300">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Team Name</th>
              {(canEditOrAdd || canDelete) && <th className="p-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projectData.map((project) => (
              <tr
                key={project._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-2 border">{project.name}</td>
                <td className="p-2 border">{project.description}</td>
                <td className="p-2 border">
                  {typeof project.teamId === "object"
                    ? project.teamId?.name || "No team"
                    : "N/A"}
                </td>
                {(canEditOrAdd || canDelete) && (
                  <td className="p-2 border space-x-2 text-center">
                    {canEditOrAdd && (
                      <button
                        onClick={() => openEditForm(project)}
                        className="text-white rounded-xl bg-[#9f93f6] p-1 px-3 hover:underline text-xs"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="bg-red-500 text-white p-1 px-2 rounded-xl hover:underline text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {isEditMode ? "Edit Project" : "Add New Project"}
            </h3>
            <div className="space-y-2">
              <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Project Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="space-x-2 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-green-700 text-white px-4 py-1 rounded"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
                <button
                  onClick={closeForm}
                  className="bg-gray-500 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
