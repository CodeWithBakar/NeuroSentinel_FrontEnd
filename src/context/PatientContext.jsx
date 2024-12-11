import React, { createContext, useState, useContext } from "react";

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [meetingCode, setMeetingCode] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  return (
    <PatientContext.Provider
      value={{
        meetingCode,
        setMeetingCode,
        appointmentDetails,
        setAppointmentDetails,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
