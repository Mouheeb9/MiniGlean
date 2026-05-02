import { useCallback, useMemo, useState } from "react";
import type { LoginRequest, RegisterRequest } from "../services/types";
import { login, logout, register } from "../services/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => !!localStorage.getItem("token"), []);

  const handleLogin = useCallback(async (payload: LoginRequest & { tenant: string }) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem("tenant", payload.tenant);
      await login({ name: payload.name, password: payload.password });
      return true;
    } catch (err: any) {
      setError(err?.response?.data ?? "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await register(payload);
      return true;
    } catch (err: any) {
      setError(err?.response?.data ?? "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout
  };
};
