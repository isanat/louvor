import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children || <Outlet />}
      </main>
    </div>
  );
}
