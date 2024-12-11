import { AdminDashboardSidebar } from "@/components/custom/Dashboard/AdminDashboardSidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminDashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
