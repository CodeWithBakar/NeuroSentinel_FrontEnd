// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Book, Edit } from "lucide-react";
// import { toast } from "sonner";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AvailableDoctors() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:9002/doctor/available-doctors"
//         );

//         const currentDate = new Date();

//         const filteredDoctors = response.data.map((doctor) => {
//           doctor.slots = doctor.slots?.filter(
//             (slot) => new Date(slot.availableDate) > currentDate
//           );
//           return doctor;
//         });
//         console.log(doctors);
//         setDoctors(filteredDoctors);
//       } catch (err) {
//         toast.error(err.message);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   return (
//     <div className="w-full p-4 space-y-4">
//       <Input
//         type="search"
//         placeholder="Search doctors..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="max-w-sm"
//       />
//       <div className="border rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[300px]">Doctor</TableHead>
//               <TableHead>Specialization</TableHead>
//               <TableHead>Phone</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Book Doctor</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {!filteredDoctors.length > 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center">
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredDoctors.map((doctor) => (
//                 <TableRow key={doctor._id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center space-x-4">
//                       <Avatar>
//                         <AvatarImage
//                           src={`http://localhost:9002/uploads/${doctor.profileImage}`}
//                           alt={doctor.firstName}
//                         />
//                         <AvatarFallback>
//                           {doctor.firstName
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="font-semibold">{`${doctor.firstName} ${doctor.lastName}`}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {doctor.email}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {doctor.doctor.doctorQualification.specialization}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <span>{doctor.phoneNumber}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge>{doctor.city}</Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end space-x-2">
//                       <Button variant="ghost" size="icon">
//                         <Book
//                           onClick={() => navigate("/patient/available-slots")}
//                           className="h-5 w-5"
//                         />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AvailableDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const specializations = [
    "All",
    "Neurosurgeon",
    "Neuro-Oncologist",
    "Vascular-Neurologist",
    "Stroke-Specialist",
  ];

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
        setDoctors(filteredDoctors);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearchTerm =
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      filterSpecialization === "All" ||
      doctor.doctor.doctorQualification.specialization
        .toLowerCase()
        .includes(filterSpecialization.toLowerCase());

    return matchesSearchTerm && matchesSpecialization;
  });

  return (
    <div className="w-full p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <form className="max-w-4xl mx-auto">
        <div className="flex">
          {/* Dropdown for Specializations */}
          <select
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="flex-shrink-0 py-3 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search for doctors by name or specialization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block p-3 w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute top-0 right-0 p-3 h-full text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No doctors found.
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
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
                  <div className="font-bold text-xl">{`${doctor.firstName} ${doctor.lastName}`}</div>
                  <div className="text-sm text-gray-500">{doctor.email}</div>
                  <Badge variant="outline" className="mt-2">
                    {doctor.city}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-gray-600">
                <div>
                  <span className="font-medium">Specialization:</span>{" "}
                  {doctor.doctor.doctorQualification.specialization}
                </div>
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {doctor.phoneNumber}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => navigate("/patient/available-slots")}
                  className="gap-2 bg-black hover:bg-gray-800 text-white transition-colors "
                >
                  <Book className="h-5 w-5" /> Book Appointment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
