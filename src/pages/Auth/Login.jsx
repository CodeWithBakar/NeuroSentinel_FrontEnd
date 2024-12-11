import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required");
    } else {
      setError("");
      const res = await login(formData);
      if (res.success) {
        toast.success("User Logged In successfully");
        navigate("/");
      } else {
        toast.error("Invalid Credentials !");
      }
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className={"text-3xl flex items-center"}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/assets/images/logo.png` || ""} alt={""} />
          </Avatar>
          Login Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4 text-sm text-end">
            <Link to={"/forget-password"}>Forgot Password ?</Link>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#6C63FF] hover:bg-[#6C63FF]/80"
          >
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-sm text-muted">
          Do not have an account ? <Link to={"/register"}>Register</Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default Login;
