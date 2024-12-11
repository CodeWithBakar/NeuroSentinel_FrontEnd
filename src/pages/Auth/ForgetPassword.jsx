"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ForgetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verified, setVerified] = useState();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:9002/auth/forget-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );
      if (response.statusText == "Not Found") {
        toast.error("Email not found !");
      }
      if (response.ok) {
        toast.success("Email found !");
        setVerified(true);
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error("Error occured !");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#6C63FF] hover:bg-[#6C63FF]/80"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Redirecting to reset page" : "Send Email"}
        </Button>
      </CardFooter>
    </Card>
  );
}
