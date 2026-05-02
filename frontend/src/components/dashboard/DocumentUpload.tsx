import React, { useCallback, useRef, useState } from "react";

interface DocumentUploadProps {
  onUpload: (formData: FormData) => Promise<boolean>;
  loading: boolean;
  error?: string | null;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, loading, error }) => {
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const formData = new FormData();
      formData.append("Name", name || file.name);
      formData.append("Description", description || "Uploaded via dashboard");
      formData.append("File", file);
      await onUpload(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [description, name, onUpload]
  );

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-panel p-6">
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <input
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          placeholder="Document name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <div
        className={`flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 text-center transition ${
          dragging ? "border-accent bg-accent/10" : "border-white/10"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p className="text-sm text-gray-300">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PDF, TXT, DOCX (max 10MB)</p>
        <button
          type="button"
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add New"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
};

export default DocumentUpload;
