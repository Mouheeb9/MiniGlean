import React from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

const ProjectsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <div className="p-6 text-sm text-gray-400">Projects view coming soon.</div>
      </div>
    </div>
  );
};

export default ProjectsPage;
