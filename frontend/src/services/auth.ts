import { api } from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const login = async (payload: LoginRequest) => {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  localStorage.setItem("token", data.AccessToken);
  localStorage.setItem("refreshToken", data.RefreshToken);
  return data;
};

export const register = async (payload: RegisterRequest) => {
  const { name, password } = payload;
  await api.post("/api/auth/register", {
    name,
    password
  });
  localStorage.setItem("tenant", payload.tenant);
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    name,
    password
  });
  localStorage.setItem("token", data.AccessToken);
  localStorage.setItem("refreshToken", data.RefreshToken);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tenant");
};
