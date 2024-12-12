import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import "./styles.css";

const PatientAppointmentScreen = () => {
  const { id } = useParams();
  const roomID = id;
  const myCallContainer = useRef(null);
  const navigate = useNavigation();

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
      "Patient"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: myCallContainer.current,
      sharedLinks: [
        {
          name: "Personal link",
          url: `http://localhost:5173/room/${id}`,
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

  return (
    <React.Fragment>
      <div
        ref={myCallContainer}
        style={{ width: "90%", height: "100%", padding: "20px" }}
      >
        <div className="BYpXSnOHfrC2td4QRijO">
          <div className="j9ygOVxEl2nClTPs77Ta"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PatientAppointmentScreen;
