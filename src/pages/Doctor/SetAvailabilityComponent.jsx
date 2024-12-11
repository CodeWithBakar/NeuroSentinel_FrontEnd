import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { CalendarIcon, Clock, Plus, Save } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SetAvailabilityComponent = () => {
  const [date, setDate] = React.useState(new Date());
  const [timeSlot, setTimeSlot] = React.useState("");
  const [availability, setAvailability] = React.useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const addAvailability = () => {
    if (date && timeSlot) {
      setAvailability((prev) => [
        ...prev,
        { date: date.toDateString(), time: timeSlot },
      ]);
      setTimeSlot("");
    }
  };

  const handleSave = async () => {
    const doctorId = user._id;

    try {
      console.log(availability);
      await axios.post("http://localhost:9002/doctor/set-availability", {
        doctorId,
        newAvailability: availability,
      });
      toast.success("Availability updated successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Set Your Availability
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Select Date and Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="space-y-2">
              <Label htmlFor="timeSlot" className="text-sm font-medium">
                Time Slot
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="timeSlot"
                  type="time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={addAvailability} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Availability
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" /> Save Availability
            </Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Current Availibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availability.length > 0 ? (
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Current Availability" />
                </SelectTrigger>
                <SelectContent>
                  {availability.length > 0 &&
                    availability.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={`${item.date}${item.time}`}
                      >
                        <Badge key={index} variant="secondary" className="mr-2">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {item.date}: {item.time}
                        </Badge>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500">No availability set yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetAvailabilityComponent;
