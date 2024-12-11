import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/patient/available-slots");
  };

  const handleViewPendingSlots = () => {
    navigate("/patient");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl font-bold text-red-500">
              Payment Failed
            </CardTitle>
          </div>
          <CardDescription>
            We're sorry, but your payment could not be processed at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This could be due to insufficient funds, an expired card, or a
            temporary issue with your payment method. Please check your payment
            details and try again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleTryAgain}>
            Try Payment Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewPendingSlots}
          >
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
