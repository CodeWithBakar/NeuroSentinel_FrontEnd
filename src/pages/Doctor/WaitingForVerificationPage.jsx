import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WaitingForVerificationPage() {
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Application is Pending</CardTitle>
        <CardDescription>
          Thanks for registering at Neurocential, Umar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-lg mb-4">
            Your account is still pending verification.
          </p>
          <p>
            Please check back later or contact support if this takes longer than
            expected.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => navigate("/")}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Status
        </Button>
      </CardFooter>
    </Card>
  );
}
