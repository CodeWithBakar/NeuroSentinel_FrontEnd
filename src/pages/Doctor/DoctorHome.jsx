import { AppointmentsCard } from "@/components/custom/AppointmentsCard";
import DoctorAvailabilityCard from "@/components/custom/DoctorAvailabilityCard";
import { DoctorLastPatientsBarChart } from "@/components/custom/DoctorLastPatientsBarChart";
import { DoctorRatingsGraph } from "@/components/custom/DoctorRatingsGraph";
import UserProfileCard from "@/components/custom/UserProfileCard";
import useAuthStatus from "@/hooks/useAuthStatus";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const DoctorHome = () => {
  const { user } = useAuthStatus();
  const [currentAppointmentsFigure, setcurrentAppointmentsFigure] = useState();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9002/doctor/appointments-figure",
          { doctorId: user?.currentUser.doctor._id }
        );
        setcurrentAppointmentsFigure(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
      <div className="col-span-1">
        {user && <UserProfileCard user={user} />}
      </div>
      <div className="col-span-1">
        <AppointmentsCard
          currentAppointmentsFigure={currentAppointmentsFigure}
        />
      </div>
      <div>
        <DoctorAvailabilityCard />
      </div>
      <div className="col-span-3">
        <DoctorRatingsGraph />
      </div>
    </div>
  );
};
