import React, { createContext, useState, useContext } from "react";

const DoctorContext = createContext();

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [meetingCode, setMeetingCode] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  return (
    <DoctorContext.Provider
      value={{
        meetingCode,
        setMeetingCode,
        appointmentDetails,
        setAppointmentDetails,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};
