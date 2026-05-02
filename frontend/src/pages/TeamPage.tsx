import React from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import DocumentUpload from "../components/dashboard/DocumentUpload";
import { useDocuments } from "../hooks/useDocuments";

const TeamPage: React.FC = () => {
  const { upload, uploadLoading, error } = useDocuments();

  return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <div className="p-6">
          <div className="max-w-3xl">
            <h2 className="mb-3 text-xl font-semibold text-white">Team Uploads</h2>
            <p className="mb-6 text-sm text-gray-400">
              Upload documents for your team knowledge base.
            </p>
            <DocumentUpload onUpload={upload} loading={uploadLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
