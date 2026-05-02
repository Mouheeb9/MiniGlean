import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-[#111111] px-10 py-16">
        <div className="max-w-md">
          <p className="mb-4 text-sm text-gray-400">Get started</p>
          <h1 className="mb-8 text-3xl font-semibold">Create your workspace</h1>
          <RegisterForm onSuccess={() => navigate("/")} />
          <p className="mt-6 text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-accent">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f172a] lg:flex">
        <div className="rounded-3xl bg-white/5 px-12 py-16 text-center">
          <h2 className="text-2xl font-semibold">Secure multi-tenant AI search</h2>
          <p className="mt-4 text-sm text-gray-400">Organize documents by tenant and deliver instant answers.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
