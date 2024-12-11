import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const fetchUserStatus = async () => {
    try {
      const response = await axios.get("http://localhost:9002/auth", {
        withCredentials: true,
      });
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  const logout = async () => {
    try {
      await axios.get("http://localhost:9002/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return { user, isLoggedIn, logout, fetchUserStatus };
};

export default useAuthStatus;
