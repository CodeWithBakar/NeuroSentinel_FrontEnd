import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DoctorQualificatiosModal } from "@/components/custom/DoctorQualificatiosModal";

export default function DoctorRequestsPage() {
  const [data, setData] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleActionClick = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      const endpoint =
        actionType === "approve"
          ? `http://localhost:9002/admin/approve-doctor/${selectedRequest._id}`
          : `http://localhost:9002/admin/reject-doctor/${selectedRequest._id}`;
      const res = await axios.post(endpoint);
      toast.success(
        `Doctor request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully`
      );
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${actionType} doctor request`);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleViewDocuments = (request) => {
    setSelectedRequest(request);
    setImageModalOpen(true);
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/admin/doctor-requests"
      );
      setData(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error occured while fetching records !");
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Registration Requests</h1>
      </div>
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Documents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{`${request.user.firstName} ${request.user.lastName}`}</TableCell>
                <TableCell>
                  {request.doctorQualification.specialization}
                </TableCell>
                <TableCell>
                  {request.doctorQualification.experienceYears} years
                </TableCell>
                <TableCell>{request.user.email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleActionClick(request, "approve")}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve request</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleActionClick(request, "reject")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject request</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDocuments(request)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>No Requests are present for now !</h1>
      )}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} this doctor request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DoctorQualificatiosModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedRequest?.doctorQualification?.certificate}
        doctorInfo={{
          name: selectedRequest
            ? `${selectedRequest.user.firstName} ${selectedRequest.user.lastName}`
            : "",
          specialty: selectedRequest?.doctorQualification?.specialization,
          experience: selectedRequest?.doctorQualification?.experienceYears,
          graduationYear: selectedRequest?.doctorQualification?.graduationYear,
          institution: selectedRequest?.doctorQualification?.institution,
        }}
      />
    </React.Fragment>
  );
}
