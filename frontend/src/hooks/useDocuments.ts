import { useCallback, useMemo, useState } from "react";
import type { DocumentItem, DocumentListItem } from "../services/types";
import { listDocuments, uploadDocument } from "../services/documents";

const mapToListItem = (doc: DocumentItem, status: "Indexed" | "Processing" = "Indexed"): DocumentListItem => ({
  ...doc,
  status
});

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const fetchDocuments = useCallback(async () => {
    setListLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(data.map((doc) => mapToListItem(doc)));
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to load documents");
    } finally {
      setListLoading(false);
    }
  }, []);

  const upload = useCallback(async (formData: FormData) => {
    setUploadLoading(true);
    setError(null);
    try {
      const document = await uploadDocument(formData);
      setDocuments((prev) => [mapToListItem(document, "Processing"), ...prev]);
      return true;
    } catch (err: any) {
      setError(err?.response?.data ?? "Upload failed");
      return false;
    } finally {
      setUploadLoading(false);
    }
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!filter.trim()) return documents;
    const value = filter.toLowerCase();
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(value) || doc.id.toString().includes(value)
    );
  }, [documents, filter]);

  return {
    documents: filteredDocuments,
    listLoading,
    uploadLoading,
    error,
    filter,
    setFilter,
    fetchDocuments,
    upload
  };
};
