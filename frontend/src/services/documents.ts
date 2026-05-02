import { api } from "./api";
import type { DocumentItem } from "./types";

export const listDocuments = async () => {
  const { data } = await api.get<DocumentItem[]>("/api/documents");
  return data;
};

export const uploadDocument = async (formData: FormData) => {
  const { data } = await api.post<DocumentItem>("/api/team/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};
