import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "https://localhost:7155";

export const api = axios.create({
  baseURL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tenant = localStorage.getItem("tenant");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenant) {
    config.headers.tenant = tenant;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
