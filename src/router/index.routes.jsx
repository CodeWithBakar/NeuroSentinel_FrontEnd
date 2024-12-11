import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainDashboardLayout from "@/layouts/MainDashboardLayout";
import PatientDashboardLayout from "@/layouts/PatientDashboardLayout";
import DoctorDashboardLayout from "@/layouts/DoctorDashboardLayout";
import AdminDashboardLayout from "@/layouts/AdminDashboardLayout";
import PrivateRoute from "@/components/custom/ProtectedRoute";
import DoctorRequestsPage from "@/pages/Admin/DoctorRequestsPage";
import PaymentsHistoryPage from "@/pages/Admin/PaymentsHistoryPage";
import RegisteredDoctorsPage from "@/pages/Admin/RegisteredDoctorsPage";
import RegisteredPatientsPage from "@/pages/Admin/RegisteredPatientsPage";
import { DoctorHome } from "@/pages/Doctor/DoctorHome";
import { PatientsList } from "@/pages/Doctor/PatientsList";
import ImageUploader from "@/pages/Patient/ImageUploader";
import SetAvailabilityComponent from "@/pages/Doctor/SetAvailabilityComponent";
import AppointmentsList from "@/pages/Doctor/AppointmentsList";
import AvailableDoctors from "@/pages/Patient/AvailableDoctors";
import AvailableSlots from "@/pages/Patient/AvailableSlots";
import { PatientHome } from "@/pages/Patient/PatientHome";
import PatientReport from "@/pages/Patient/PatientReport";
import { ReportsList } from "@/pages/Doctor/ReportsList";
import { AlzeimerDetection } from "@/pages/Patient/AlzeimerDetection";
import { BrainHemmorages } from "@/pages/Patient/BrainHemmorages";
import { SpiralDetector } from "@/pages/Patient/SpiralDetector";
import PatientAppointmentScreen from "@/pages/Patient/PatientAppointmentScreen";
import { DoctorAppointmentScreen } from "@/pages/Doctor/DoctorAppointmentScreen";
import { PredictStroke } from "@/pages/Patient/PredictStroke";
import AppointmentDetailsPage from "@/pages/Patient/AppointmentDetailsPage";
import AdminLoginPage from "@/pages/Admin/AdminLoginPage";
import WaitingForVerificationPage from "@/pages/Doctor/WaitingForVerificationPage";
import AdminHome from "@/pages/Admin/AdminHome";
import { ForgetPassword } from "@/pages/Auth/ForgetPassword";
import { ResetPassword } from "@/pages/Auth/ResetPassword";
import PaymentFailed from "@/components/custom/PaymentFailed";

const RouterMain = createBrowserRouter([
  {
    path: "/",
    element: <MainDashboardLayout />,
  },
  {
    path: "/patient",
    element: <PrivateRoute role="patient" />,
    children: [
      {
        element: <PatientDashboardLayout />,
        children: [
          { index: true, element: <PatientHome /> },
          { path: "available-doctors", element: <AvailableDoctors /> },
          { path: "available-slots", element: <AvailableSlots /> },
          { path: "report", element: <PatientReport /> },
          { path: "appointment-details", element: <AppointmentDetailsPage /> },
          { path: "upload-details/upload-Mri", element: <ImageUploader /> },
          {
            path: "upload-details/alzeimer-scan",
            element: <AlzeimerDetection />,
          },
          // {
          //   path: "upload-details/hemmorhages-scan",
          //   element: <BrainHemmorages />,
          // },
          // {
          //   path: "upload-details/spiral-details",
          //   element: <SpiralDetector />,
          // },
          {
            path: "upload-details/predict-stroke",
            element: <PredictStroke />,
          },
          {
            path: "room/:id",
            element: <PatientAppointmentScreen />,
          },
        ],
      },
    ],
  },
  {
    path: "/doctor",
    element: <PrivateRoute role="doctor" />,
    children: [
      {
        element: <DoctorDashboardLayout />,
        children: [
          { index: true, element: <DoctorHome /> },
          { path: "appointments", element: <AppointmentsList /> },
          { path: "patients", element: <PatientsList /> },
          { path: "reports", element: <ReportsList /> },
          { path: "set-availability", element: <SetAvailabilityComponent /> },
          {
            path: "room/:id",
            element: <DoctorAppointmentScreen />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        element: <AdminDashboardLayout />,
        children: [
          { index: true, element: <Navigate to="home" /> },
          { path: "home", element: <AdminHome /> },
          { path: "doctor-requests", element: <DoctorRequestsPage /> },
          { path: "payments-history", element: <PaymentsHistoryPage /> },
          { path: "registered-doctors", element: <RegisteredDoctorsPage /> },
          { path: "registered-patients", element: <RegisteredPatientsPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/doctor-verificaion",
        element: <WaitingForVerificationPage />,
      },
    ],
  },
  {
    path: "/payment-failure",
    element: <PaymentFailed />,
  },
]);

export default RouterMain;
