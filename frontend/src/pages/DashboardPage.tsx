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
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-0">
        <TopBar />
        <div className="grid flex-1 grid-cols-1 gap-6 min-h-0 p-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column — documents with scroll */}
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto rounded-2xl">
              <DocumentList
                documents={documents}
                loading={listLoading}
                error={error}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>
          {/* Right column — chat with scroll */}
          <div className="flex flex-col min-h-0 overflow-hidden">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
