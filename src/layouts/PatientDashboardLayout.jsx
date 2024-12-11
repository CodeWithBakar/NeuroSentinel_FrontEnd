import DashboardContentWrapper from "@/components/custom/Dashboard/DashboardContentWrapper";
import { DashboardHeader } from "@/components/custom/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/custom/Dashboard/DashboardSidebar";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  ClipboardMinus,
  Clock8,
  Home,
  Hospital,
  FileText,
  CloudUpload,
} from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner";
import { PatientProvider, usePatient } from "@/context/PatientContext";
import useAuthStatus from "@/hooks/useAuthStatus";

const patientSidebarLinks = [
  { name: "Home", href: "/patient", icon: Home },
  {
    name: "Available Doctors",
    href: "/patient/available-doctors",
    icon: Hospital,
  },
  {
    name: "Available Slots",
    href: "/patient/available-slots",
    icon: Clock8,
  },
  {
    name: "Upload Details",
    href: "/patient/upload-details",
    icon: CloudUpload,
    subItems: [
      {
        name: "Brain Tumor",
        href: "/patient/upload-details/upload-Mri",
        icon: FileText,
      },
      {
        name: "Alzeimer Disease",
        href: "/patient/upload-details/alzeimer-scan",
        icon: FileText,
      },
      // {
      //   name: "Brain Hemmorhages",
      //   href: "/patient/upload-details/hemmorhages-scan",
      //   icon: FileText,
      // },
      // {
      //   name: "Spiral Drawing",
      //   href: "/patient/upload-details/spiral-details",
      //   icon: FileText,
      // },
      {
        name: "Stroke Prediction",
        href: "/patient/upload-details/predict-stroke",
        icon: FileText,
      },
    ],
  },
  {
    name: "Patient Report",
    href: "/patient/report",
    icon: ClipboardMinus,
  },
  {
    name: "Appointment Details",
    href: "/patient/appointment-details",
    icon: ClipboardMinus,
  },
];

const patientDetails = {
  name: "John Doe",
  role: "Cancer Patient",
  profileImage: "",
};

const PatientDashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuthStatus();
  const { setMeetingCode, setAppointmentDetails } = usePatient();

  useEffect(() => {
    const socket = io("http://localhost:9002");
    if (user) {
      const patientId = user.currentUser._id;
      socket.on(`appointment-reminder-${patientId}`, (message) => {
        if (message) {
          toast.info(message.meetingReminderMessage);
          setMeetingCode(message.meeting_Code);
          setAppointmentDetails(message.appointmentDetails);
        }
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const getTabName = () => {
    const path = location.pathname;
    if (path === "/patient") return "Home";
    if (path === "/patient/available-doctors") return "Available Doctors";
    if (path === "/patient/available-slots") return "Available Slots";
    if (path === "/patient/report") return "Patient Report";
    if (path === "/patient/appointment-screen") return "Appointment Screen";
    return "Patient Dashboard";
  };

  return (
    <div className="flex">
      <DashboardSidebar
        navLinks={patientSidebarLinks}
        personDetails={patientDetails}
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
  <PatientProvider>
    <PatientDashboardLayout />
  </PatientProvider>
);
