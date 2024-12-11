import { Loader } from "@/components/custom/Loader";
import { useAuth } from "@/context/AuthContext";
import { checkAdminCredentials } from "@/lib/utils";
import React from "react";
import { Navigate } from "react-router-dom";

const MainDashboardLayout = () => {
  const { user, loading } = useAuth();
  console.log(user);
  if (checkAdminCredentials()) {
    return <Navigate to="/admin" />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role === "patient") {
    return <Navigate to="/patient" />;
  }

  if (user.role === "doctor") {
    if (user.doctor.isRegistered) {
      return <Navigate to="/doctor" />;
    } else {
      return <Navigate to="/doctor-verificaion" />;
    }
  }

  return <Navigate to="/unauthorized" />;
};

export default MainDashboardLayout;
