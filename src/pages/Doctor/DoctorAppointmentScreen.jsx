import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import "./styles.css";

export const DoctorAppointmentScreen = () => {
  const { id } = useParams();
  const roomID = id;
  const myCallContainer = useRef(null);
  const { user } = useAuth();
  const [isSessionSummaryVisible, setIsSessionSummaryVisible] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(null);
  const sessionStartTime = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const appID = 524336703;
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
    localStorage.setItem("roomID", roomID);
    localStorage.setItem("userRole", "Patient");

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "Doctor"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: myCallContainer.current,
      sharedLinks: [
        {
          name: "Personal link",
          url: `http://localhost:5173/patient/room/${id}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },

      onLeaveRoom: () => {
        navigate("/");
      },
    });

    return () => {
      zp.destroy();
    };
  }, [roomID]);

  useEffect(() => {
    const savedRoomID = localStorage.getItem("roomID");
    const userRole = localStorage.getItem("userRole");

    if (savedRoomID && myCallContainer.current) {
      const appID = 524336703;
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        savedRoomID,
        Date.now().toString(),
        userRole
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: myCallContainer.current,
        sharedLinks: [
          {
            name: "Personal link",
            url: `http://localhost:5173/room/${savedRoomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        onLeaveRoom: () => {
          navigate("/");
        },
      });
    }
  }, []);
  return (
    <div
      ref={myCallContainer}
      style={{ width: "90%", height: "100%", padding: "20px" }}
    >
      <div className="BYpXSnOHfrC2td4QRijO">
        <div className="j9ygOVxEl2nClTPs77Ta"></div>
      </div>
    </div>
  );
};
