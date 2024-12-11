import { useState, useCallback, useRef } from "react";
import { UploadCloud, AlertCircle, ImageUp, Download } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const AlzeimerDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        "http://localhost:9002/detection/detect-alzehimer",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data) {
        setResponse(data.details);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  return (
    <ScrollArea className="w-full h-full overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload your image here :</h2>
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
            </div>
          )}

          {error && (
            <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {response && (
            <div className="p-4 text-green-800 rounded-lg bg-green-50">
              {response && (
                <div className="text-sm font-medium">
                  <h3 className="text-lg font-semibold mb-2">Report Details</h3>
                  <div className="p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Label :</strong> {response.confidence}
                      </div>
                      <div>
                        <strong>Tumor Severity:</strong> {response.label}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 flex justify-between bg-gray-50">
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
