import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios, { formToJSON } from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon, UserIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHED_KEY);

export default function AvailableSlots() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    email: "",
    pdf: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState(null);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/doctor/available-slots"
      );
      console.log(response.data);
      setDoctors(response.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchPendingAppointments = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9002/patient/pending-appointments",
        {
          patientId: user.patient._id,
        }
      );
      setPendingAppointments(response.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingAppointments();
      fetchDoctors();
    }
  }, [user]);

  const handlePayment = async (appointmentId) => {
    try {
      const stripe = await stripePromise;
      const response = await axios.post(
        "http://localhost:9002/payment/stripe-checkout",
        { appointmentId }
      );
      const sessionId = response.data.id;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
      if (error) {
        toast.error("Payment failed. Please try again.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error occurred during payment. Please try again.");
      navigate("/");
    }
  };

  const handlePdfUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPatientDetails({
          ...patientDetails,
          pdf: reader.result,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleBookAppointment = async () => {
    if (
      !selectedDoctorId ||
      !selectedSlot.time ||
      !selectedSlot.date ||
      !patientDetails.name ||
      !patientDetails.email
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("doctorId", selectedDoctorId);
    formData.append("patientId", user.patient._id);
    formData.append("date", selectedSlot.date);
    formData.append("time", selectedSlot.time);

    if (file) {
      formData.append("pdf", file);
    }

    try {
      console.log(formData);
      const res = await fetch(
        "http://localhost:9002/patient/book-appointment",
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        toast.info("Redirecting to payment screen!");
        await handlePayment(data.appointmentData.appointmentId);
        toast.success("Appointment booked successfully!");
        setIsDialogOpen(false);
        setSelectedSlot({});
        setPatientDetails({ name: "", email: "", pdf: null });
        setFile(null);
        navigate("/");
      } else {
        toast.error("Error occurred while booking the appointment.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      if (appointmentId) {
        toast.info("Redirecting to payment screen!");
        await handlePayment(appointmentId);
        toast.success("Appointment booked successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };
  const pendingAppointmentsComponent = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pending Appointments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingAppointments &&
            pendingAppointments.map((appointment) => (
              <Card key={appointment._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>
                      Dr. {appointment.doctor.firstName}{" "}
                      {appointment.doctor.lastName}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      Pending
                    </span>
                  </div>
                  <div className="mt-4 ms-auto">
                    <Button
                      onClick={() => handleConfirmAppointment(appointment._id)}
                    >
                      Confirm Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {pendingAppointments.length > 0 ? (
        pendingAppointmentsComponent()
      ) : (
        <div className="w-full p-4 space-y-4">
          <input
            type="search"
            placeholder="Search for doctors by name or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block p-3 w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-right">Slots Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No Slots Available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={`http://localhost:9002/uploads/${doctor.profileImage}`}
                              alt={doctor.name}
                            />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{`${doctor.name}`}</div>
                            <div className="text-sm text-gray-400">
                              {doctor.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>
                        <div className="relative w-full">
                          <Select
                            value={
                              selectedSlot.time && selectedSlot.date
                                ? `${selectedSlot.time}, ${selectedSlot.date}`
                                : ""
                            }
                            onValueChange={(value) => {
                              const [time, date] = value.split(", ");
                              setSelectedDoctorId(doctor._id);
                              setSelectedSlot({ time, date });
                              setIsDialogOpen(true);
                            }}
                          >
                            <SelectTrigger
                              className={`w-full pe-${
                                selectedSlot.time && selectedSlot.date ? 20 : 0
                              }`}
                            >
                              <SelectValue placeholder="Select Slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Timings</SelectLabel>
                                {doctor.availability.length > 0 &&
                                  doctor.availability
                                    .filter((slot) => {
                                      const currentDate = new Date();
                                      const slotDate = new Date(slot.date);
                                      const [hours, minutes] =
                                        slot.time.split(":");
                                      slotDate.setHours(hours, minutes);
                                      return slotDate > currentDate;
                                    })
                                    .map((slot) => (
                                      <SelectItem
                                        key={`${slot.time}, ${slot.date}`}
                                        value={`${slot.time}, ${slot.date}`}
                                      >
                                        {format(parseISO(slot.date), "PP")}
                                        {/* {`${slot.time}, ${slot.date}`} */}
                                      </SelectItem>
                                    ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {selectedSlot.time && selectedSlot.date && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedSlot({})}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogContent className="sm:max-w-[700px]">
                          <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                            <DialogDescription>
                              Please provide the patient details to book this
                              appointment.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-4">
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  placeholder="Name"
                                  value={patientDetails.name}
                                  onChange={(e) =>
                                    setPatientDetails({
                                      ...patientDetails,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  placeholder="Email"
                                  type="email"
                                  value={patientDetails.email}
                                  onChange={(e) =>
                                    setPatientDetails({
                                      ...patientDetails,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="pdf">
                                  Upload Your Brain Scan (PDF)
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="pdf"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfUpload}
                                    className="flex-1"
                                  />
                                  {patientDetails.pdf && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        setPatientDetails({
                                          ...patientDetails,
                                          pdf: null,
                                        })
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleBookAppointment}>
                              Book Appointment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
