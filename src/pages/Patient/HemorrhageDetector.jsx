import { useState, useCallback, useRef } from "react";
import { UploadCloud, AlertCircle, ImageUp, Download } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "@/context/AuthContext";

const HemorrhageDetector = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedImage, setHighlightedImage] = useState("");
  const reportRef = useRef(null);
  const { user } = useAuth();

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setHighlightedImage("");
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
    setHighlightedImage("");
    setIsLoading(true);
    setError(null);
    setResponse(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("patientId", user.patient._id);
    try {
      const res = await fetch(
        "http://localhost:9002/detection/detect-hemmorhages",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log(data.details);
      if (data) {
        setResponse(data.details);
        const imageData = data.details.highlighted_image.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );
        const imageSrc = `data:image/png;base64,${imageData}`;
        setHighlightedImage(imageSrc);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [file]);
  // Function to generate and download the PDF

  const downloadPdfReport = async () => {
    const doc = new jsPDF();
    const title = "Brain Hemorrhage Detection Report";
    const date = new Date().toLocaleDateString();

    // Add title and patient info
    doc.setFontSize(22);
    doc.text(title, 20, 20);
    doc.setFontSize(16);
    doc.text(`Patient Name: ${user.firstName} ${user.lastName}`, 20, 40);
    doc.text(`Date: ${date}`, 20, 50);

    let yOffset = 60; // Start yOffset after the patient info

    // Add highlighted image if available
    if (highlightedImage) {
      const canvas = await html2canvas(
        document.getElementById("highlightedImage")
      );
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 20, yOffset, 170, 100);
      yOffset += 110; // Adjust yOffset after the image
    }

    // Add diagnostic results header
    doc.setFontSize(14);
    doc.text("Diagnostic Results:", 20, yOffset + 10);
    yOffset += 20;

    if (
      response &&
      response.predictions &&
      response.predictions.predictions.length > 0
    ) {
      response.predictions.predictions.forEach((item, index) => {
        doc.text(`Prediction ${index + 1}:`, 20, yOffset);
        yOffset += 10; // Add spacing for the next line

        doc.text(
          `- Hemorrhage Type: ${
            response.hemorrhage_types[item.class] || "Unknown"
          }`,
          30,
          yOffset
        );
        yOffset += 10;

        doc.text(
          `- Confidence: ${(item.confidence * 100).toFixed(2)}%`,
          30,
          yOffset
        );
        yOffset += 10;

        doc.text(
          `- Bounding Box: (${item.x}, ${item.y}), Width: ${item.width}, Height: ${item.height}`,
          30,
          yOffset
        );
        yOffset += 10; // Space before the next prediction

        // Check if we are near the end of the page and add a new page
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20; // Reset yOffset for the new page
        }
      });
    } else {
      doc.text("No hemorrhage detected.", 20, yOffset);
    }

    // Save the PDF
    doc.save("Hemorrhage_Detection_Report.pdf");
  };

  return (
    <ScrollArea className="w-full h-full overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Brain Hemorrhage Disease Detection
        </h2>
        <h2 className="text-lg font-semibold mb-4">Upload Brain CT Scan :</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          {preview && (
            <div className="relative flex w-full h-80 mb-10 p-4">
              <div className="rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Original Preview"
                  className="object-contain rounded-lg w-full h-full"
                />
              </div>
              {highlightedImage && (
                <div className="ms-auto rounded-xl overflow-hidden">
                  <img
                    id="highlightedImage"
                    src={highlightedImage}
                    alt="Highlighted Preview"
                    className="object-contain rounded-lg w-full h-full"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {response && (
            <div
              className="p-4 text-green-800 rounded-lg bg-green-50"
              ref={reportRef}
            >
              {response.highlighted_image != null &&
              response.predictions.predictions.length > 0 ? (
                <div className="text-sm font-medium">
                  <h3 className="text-lg font-semibold mb-2">
                    Brain Hemmorhage Diagnostic Results
                  </h3>
                  {response.predictions.predictions.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 mb-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>Hemorrhage Type:</strong>{" "}
                          {response.hemorrhage_types[item.class] || "Unknown"}
                        </div>
                        <div>
                          <strong>class :</strong> {item.class}
                        </div>
                        <div>
                          <strong>class ID :</strong> {item.class_id}
                        </div>
                        <div>
                          <strong>Confidence :</strong>{" "}
                          {(item.confidence * 100).toFixed(2)}%
                        </div>
                        <div>
                          <strong>Height :</strong> {item.height}
                        </div>
                        <div>
                          <strong>Width :</strong> {item.width}
                        </div>
                        <div>
                          <strong>x :</strong> {item.x}
                        </div>
                        <div>
                          <strong>y :</strong> {item.y}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Hemmorhage found</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 flex justify-between bg-gray-50">
        {highlightedImage && (
          <Button onClick={downloadPdfReport} className="gap-4">
            Download Full Report <Download />
          </Button>
        )}
        <Button
          onClick={handleUpload}
          className={`gap-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Image"} <ImageUp />
        </Button>
      </div>
    </ScrollArea>
  );
};

export default HemorrhageDetector;
