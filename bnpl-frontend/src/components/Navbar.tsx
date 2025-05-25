// src/components/Navbar.tsx
import React from "react";
import { useAuth } from "../auth/useAuth";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow px-4">
      <div className="flex-1">
        <a className="text-xl font-bold text-primary">BNPL Dashboard</a>
      </div>
      {user && (
        <div className="flex-none">
          <span className="mr-4 text-sm text-gray-600">{user.email}</span>
          <button className="btn btn-sm btn-outline btn-error" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
