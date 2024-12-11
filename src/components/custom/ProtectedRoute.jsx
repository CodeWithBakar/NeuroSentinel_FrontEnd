import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./Loader";

const PrivateRoute = ({ role }) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to={`/${userRole}`} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
