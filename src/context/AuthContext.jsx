import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "@/components/custom/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetingCode, setMeetingCode] = useState();
  const [currentAppointmentDetails, setAurrentAppointmentDetails] = useState();

  const checkUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:9002/auth", {
        withCredentials: true,
      });
      setUser(res.data.currentUser);
      setUserRole(res.data.currentUser.role);
    } catch (error) {
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (loginData) => {
    try {
      const res = await axios.post(
        "http://localhost:9002/auth/login",
        loginData,
        {
          withCredentials: true,
        }
      );
      await checkUser();
      return { success: true };
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || "Login failed",
        };
      }
      return { success: false, message: "An unknown error occurred" };
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:9002/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        login,
        logout,
        setUser,
        setUserRole,
        checkUser,
        meetingCode,
        setMeetingCode,
        currentAppointmentDetails,
        setAurrentAppointmentDetails,
      }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
