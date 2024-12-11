import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export function PatientsList() {
  const { user } = useAuth();
  const [currentPatients, setCurrentPatients] = useState([]);

  useEffect(() => {
    const fetchCurrentPatients = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9002/doctor/current-patients",
          { doctorId: user.doctor._id }
        );
        setCurrentPatients(response.data.currentPatients);
      } catch (error) {
        console.error("Error fetching current patients", error);
      }
    };

    fetchCurrentPatients();
  }, []);

  return (
    <ScrollArea className="h-full w-full">
      <Table>
        <TableCaption>A list of your current patients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Profile Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPatients.length > 0 ? (
            currentPatients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={`http://localhost:9002/uploads/${patient.user.profileImage}`}
                    alt={patient.user.firstName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {patient.user.firstName} {patient.user.lastName}
                </TableCell>
                <TableCell>{patient.user.email}</TableCell>
                <TableCell>{patient.user.city}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              Total Patients: {currentPatients.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  );
}
