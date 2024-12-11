import DashboardContentWrapper from "@/components/custom/Dashboard/DashboardContentWrapper";
import DashboardSidebar from "@/components/custom/Dashboard/DashboardSidebar";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Notebook,
  PersonStanding,
  FileStack,
  Clock8,
} from "lucide-react";
import { DoctorProvider, useDoctor } from "@/context/DoctorContext";
import { DashboardHeader } from "@/components/custom/Dashboard/DashboardHeader";
import useAuthStatus from "@/hooks/useAuthStatus";
import io from "socket.io-client";

const doctorSidebarLinks = [
  { name: "Home", href: "/doctor", icon: Home },
  { name: "Appointments", href: "/doctor/appointments", icon: Notebook },
  { name: "Patients", href: "/doctor/patients", icon: PersonStanding },
  { name: "Reports", href: "/doctor/reports", icon: FileStack },
  { name: "Set Availability", href: "/doctor/set-availability", icon: Clock8 },
];

const doctorDetails = {
  name: "Sam Doe",
  role: "Doctor",
  profileImage: "",
};

const DoctorDashboardLayout = () => {
  const location = useLocation();
  const { setMeetingCode, setAppointmentDetails } = useDoctor();
  const { user } = useAuthStatus();

  const getTabName = () => {
    const path = location.pathname;
    if (path === "/doctor") return "Home";
    if (path === "/doctor/appointments") return "Appointments";
    if (path === "/doctor/patients") return "Patients";
    if (path === "/doctor/upload-mri") return "Upload Details";
    if (path === "/doctor/reports") return "Reports";
    if (path === "/doctor/appointment-screen") return "Appointment Screen";
    return "Doctor Dashboard";
  };

  useEffect(() => {
    const socket = io("http://localhost:9002");
    if (user) {
      const doctorId = user.currentUser._id;
      socket.on(`appointment-reminder-doctor-${doctorId}`, (message) => {
        if (message) {
          toast.info(
            `You have an appointment with ${message.appointmentDetails.patient.firstName}`
          );
          setMeetingCode(message.meeting_Code);
          setAppointmentDetails(message.appointmentDetails);
        }
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="flex">
      <DashboardSidebar
        navLinks={doctorSidebarLinks}
        personDetails={doctorDetails}
      />
      <main className="w-full">
        <DashboardHeader title={getTabName()} />
        <DashboardContentWrapper>
          <Outlet />
        </DashboardContentWrapper>
      </main>
    </div>
  );
};

export default () => (
  <DoctorProvider>
    <DoctorDashboardLayout />
  </DoctorProvider>
);
