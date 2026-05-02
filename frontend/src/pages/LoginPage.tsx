import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-[#111111] px-10 py-16">
        <div className="max-w-md">
          <p className="mb-4 text-sm text-gray-400">Welcome back</p>
          <h1 className="mb-8 text-3xl font-semibold">Sign in to your workspace</h1>
          <LoginForm onSuccess={() => navigate("/")} />
          <p className="mt-6 text-sm text-gray-400">
            New here? <Link to="/register" className="text-accent">Create an account</Link>
          </p>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f172a] lg:flex">
        <div className="rounded-3xl bg-white/5 px-12 py-16 text-center">
          <h2 className="text-2xl font-semibold">Multi-source knowledge, in one place</h2>
          <p className="mt-4 text-sm text-gray-400">Upload documents, chat with AI, and keep every tenant organized.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
