import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { handleRegister, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const ok = await handleRegister({ name, email, password, tenant });
    if (ok) onSuccess();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-xs uppercase text-gray-400">Name</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-accent focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase text-gray-400">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-accent focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase text-gray-400">Password</label>
        <input
          type="password"
          className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-accent focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase text-gray-400">Tenant</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-accent focus:outline-none"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          placeholder="alpha"
          required
        />
      </div>
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-blue-500"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
