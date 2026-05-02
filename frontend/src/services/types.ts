export interface AuthResponse {
  AccessToken: string;
  RefreshToken: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  tenant: string;
}

export interface DocumentItem {
  id: number;
  name: string;
  description: string;
  userId: string;
  type: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  tenantId: string;
}

export type DocumentStatus = "Indexed" | "Processing";

export interface DocumentListItem extends DocumentItem {
  status: DocumentStatus;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
}
