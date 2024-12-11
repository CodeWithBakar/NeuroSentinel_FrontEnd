import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  CalendarClock,
  CalendarDays,
  CalendarIcon,
  CalendarX2Icon,
  ChevronRightIcon,
  Clock10Icon,
  ClockIcon,
  ShieldAlert,
  UserIcon,
  XIcon,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppointmentsList = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  function extractDateComponents(dateString) {
    const dateObj = new Date(dateString);

    const day = dateObj.toLocaleString("en-US", { weekday: "long" });
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const date = dateObj.getDate();
    const year = dateObj.getFullYear();

    return {
      day,
      month,
      date,
      year,
    };
  }
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9002/doctor/appointments",
          { doctorId: user?.doctor._id }
        );
        setTodayAppointments(response.data.todayAppointments);
        setUpcomingAppointments(response.data.upcomingAppointments);
        console.log(response);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, [user]);
  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-[500px] border-r border-gray-200 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Today's Appointments
          </CardTitle>
          <p className="text-sm text-gray-500">{formatDate(today)}</p>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-4">
            {todayAppointments.length > 0 ? (
              <React.Fragment>
                {todayAppointments.map((appointment, index) => (
                  <Card
                    key={index}
                    className="flex items-center p-3 space-x-3 shadow-sm"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`http://localhost:9002/uploads/${appointment.patient.user.profileImage}`}
                        alt="@username"
                      />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div>
                        <p className="text-md font-bold leading-none">
                          {appointment.patient.user.firstName +
                            " " +
                            appointment.patient.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.patient.user.email}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {appointment.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </React.Fragment>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <ShieldAlert size={"50px"} className="mx-auto mb-4" />
                No appointments scheduled for today
              </div>
            )}
          </div>
        </ScrollArea>
        <Card className="bg-blue-50 border-blue-100 m-4 mt-24">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-blue-700">
                Schedule a new appointment
              </h3>
            </div>
            <p className="text-xs text-blue-600 mb-3">
              Quickly add a new appointment to your calendar.
            </p>
            <Button
              variant="link"
              className="text-blue-700 p-0 text-xs hover:text-blue-800"
              onClick={() => navigate("/doctor/set-availability")}
            >
              Schedule now <ChevronRightIcon className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Upcoming appointments */}
      <div className="flex-grow">
        <ScrollArea className="h-full">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-3 gap-8">
                {upcomingAppointments.map((item, index) => (
                  <Card index={index} className="w-[260px]">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`http://localhost:9002/uploads/${item.patient.user.profileImage}`}
                              alt="@username"
                            />
                            <AvatarFallback>UN</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold leading-none">
                              {item.patient.user.firstName +
                                " " +
                                item.patient.user.lastName}
                            </p>
                            <p className="text-[10px] text-gray-600 truncate max-w-[140px]">
                              {item.patient.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-pink-100 p-2 text-pink-600">
                          <div className="flex items-center space-x-2">
                            <CalendarClock className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {item.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-blue-100 p-2 text-blue-600">
                          <div className="flex items-center space-x-2">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {`
                               ${extractDateComponents(item.date).day} ${
                                extractDateComponents(item.date).date
                              }, ${extractDateComponents(item.date).year}
                              `}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <ShieldAlert size={"50px"} className="mx-auto mb-4 mt-20" />
                No appointments for future
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppointmentsList;
