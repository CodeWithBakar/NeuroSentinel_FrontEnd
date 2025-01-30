// "use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "../ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader } from "./Loader";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function StrokePredictionForm() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      age: "",
      hypertension: "No",
      heart_disease: "No",
      avg_glucose_level: "",
      bmi: "",
      smoking_status: "non-smoker",
      Residence_type: "Urban",
      ever_married: "No",
      work_type: "Private",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmittedData(data); // Save patient data for chart display
    try {
      const response = await fetch("http://127.0.0.1:8000/stroke-predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setPredictionResult(result.stroke);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };
  const patientDataChart = {
    labels: ["Age", "BMI", "Glucose Level"],
    datasets: [
      {
        label: "Patient Data",
        data: [
          submittedData?.age || 0,
          submittedData?.bmi || 0,
          submittedData?.avg_glucose_level || 0,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        borderColor: ["#388e3c", "#f57c00", "#1976d2"],
        borderWidth: 1,
      },
    ],
  };

  const confidenceChartData = {
    labels: ["No Stroke", "Stroke"],
    datasets: [
      {
        label: "Prediction Confidence",
        data: [
          1 - (predictionResult || 0), // No Stroke
          predictionResult || 0, // Stroke
        ],
        backgroundColor: ["#4caf50", "#e53935"],
        borderColor: ["#388e3c", "#b71c1c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 shadow-lg border rounded-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-indigo-700">
          Stroke Prediction Form
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Fill out the form below to assess your stroke risk.
        </CardDescription>
        {predictionResult !== null && (
          <Alert
            variant={predictionResult === 1 ? "destructive" : "success"}
            className="mt-4"
          >
            <AlertCircle
              className={`h-5 w-5 ${
                predictionResult === 1 ? "text-red-600" : "text-green-600"
              }`}
            />
            <AlertTitle>
              {predictionResult === 1
                ? "Stroke Risk Detected"
                : "No Stroke Risk Detected"}
            </AlertTitle>
            <AlertDescription>
              {predictionResult === 1
                ? "High risk of stroke detected based on your input."
                : "No significant risk of stroke detected."}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 0, message: "Age cannot be negative" },
                  max: { value: 120, message: "Age must be realistic" },
                })}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500 mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Hypertension */}
            <div>
              <Label htmlFor="hypertension">Hypertension</Label>
              <Select
                {...register("hypertension", {
                  required: "Hypertension status is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Heart Disease */}
            <div>
              <Label htmlFor="heart_disease">Heart Disease</Label>
              <Select
                {...register("heart_disease", {
                  required: "Heart disease status is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Average Glucose Level */}
            <div>
              <Label htmlFor="avg_glucose_level">Avg Glucose Level</Label>
              <Input
                id="avg_glucose_level"
                type="number"
                {...register("avg_glucose_level", {
                  required: "Average glucose level is required",
                  min: {
                    value: 0,
                    message: "Glucose level must be a positive value",
                  },
                })}
                placeholder="Enter average glucose level"
              />
              {errors.avg_glucose_level && (
                <p className="text-red-500 mt-1">
                  {errors.avg_glucose_level.message}
                </p>
              )}
            </div>

            {/* BMI */}
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                {...register("bmi", {
                  required: "BMI is required",
                  min: { value: 0, message: "BMI cannot be negative" },
                  max: { value: 100, message: "BMI must be realistic" },
                })}
                placeholder="Enter BMI"
              />
              {errors.bmi && (
                <p className="text-red-500 mt-1">{errors.bmi.message}</p>
              )}
            </div>

            {/* Smoking Status */}
            <div>
              <Label htmlFor="smoking_status">Smoking Status</Label>
              <Select
                {...register("smoking_status", {
                  required: "Smoking status is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-smoker">Non-smoker</SelectItem>
                  <SelectItem value="smokes">Smokes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Residence Type */}
            <div>
              <Label htmlFor="Residence_type">Residence Type</Label>
              <Select
                {...register("Residence_type", {
                  required: "Residence type is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ever Married */}
            <div>
              <Label htmlFor="ever_married">Ever Married</Label>
              <Select
                {...register("ever_married", {
                  required: "Marriage status is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Type */}
            <div>
              <Label htmlFor="work_type">Work Type</Label>
              <Select
                {...register("work_type", {
                  required: "Work type is required",
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Self-employed">Self-employed</SelectItem>
                  <SelectItem value="Govt_job">Govt Job</SelectItem>
                  <SelectItem value="Children">Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all"
          >
            {isLoading ? <Loader /> : "Submit"}
          </Button>
        </form>
        <div></div>
      </CardContent>
      <CardContent>
        {submittedData && predictionResult !== null && (
          <div className="mt-8 space-y-8">
            {/* Patient Data Chart */}
            <div className="p-4 bg-gray-100 rounded-md shadow-md">
              <h3 className="text-center text-lg font-semibold text-indigo-600 mb-4">
                Patient Diagnostic Data
              </h3>
              <Bar data={patientDataChart} />
            </div>
          </div>
        )}
        {predictionResult !== null && (
          <div className="mt-8">
            <Alert
              variant={predictionResult === 1 ? "destructive" : "success"}
              className="mt-4"
            >
              <AlertCircle
                className={`h-5 w-5 ${
                  predictionResult === 1 ? "text-red-600" : "text-green-600"
                }`}
              />
              <AlertTitle>
                {predictionResult === 1
                  ? "Stroke Risk Detected"
                  : "No Stroke Risk Detected"}
              </AlertTitle>
              <AlertDescription>
                {predictionResult === 1
                  ? `High risk of stroke with ${
                      predictionResult * 100
                    }% confidence.`
                  : "No significant risk of stroke detected."}
              </AlertDescription>
            </Alert>

            {/* Confidence Chart */}
            <div className="mt-8">
              <h3 className="text-center font-bold mb-4">
                Prediction Confidence
              </h3>
              <div className="w-80 h-80 mx-auto">
                <Pie data={confidenceChartData} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
