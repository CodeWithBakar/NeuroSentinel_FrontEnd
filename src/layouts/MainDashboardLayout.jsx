import { Loader } from "@/components/custom/Loader";
import { useAuth } from "@/context/AuthContext";
import { checkAdminCredentials } from "@/lib/utils";
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const MainDashboardLayout = () => {
  const { user, loading } = useAuth();

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
    if (user.doctor.applicationStatus == "accepted") {
      alert("You are Verified");
      return <Navigate to="/doctor" />;
    } else if (user.doctor.applicationStatus == "rejected") {
      alert("Sorry your application is rejected!");
      alert("Register again !");
      return <Navigate to="/register" />;
    } else {
      alert("Application user process !");
      return <Navigate to="/doctor-verificaion" />;
    }
  }

  return <Navigate to="/unauthorized" />;
};

export default MainDashboardLayout;
