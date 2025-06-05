import React from "react";
import { useAppSelector } from "../redux/hooks";
import KanbanBoard from "./KanbanBoard";

interface SingleProjectViewProps {
  projectId: string;
}

const SingleProjectView: React.FC<SingleProjectViewProps> = ({ projectId }) => {
  const { projectData } = useAppSelector((state) => state.root); // adjust according to your store
  const project = projectData.find((p: any) => p._id === projectId);

  if (!project) {
    return <p className="text-center mt-10">Project not found.</p>;
  }

  return (
    <div className="w-full">
      <div className="bg-[#0a0233] dark:bg-gray-800 py-3 mb-2 rounded-lg shadow-lg w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold mb-6 text-white dark:text-gray-100 tracking-wide">
          {project.name}
        </h2>
        <div className="flex text-gray-100 flex-col md:flex-row justify-between  md:items-start gap-3 px-3 mx-auto text-left">
          <p>
            Team:{" "}
            <span className="text-sm font-semibold uppercase tracking-wider text-[#abe8fb] bg- mb-1 p-1 rounded-2xl ">
              {project.teamId?.name || "N/A"}
            </span>
          </p>
          <div className="w-5/7 text-left">
            <p className="text-gray-100 dark:text-gray-300 leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      <KanbanBoard projectId={projectId} />
    </div>
  );
};

export default SingleProjectView;
