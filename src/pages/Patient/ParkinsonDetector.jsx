// import { useState, useCallback, useRef } from "react";
// import { AlertCircle, UploadCloud, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// // import { useAuth } from "@/context/AuthContext";

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// export const ParkinsonDetector = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const chartRef = useRef(null);

//   const handleFileChange = useCallback((e) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//       setError(null);
//     }
//   }, []);

//   const handleUpload = useCallback(async () => {
//     if (!file) {
//       setError("Please select a file to upload.");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     setResponse(null);

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("patientId", "9238497329218312");

//     try {
//       const res = await fetch(
//         "http://localhost:9002/detection/detect-parkinson",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Upload failed");
//       }

//       const data = await res.json();
//       setResponse(data.details);
//     } catch (err) {
//       setError("Upload failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [file]);

//   // Generate PDF Report
//   const downloadPdfReport = async () => {
//     try {
//       const pdf = new jsPDF("p", "mm", "a4");
//       const title = "Parkinson Detection Report";
//       const date = new Date().toLocaleDateString();
//       // const { user } = useAuth();

//       // Title Section
//       pdf.setFontSize(22);
//       pdf.text(title, 20, 20);
//       pdf.setFontSize(14);
//       pdf.text(`Date: ${date}`, 20, 40);
//       // pdf.text(`Patient Name: ${user.firstName} ${user.lastName}`, 20, 40);

//       // Adding Image Preview (if available)
//       if (preview) {
//         const imgElement = document.querySelector("#uploadedImage");
//         const imgCanvas = await html2canvas(imgElement, { scale: 2 });
//         const imgData = imgCanvas.toDataURL("image/png");
//         pdf.text("Uploaded Image:", 20, 50);
//         pdf.addImage(imgData, "PNG", 20, 60, 160, 90);
//       }

//       // Adding Detection Results
//       if (response) {
//         pdf.text(`Diagnosis: ${response.label}`, 20, 160);
//         pdf.text(
//           `Confidence: ${(response.confidence * 100).toFixed(2)}%`,
//           20,
//           170
//         );
//         pdf.text(`Severity: ${response.severity}`, 20, 180);

//         // Adding Confidence Chart
//         const chartElement = document.querySelector("#confidence");
//         if (chartElement) {
//           const chartCanvas = await html2canvas(chartElement, { scale: 2 });
//           const chartData = chartCanvas.toDataURL("image/png");
//           pdf.text("Confidence Chart:", 20, 190);
//           pdf.addImage(chartData, "PNG", 20, 200, 160, 90);
//         }
//       }

//       // Save the PDF file
//       pdf.save("parkinson_detection_report.pdf");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Failed to download the report. Please try again.");
//     }
//   };

//   // Doughnut chart configuration
//   const chartData = response
//     ? {
//         labels: ["Confidence", "Uncertainty"],
//         datasets: [
//           {
//             data: [response.confidence * 100, 100 - response.confidence * 100],
//             backgroundColor: ["#4CAF50", "#F44336"],
//             hoverBackgroundColor: ["#66BB6A", "#E57373"],
//             borderWidth: 1,
//           },
//         ],
//       }
//     : null;

//   const chartOptions = {
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
//         },
//       },
//       legend: { position: "bottom" },
//     },
//     cutout: "70%",
//     responsive: true,
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Parkinson Detection
//       </h2>

//       {/* File Upload */}
//       <div className="mb-8">
//         <label
//           htmlFor="file-upload"
//           className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition group"
//         >
//           <div className="flex flex-col items-center justify-center p-4 text-center">
//             <UploadCloud className="w-12 h-12 text-gray-400 mb-2 group-hover:text-blue-500 transition" />
//             <p className="text-sm text-gray-500 group-hover:text-blue-600 transition">
//               Click to upload or drag and drop
//             </p>
//             <p className="text-xs text-gray-400">
//               MRI Scan Images (Preferred: Coronal View)
//             </p>
//           </div>
//           <input
//             id="file-upload"
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//             accept="image/*"
//           />
//         </label>

//         {preview && (
//           <div className="mt-4 relative">
//             <h3 className="text-sm font-medium mb-2">Image Preview:</h3>
//             <img
//               id="uploadedImage"
//               src={preview}
//               alt="Selected Preview"
//               className="max-w-full h-64 object-contain rounded-lg shadow-md transition transform hover:scale-105"
//             />
//             <button
//               onClick={() => {
//                 setPreview(null);
//                 setFile(null);
//               }}
//               className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="flex items-center text-red-600 bg-red-100 p-4 rounded-md mb-6 animate-pulse">
//           <AlertCircle className="mr-2 w-5 h-5" />
//           {error}
//         </div>
//       )}

//       {/* Analyze Button */}
//       <div className="flex justify-center mb-8">
//         <Button
//           onClick={handleUpload}
//           disabled={isLoading || !file}
//           className={`gap-2 ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
//         >
//           {isLoading ? "Analyzing..." : "Analyze Image"}
//         </Button>
//       </div>

//       {/* Response Section */}
//       {response && (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-xl font-medium mb-4 text-blue-700">
//             Detection Results:
//           </h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             {/* Diagnostic Data */}
//             <div>
//               <p className="mb-2">
//                 <strong className="text-gray-700">Diagnosis:</strong>
//                 <span
//                   className={`ml-2 ${
//                     response.label === "Normal"
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {response.label}
//                 </span>
//               </p>
//               <p className="mb-2">
//                 <strong className="text-gray-700">Severity:</strong>
//                 <span className="ml-2">
//                   {response.severity || "Not Specified"}
//                 </span>
//               </p>
//               <p className="text-sm text-gray-600 italic">
//                 Please consult a healthcare professional for a definitive
//                 diagnosis.
//               </p>
//             </div>

//             {/* Doughnut Chart */}
//             <div className="w-80 h-80 relative">
//               {chartData && (
//                 <Doughnut
//                   data={chartData}
//                   options={chartOptions}
//                   ref={chartRef}
//                 />
//               )}
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
//                 <span className="text-lg font-semibold text-gray-800">
//                   {response.label}
//                 </span>
//                 <span className="text-sm text-gray-600 mt-1">
//                   Confidence: {Math.floor(response.confidence * 100)}%
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Download Report Button */}
//           <div className="flex justify-center mt-6">
//             <Button onClick={downloadPdfReport} className="gap-2">
//               <Download /> Download Report
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ParkinsonDetector;

import { useState, useCallback, useRef } from "react";
import { AlertCircle, UploadCloud, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const ParkinsonDetector = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("patientId", "9238497329218312");

    try {
      const res = await fetch(
        "http://localhost:9002/detection/detect-parkinson",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setResponse(data.details);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  // Generate PDF Report
  const downloadPdfReport = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const title = "Parkinson Detection Report";
      const date = new Date().toLocaleDateString();

      // Title Section
      pdf.setFontSize(22);
      pdf.text(title, 20, 20);
      pdf.setFontSize(14);
      pdf.text(`Date: ${date}`, 20, 40);

      // Adding Image Preview (if available)
      if (preview) {
        const imgElement = document.querySelector("#uploadedImage");
        const imgCanvas = await html2canvas(imgElement, { scale: 2 });
        const imgData = imgCanvas.toDataURL("image/png");
        pdf.text("Uploaded Image:", 20, 50);
        pdf.addImage(imgData, "PNG", 20, 60, 160, 90);
      }

      // Adding Detection Results
      if (response) {
        pdf.text(`Diagnosis: ${response.label}`, 20, 160);
        pdf.text(
          `Confidence: ${(response.confidence * 100).toFixed(2)}%`,
          20,
          170
        );

        // Adding Confidence Chart
        const chartElement = document.querySelector("#confidence");
        if (chartElement) {
          const chartCanvas = await html2canvas(chartElement, { scale: 2 });
          const chartData = chartCanvas.toDataURL("image/png");
          pdf.text("Confidence Chart:", 20, 190);
          pdf.addImage(chartData, "PNG", 20, 200, 160, 90);
        }
      }

      // Save the PDF file
      pdf.save("parkinson_detection_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download the report. Please try again.");
    }
  };

  // Doughnut chart configuration
  const chartData = response
    ? {
        labels: ["Confidence", "Uncertainty"],
        datasets: [
          {
            data: [
              Math.floor(response.confidence * 100),
              100 - Math.floor(response.confidence * 100),
            ],
            backgroundColor: [
              response.label === "Healthy" ? "#4CAF50" : "#F44336", // Green for Healthy, Red for Parkinson
              "#E0E0E0", // Gray for Uncertainty
            ],
            hoverBackgroundColor: [
              response.label === "Healthy" ? "#66BB6A" : "#E57373",
              "#BDBDBD",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
      legend: { display: false }, // Hide legend for a cleaner chart
    },
    cutout: "70%",
    responsive: true,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Parkinson Detection
      </h2>

      {/* File Upload */}
      <div className="mb-8">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition group"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-2 group-hover:text-blue-500 transition" />
            <p className="text-sm text-gray-500 group-hover:text-blue-600 transition">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              MRI Scan Images (Preferred: Coronal View)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>

        {preview && (
          <div className="mt-4 relative">
            <h3 className="text-sm font-medium mb-2">Image Preview:</h3>
            <img
              id="uploadedImage"
              src={preview}
              alt="Selected Preview"
              className="max-w-full h-64 object-contain rounded-lg shadow-md transition transform hover:scale-105"
            />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-600 bg-red-100 p-4 rounded-md mb-6 animate-pulse">
          <AlertCircle className="mr-2 w-5 h-5" />
          {error}
        </div>
      )}

      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleUpload}
          disabled={isLoading || !file}
          className={`gap-2 ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Analyzing..." : "Analyze Image"}
        </Button>
      </div>

      {/* Response Section */}
      {response && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-4 text-blue-700">
            Detection Results:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Diagnostic Data */}
            <div>
              <p className="mb-2">
                <strong className="text-gray-700">Diagnosis:</strong>
                <span
                  className={`ml-2 ${
                    response.label === "Healthy"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {response.label}
                </span>
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Confidence:</strong>
                <span className="ml-2">
                  {Math.floor(response.confidence * 100)}%
                </span>
              </p>
              <p className="text-sm text-gray-600 italic">
                Please consult a healthcare professional for a definitive
                diagnosis.
              </p>
            </div>

            {/* Doughnut Chart */}
            <div className="w-80 h-80 relative">
              {chartData && (
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                  ref={chartRef}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  className={`text-lg font-semibold ${
                    response.label === "Healthy"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {response.label}
                </span>
                <span className="text-sm text-gray-600 mt-1">
                  Confidence: {Math.floor(response.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Download Report Button */}
          <div className="flex justify-center mt-6">
            <Button onClick={downloadPdfReport} className="gap-2">
              <Download /> Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkinsonDetector;
