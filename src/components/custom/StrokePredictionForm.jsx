"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function StrokePredictionForm() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Stroke Prediction Form</CardTitle>
        <CardDescription>
          Fill out the form below to assess your stroke risk.
        </CardDescription>
        {predictionResult !== null && (
          <Alert variant={predictionResult === 1 ? "destructive" : "success"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Prediction Result</AlertTitle>
            <AlertDescription>
              {predictionResult === 1
                ? "Stroke Risk Detected"
                : "No Stroke Risk Detected"}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 0, message: "Age cannot be negative" },
                  max: { value: 120, message: "Age must be between 0 and 120" },
                })}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}
            </div>

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

            <div>
              <Label htmlFor="avg_glucose_level">Average Glucose Level</Label>
              <Input
                id="avg_glucose_level"
                type="number"
                {...register("avg_glucose_level", {
                  required: "Average glucose level is required",
                  min: {
                    value: 0,
                    message: "Glucose level cannot be negative",
                  },
                })}
                placeholder="Enter glucose level"
              />
              {errors.avg_glucose_level && (
                <p className="text-red-500">
                  {errors.avg_glucose_level.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                {...register("bmi", {
                  required: "BMI is required",
                  min: { value: 0, message: "BMI cannot be negative" },
                  max: { value: 100, message: "BMI must be less than 100" },
                })}
                placeholder="Enter BMI"
              />
              {errors.bmi && (
                <p className="text-red-500">{errors.bmi.message}</p>
              )}
            </div>

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

          <Button type="submit" className="w-full">
            {isLoading ? <Loader /> : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
