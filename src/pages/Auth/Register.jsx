import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    city: "",
    phoneNumber: "",
    profileImage: null,
    tumorType: "",
    qualifications: {
      specialization: "",
      experienceYears: "",
      institution: "",
      graduationYear: "",
      certificate: null,
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+92\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("qualifications")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        qualifications: {
          ...prev.qualifications,
          [field]: value,
        },
      }));
    } else if (name === "profileImage") {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.city ||
      !formData.phoneNumber
    ) {
      setError("All fields are required.");
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError(
        "Invalid phone number. Please include a country code (e.g., +92 33855116)."
      );
      return;
    }
    setError("");
    console.log(formData);
    const formDataToSend = new FormData();

    // Append basic user fields
    Object.keys(formData).forEach((key) => {
      if (key !== "qualifications" && key !== "profileImage") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Handle profile image
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    // Handle doctor-specific qualifications
    if (formData.role === "doctor") {
      Object.keys(formData.qualifications).forEach((key) => {
        if (key === "certificate" && formData.qualifications[key]) {
          formDataToSend.append(
            "qualifications[certificate]",
            formData.qualifications[key]
          );
        } else {
          formDataToSend.append(
            `qualifications[${key}]`,
            formData.qualifications[key]
          );
        }
      });
    }
    try {
      const res = await axios.post(
        "http://localhost:9002/auth/register",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/assets/images/logo.png`} alt="" />
          </Avatar>
          <span className="ml-4">Register Form</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name:</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name:</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="my-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-4">
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number with country code (e.g., +1 1234567890)"
              required
            />
          </div>
          <div className="mb-4">
            <Label>City:</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, city: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lahore">Lahore</SelectItem>
                <SelectItem value="Multan">Multan</SelectItem>
                <SelectItem value="Islamabad">Islamabad</SelectItem>
                <SelectItem value="Karachi">Karachi</SelectItem>
                <SelectItem value="Bahawalpur">Bahawalpur</SelectItem>
                <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                <SelectItem value="Quetta">Quetta</SelectItem>
                <SelectItem value="Murree">Murree</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-4">
            <Label htmlFor="profileImage">Profile Image:</Label>
            <Input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label>Role:</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.role === "doctor" && (
            <>
              <div className="mb-4">
                <Label>Specialization:</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      qualifications: {
                        ...formData.qualifications,
                        specialization: value,
                      },
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Neurologist">Neurologist</SelectItem>
                    <SelectItem value="Neurosurgeon">Neurosurgeon</SelectItem>
                    <SelectItem value="Neuro-Oncologist">
                      Neuro Oncologist
                    </SelectItem>
                    <SelectItem value="Vascular-Neurologist-Stroke-Specialist">
                      Vascular Neurologist (Stroke Specialist)
                    </SelectItem>
                    <SelectItem value="Movement-Disorder-Specialist">
                      Movement Disorder Specialist
                    </SelectItem>
                    <SelectItem value="Neuropsychiatrist">
                      Neuropsychiatrist
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="qualifications.experienceYears">
                  Years of Experience:
                </Label>
                <Input
                  type="number"
                  id="qualifications.experienceYears"
                  name="qualifications.experienceYears"
                  value={formData.qualifications.experienceYears}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="qualifications.institution">Institution:</Label>
                <Input
                  type="text"
                  id="qualifications.institution"
                  name="qualifications.institution"
                  value={formData.qualifications.institution}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="qualifications.graduationYear">
                  Graduation Year:
                </Label>
                <Input
                  type="date"
                  id="qualifications.graduationYear"
                  name="qualifications.graduationYear"
                  value={formData.qualifications.graduationYear}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="qualifications.certificate">
                  Upload Certificate:
                </Label>
                <Input
                  type="file"
                  id="qualifications.certificate"
                  name="qualifications.certificate"
                  accept="application/pdf, image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      qualifications: {
                        ...prev.qualifications,
                        certificate: e.target.files[0],
                      },
                    }))
                  }
                />
              </div>
            </>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#6C63FF] hover:bg-[#6C63FF]/80"
          >
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-sm text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default Register;
