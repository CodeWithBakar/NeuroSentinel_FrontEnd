import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

function PatientReport() {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();

  const fetchReport = async (patientId) => {
    try {
      const response = await axios.post(
        "http://localhost:9002/patient/get-report",
        {
          patientId: patientId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.data;
      setReports(data.reports);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReport(user.patient._id);
    }
  }, [user]);
  return (
    <div>
      <div className="p-4 text-green-800 rounded-lg bg-green-50">
        {reports.length > 0 ? (
          <div className="text-sm font-medium">
            <h2 className="text-2xl font-bold mb-2 text-center">
              MRI Reports over the time :
            </h2>
            {reports.map((item, index) => (
              <React.Fragment>
                <h3 className="text-lg font-semibold mb-1 mt-10">
                  <strong>Created At:</strong>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </h3>
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 mb-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <strong>Image:</strong>
                      <img
                        src={`http://localhost:9002/uploads/${item.imagePath}`}
                        alt={`Tumor Image - ${item.tumorType}`}
                        className="w-[400px] h-[400px] rounded-lg mt-2"
                      />
                    </div>

                    {/* Tumor details */}
                    <div>
                      <strong>Tumor Type:</strong> {item.tumorType}
                    </div>
                    <div>
                      <strong>Confidence:</strong>{" "}
                      {(item.confidence * 100).toFixed(2)}%
                    </div>
                    <div>
                      <strong>Box Area:</strong> {item.boxArea}
                    </div>
                    <div>
                      <strong>Box Width:</strong> {item.boxWidth}
                    </div>
                    <div>
                      <strong>Box Height:</strong> {item.boxHeight}
                    </div>
                    <div>
                      <strong>Aspect Ratio:</strong>{" "}
                      {item.aspectRatio.toFixed(2)}
                    </div>
                    <div>
                      <strong>Center X:</strong> {item.centerX}
                    </div>
                    <div>
                      <strong>Center Y:</strong> {item.centerY}
                    </div>
                    <div>
                      <strong>Tumor Severity:</strong> {item.tumorSeverity}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No Predictions found</p>
        )}
      </div>
    </div>
  );
}

export default PatientReport;
