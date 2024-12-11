import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { ADMIN_PASSWORD, ADMIN_USER_NAME } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    if (username === ADMIN_USER_NAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(
        "adminCredentials",
        JSON.stringify({ username, password })
      );

      navigate("/admin");
    } else {
      setError("Invalid username or password.");
    }
  };

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
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Admin Login
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#6C63FF] hover:bg-[#6C63FF]/80"
                type="submit"
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
