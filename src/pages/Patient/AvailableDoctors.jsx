import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Edit } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AvailableDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctor.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9002/doctor/available-doctors"
        );

        const currentDate = new Date();

        const filteredDoctors = response.data.map((doctor) => {
          doctor.slots = doctor.slots?.filter(
            (slot) => new Date(slot.availableDate) > currentDate
          );
          return doctor;
        });
        console.log(doctors);
        setDoctors(filteredDoctors);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="w-full p-4 space-y-4">
      <Input
        type="search"
        placeholder="Search doctors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Book Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredDoctors.length > 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`http://localhost:9002/uploads/${doctor.profileImage}`}
                          alt={doctor.firstName}
                        />
                        <AvatarFallback>
                          {doctor.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{`${doctor.firstName} ${doctor.lastName}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {doctor.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {doctor.doctor.doctorQualification.specialization}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{doctor.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{doctor.city}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Book
                          onClick={() => navigate("/patient/available-slots")}
                          className="h-5 w-5"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
