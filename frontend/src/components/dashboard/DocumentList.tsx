import React from "react";
import type { DocumentListItem } from "../../services/types";

interface DocumentListProps {
  documents: DocumentListItem[];
  loading: boolean;
  error: string | null;
  filter: string;
  onFilterChange: (value: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, loading, error, filter, onFilterChange }) => {
  return (
    <div className="rounded-2xl bg-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents</h2>
        <input
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          placeholder="Filter by name or ID"
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        />
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3 text-right">Size</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-gray-400" colSpan={4}>
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-400" colSpan={4}>
                  No documents yet.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{doc.name}</p>
                    <p className="text-xs text-gray-500">ID: {doc.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        doc.status === "Indexed"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
