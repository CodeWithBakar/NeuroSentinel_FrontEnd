import { Bell, Settings } from "lucide-react";
import React from "react";
import { JoinMeetingForm } from "../JoinMeetingForm";

export const DashboardHeader = ({ title }) => {
  // const { meetingCode } = useAuth();
  return (
    <div className="flex justify-between items-center px-2 py-6 mx-4">
      <h1 className="font-extrabold text-3xl">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* {meetingCode && ( */}
        <React.Fragment>
          {/* <button
            className="bg-green-100 px-3 py-1 rounded-xl text-sm"
            onClick={() => {
              navigator.clipboard.writeText(meetingCode);
              toast.info("copied !");
            }}
          >
            Copy Meeting code : {meetingCode}
          </button> */}
          {/* <JoinMeetingForm /> */}
        </React.Fragment>
        {/* )} */}
        <Bell />
        <Settings />
      </div>
    </div>
  );
};
