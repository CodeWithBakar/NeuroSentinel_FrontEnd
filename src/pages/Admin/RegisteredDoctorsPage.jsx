"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function RegisteredDoctorsPage() {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/admin/registered-doctors"
      );
      if (response.status == 200) {
        setData(response.data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error occurred while fetching records!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:9002/admin/delete-doctor/${doctorToDelete._id}`
      );
      setData(data.filter((doctor) => doctor._id !== doctorToDelete._id));
      toast.success("Doctor deleted successfully!");
    } catch (error) {
      toast.error("Error occurred while deleting the doctor!");
    } finally {
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Doctors</h1>
      </div>
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((doctor, index) => (
              <TableRow key={index}>
                <TableCell>{`${doctor.user.firstName} ${doctor.user.lastName}`}</TableCell>
                <TableCell>
                  {doctor.specialization ||
                    doctor.doctorQualification.specialization}
                </TableCell>
                <TableCell>{doctor.user.email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(doctor)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete doctor</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>No Registered dotors found</h1>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Dr. {doctorToDelete?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
