import React from "react";
import TestSocketConnection from "../components/SocketConnection";
import { useAppSelector } from "../redux/hooks";

const CommunicationTools: React.FC = () => {
  const userTeam = useAppSelector((state) => state.root.userTeam);
  const teamName = userTeam?.name ?? "Guest";

  return (
    <div className="h-screen border border-gray-200 dark:bg-gray-900">
      <nav className="bg-[#0a0233] h-[10%] border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span role="img" aria-label="Antenna">
              📡
            </span>{" "}
            Communication Center
          </h1>
          <span className="text-sm text-gray-200 dark:text-gray-300">
            Team: <strong>{teamName}</strong>
          </span>
        </div>
      </nav>

      <main className="max-w-6xl h-[90%] mx-auto">
        <TestSocketConnection />
      </main>
    </div>
  );
};

export default CommunicationTools;
