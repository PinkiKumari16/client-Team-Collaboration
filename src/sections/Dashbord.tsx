import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  team?: {
    name?: string;
  } | string;
}

interface SummaryCard {
  title: string;
  value: number;
  color: string;
}

interface ActivityLog {
  user: string;
  action: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { projectData } = useAppSelector((state) => state.root);

  const storedUser = localStorage.getItem("user");
  const userDetails: User = storedUser
    ? JSON.parse(storedUser)
    : {
        _id: "guest",
        name: "Guest",
        email: "guest@example.com",
        role: "Member",
        team: { name: "Default" },
      };

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const isAdminOrManager: boolean = ["ADMIN", "MANAGER"].includes(userDetails.role);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("/api/users/getUsers");
        setAllUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchAllUsers();
  }, []);

  const totalProjects: number = Array.isArray(projectData) ? projectData.length : 0;
  const totalUsers: number = Array.isArray(allUsers) ? allUsers.length : 0;

  const summaryCards: SummaryCard[] = [
    {
      title: "Total Team Projects",
      value: totalProjects,
      color: "text-blue-500",
    },
    {
      title: "Total Team Members",
      value: totalUsers,
      color: "text-green-300",
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      user: "John Doe",
      action: "updated task 'Fix Navbar Bug'",
      timestamp: "Today at 10:32 AM",
    },
    {
      user: "Jane Smith",
      action: "created project 'Mobile App'",
      timestamp: "Yesterday at 2:15 PM",
    },
    {
      user: "Robert Roe",
      action: "sent a message in chat",
      timestamp: "Yesterday at 1:20 PM",
    },
    {
      user: userDetails.name,
      action: "logged in",
      timestamp: "Today at 9:00 AM",
    },
  ];

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `🌅 Good Morning`;
    if (hour >= 12 && hour < 17) return `🌞 Good Afternoon`;
    return `Good Evening`;
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "bg-red-400";
      case "MANAGER":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const teamName =
    typeof userDetails.team === "object" && userDetails.team?.name
      ? userDetails.team.name
      : "Unknown";

  return (
    <>
      {/* Navbar */}
      <div className="bg-[#0a0233] shadow px-6 py-4 flex items-center justify-between rounded-b-xl">
        <h1 className="text-lg font-semibold text-white">
          🚀 {teamName} Team's Dashboard
        </h1>
      </div>

      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 shadow-xl rounded-2xl px-6 py-10 text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {getGreeting()}, {userDetails.name} 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {userDetails.email}
          </p>
          <span
            className={`inline-block text-sm text-white font-semibold px-4 py-1 rounded-full shadow ${getRoleBadgeColor(
              userDetails.role
            )}`}
          >
            Role: {userDetails.role}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            Logged in at: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {summaryCards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-xl shadow p-6 text-center bg-[#0a0233] hover:shadow-md shadow-blue-900 transition`}
            >
              <h3 className="text-xl font-medium text-white">{card.title}</h3>
              <p className={`text-4xl font-bold mt-2 ${card.color}`}>
                {String(card.value).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>

        {/* Team Overview */}
        {isAdminOrManager && totalUsers > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              👥 Team Overview
            </h3>
            <ul className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto pr-2">
              {allUsers.map((member) => (
                <li
                  key={member._id}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">
                      {member.email}
                    </p>
                  </div>
                  <span
                    className={`text-xs text-white font-semibold px-3 py-1 rounded-full ${getRoleBadgeColor(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Activity Logs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🧑‍💼 User Activity
          </h3>
          <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            {activityLogs
              .filter(
                (log) => isAdminOrManager || log.user === userDetails.name
              )
              .map((log, idx) => (
                <li key={idx}>
                  <strong className="text-gray-900 dark:text-white">
                    {log.user}
                  </strong>{" "}
                  {log.action}
                  <div className="text-xs text-gray-500">{log.timestamp}</div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
