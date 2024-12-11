import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios"; // Add axios or your preferred HTTP client
import { useAuth } from "@/context/AuthContext";

const getDayOfWeek = (dateString) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

export default function DoctorAvailabilityCard() {
  const [availabilities, setAvailabilities] = useState([]);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const doctorId = user.doctor._id;

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:9002/doctor/availabilities/${doctorId}`
        );
        console.log(response.data);
        setAvailabilities(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching availabilities:", err);
        setError("Failed to load availabilities. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchAvailabilities();
  }, [user]);

  const deleteAvailability = async (availability) => {
    try {
      await axios.delete(
        `http://localhost:9002/doctor/delete-availability/${availability._id}`,
        {
          data: { doctorId },
        }
      );
      setAvailabilities(
        availabilities.filter((a) => a._id !== availability._id)
      );
    } catch (err) {
      console.error("Error deleting availability:", err);
      setError("Failed to delete availability. Please try again later.");
    }
    setAvailabilityToDelete(null);
    setIsDialogOpen(false);
  };

  const openDeleteDialog = (availability) => {
    setAvailabilityToDelete(availability);
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setAvailabilityToDelete(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <p>Loading availabilities...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your current Availabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {availabilities.length > 0 ? (
            availabilities.map((availability) => (
              <div
                key={availability.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium">
                    {getDayOfWeek(availability.date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(availability.date).toLocaleDateString()} at{" "}
                    {availability.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(availability)}
                  aria-label={`Delete availability for ${getDayOfWeek(
                    availability.date
                  )}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          ) : (
            <p> No Current availabilities found</p>
          )}
        </ScrollArea>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {availabilityToDelete && (
                <>
                  Are you sure you want to delete the availability for{" "}
                  {getDayOfWeek(availabilityToDelete.date)} (
                  {new Date(availabilityToDelete.date).toLocaleDateString()}) at{" "}
                  {availabilityToDelete.time}?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                availabilityToDelete && deleteAvailability(availabilityToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
