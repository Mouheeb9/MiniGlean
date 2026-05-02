import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Team", to: "/team" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" }
];

const tags = ["Urgent", "Reviewed", "Pinned"];

const Sidebar: React.FC = () => {
  return (
    <aside className="flex h-full w-64 flex-col bg-[#111111] px-6 py-8 text-sm text-gray-300">
      <div className="mb-10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/20" />
        <div>
          <p className="font-semibold text-white">Knowledge Hub</p>
          <p className="text-xs text-gray-500">Workspace</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-left transition ${
                isActive ? "bg-accent/20 text-white" : "hover:bg-white/5"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Tags</p>
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
