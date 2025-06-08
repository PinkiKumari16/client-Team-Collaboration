import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";

import Dashboard from "../sections/Dashbord";
import ProjectManagement from "../sections/ProjectSection";
import CommunicationTools from "../sections/CommunicationTool";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  hideLoading,
  setAlertContent,
  setAllUsersData,
  setProjectData,
  setReloadData,
  showLoading,
} from "../redux/rootSlice";

// ✅ Type for Team
interface Team {
  id: string;
  name: string;
}

// ✅ Sidebar UI component
const SidebarItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-lg cursor-pointer text-sm font-medium ${
      active
        ? "bg-[#0a0233] text-blue-200"
        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
    }`}
  >
    {label}
  </div>
);

export const Home = () => {
  const dispatch = useAppDispatch();
  const {
    projectData,
    isReloadData,
    userRole,
    userTeam,
  }: {
    projectData: any[];
    isReloadData: boolean;
    userRole: string;
    userTeam: Team | null; // ✅ FIXED typing
  } = useAppSelector((state) => state.root);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab("Projects");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Projects":
        return <ProjectManagement selectedProjectId={selectedProjectId} />;
      case "Communication":
        return <CommunicationTools />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout error:", error);
      dispatch(
        setAlertContent({
          type: "error",
          message: "Failed to logout. Please try again.",
        })
      );
    }
  };

  const fetchData = async () => {
    const userData = localStorage.getItem("user");
    if (!userData || !userTeam?.id || !userRole) return;

    dispatch(showLoading());

    try {
      const [projectRes, userRes] = await Promise.all([
        axios.get("https://server-team-collaboration.onrender.com/api/projects/getProjects", {
          params: { teamId: userTeam.id },
        }),
        axios.get("https://server-team-collaboration.onrender.com/api/users/getUsers"),
      ]);

      dispatch(setProjectData(projectRes.data.projects || []));
      dispatch(setAllUsersData(userRes.data.users || []));
    } catch (err) {
      console.error("❌ Failed to fetch projects or users:", err);
    } finally {
      dispatch(hideLoading());
      dispatch(setReloadData(false));
    }
  };

  useEffect(() => {
    if (isReloadData || !projectData.length) {
      fetchData();
    }
  }, [isReloadData]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-[1/3] lg:w-64 bg-white shadow-lg shadow-[#8c86a2] p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-bold mb-4 text-center text-[#0a0233]">
            Team Collab
          </h2>
          <hr className="mb-4" />

          <SidebarItem
            label="Dashboard"
            active={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
          />

          {/* 🔽 Styled Project Dropdown */}
          <div
            className={`p-3 rounded-lg text-sm font-medium cursor-pointer ${
              activeTab === "Projects"
                ? "bg-[#0a0233] text-blue-300"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            <select
              className="w-full bg-transparent focus:outline-none"
              value={selectedProjectId || ""}
              onChange={(e) => handleProjectSelect(e.target.value)}
              onClick={() => setActiveTab("Projects")}
            >
              <option value="">All Projects</option>
              {projectData.map((project: any) => (
                <option
                  key={project._id}
                  value={project._id}
                  className="text-black dark:text-white bg-white dark:bg-gray-800"
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <SidebarItem
            label="Communication"
            active={activeTab === "Communication"}
            onClick={() => setActiveTab("Communication")}
          />
        </div>

        {/* Logout */}
        <div className="relative bottom-4 mt-auto pt-4 border-t border-gray-300">
          <SidebarItem label="Logout" active={false} onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default Home;
