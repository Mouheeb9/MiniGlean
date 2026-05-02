import React from "react";

const TopBar: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold">Agentic Knowledge Base</h1>
        <p className="text-xs text-gray-400">Multi-source document intelligence</p>
      </div>
      <button className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
        Upgrade
      </button>
    </header>
  );
};

export default TopBar;
