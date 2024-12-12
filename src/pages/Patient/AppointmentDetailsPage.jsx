import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format, isBefore, parseISO } from "date-fns";
import { JoinMeetingForm } from "@/components/custom/JoinMeetingForm";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AppointmentDetailsPage() {
  const { user } = useAuth();
  const patientId = user.patient._id;
  const [appointments, setAppointments] = useState([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [comment, setComment] = useState("NO comment");
  const [stars, setStars] = useState(5);

  const fetchAppointment = async (_patinetId) => {
    try {
      const response = await fetch(
        "http://localhost:9002/patient/appointment-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: _patinetId,
          }),
        }
      );
      const dataInJson = await response.json();
      console.log(dataInJson);
      setAppointments(dataInJson.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointment(patientId);
    }
  }, [patientId]);

  function isPastDate(appointmentDate, appointmentTime) {
    const appointmentDateTime = new Date(appointmentDate);

    const [hours, minutes] = appointmentTime.split(":").map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    return appointmentDateTime < now;
  }

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    navigate("/"); // Navigate to the home screen
  };

  const handleSubmitReview = async (doctorId, patientId) => {
    try {
      const response = await fetch(`http://localhost:9002/doctor/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, stars, doctorId, patientId }),
      });
      console.log(response);
      if (response.ok) {
        toast.success("Review submitted successfully");
        setIsReviewDialogOpen(false);
        navigate("/appointment-details");
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error("Failed to submit the review");
    }
  };

  const updateMeetingStatus = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:9002/doctor/update-meeting-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId,
            status: "completed",
          }),
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      fetchAppointment(patientId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Appointments</h1>
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              You have no appointments.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => {
            const isPast = isPastDate(appointment.date, appointment.time);

            return (
              <React.Fragment>
                <Card
                  key={appointment._id}
                  className={`${
                    isPast ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isPast && (
                    <div className="bg-red-500 text-white text-center p-2 font-medium">
                      Appointment Expired
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={""} alt={appointment.doctorName} />
                        <AvatarFallback>
                          {appointment.doctor.user.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl font-bold">
                        {`${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Patient:{" "}
                        {`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Date: {format(parseISO(appointment.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Time: {appointment.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">Meeting Code:</p>
                      <Badge variant="secondary">
                        {appointment.meetingCode}
                      </Badge>
                    </div>
                    {!isPast ? (
                      <JoinMeetingForm
                        appointmentId={appointment._id}
                        updateMeetingStatus={updateMeetingStatus}
                      />
                    ) : (
                      <>
                        {!appointment.isReviewed && (
                          <Button onClick={() => setIsReviewDialogOpen(true)}>
                            Add Review
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                <Dialog open={isReviewDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Submit Your Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with the doctor. Please rate and
                        comment below.
                      </DialogDescription>
                      {/* Close button */}
                      <button
                        onClick={handleCloseReviewDialog}
                        aria-label="Close"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                      >
                        ✕
                      </button>
                    </DialogHeader>

                    {/* Form for submitting review */}
                    <div className="grid gap-4 py-4">
                      {/* Review comment using Textarea */}
                      <div className="flex flex-col">
                        <label htmlFor="comment" className="mb-2">
                          Comment
                        </label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="p-2"
                          placeholder="Write your review here..."
                          rows={3}
                        />
                      </div>

                      {/* Star rating using shadcn Select */}
                      <div className="flex flex-col">
                        <label htmlFor="rating" className="mb-2">
                          Rating (1-5 Stars)
                        </label>
                        <Select onValueChange={setStars} defaultValue="5">
                          <SelectTrigger className="w-full">
                            <span>{stars} Stars</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter className="flex">
                      <Button
                        onClick={() =>
                          handleSubmitReview(
                            appointment.doctor._id,
                            appointment.patient._id
                          )
                        }
                        className="gap-3"
                      >
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
