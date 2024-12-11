import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center gap-10 min-h-screen bg-white p-10">
      <div className="p-14">
        <img
          src="/assets/images/undraw_firmware_re_fgdy.svg"
          alt="Neural Network Visualization"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          variant="outline"
          className="flex gap-2 text-md me-auto"
          onClick={() => navigate("/admin/login")}
        >
          Go to Admin Dashboard
          <ArrowRight />
        </Button>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
