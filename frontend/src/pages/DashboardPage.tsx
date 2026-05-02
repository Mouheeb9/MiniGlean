import React, { useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import DocumentList from "../components/dashboard/DocumentList";
import ChatPanel from "../components/dashboard/ChatPanel";
import { useDocuments } from "../hooks/useDocuments";

const DashboardPage: React.FC = () => {
  const { documents, listLoading, error, filter, setFilter, fetchDocuments } = useDocuments();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden p-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex h-full flex-col gap-6 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <DocumentList
                documents={documents}
                loading={listLoading}
                error={error}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
