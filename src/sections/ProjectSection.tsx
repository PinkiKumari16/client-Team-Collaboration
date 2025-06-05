import React, { useState } from "react";
import ProjectList from "../components/ProjectList";
import SingleProjectView from "../components/SingleProjectView";

interface ProjectManagementProps {
  selectedProjectId: string;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({
  selectedProjectId,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      {selectedProjectId ? (
        <SingleProjectView projectId={selectedProjectId} />
      ) : (
        <ProjectList />
      )}
    </div>
  );
};

export default ProjectManagement;
