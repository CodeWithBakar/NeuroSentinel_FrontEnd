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

export default function RegisteredPatientsPage() {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/admin/registered-patients"
      );
      console.log(response);
      if (response.status == 200) {
        setData(response.data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error occurred while fetching records!");
    }
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:9002/admin/delete-patient/${patientToDelete._id}`
      );
      setData(data.filter((patient) => patient._id !== patientToDelete._id));
      toast.success("Patient deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while deleting the patient!");
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Patients</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient, index) => (
            <TableRow key={index}>
              <TableCell>
                {`${patient.user.firstName} ${patient.user.lastName}`}
              </TableCell>
              <TableCell>{patient.user.email}</TableCell>
              <TableCell>+9927292728977</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteClick(patient)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete patient</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {patientToDelete?.user.firstName}?
              This action cannot be undone.
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
