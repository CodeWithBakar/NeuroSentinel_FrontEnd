import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function DoctorQualificatiosModal({
  isOpen,
  onClose,
  imageUrl,
  doctorInfo,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Doctor Qualifications Info</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <img
              src={`http://localhost:9002/uploads/${imageUrl}`}
              alt="Doctor"
              className="max-w-[540px]"
            />
          </div>
          <div>
            <h3 className="font-semibold">{doctorInfo.name}</h3>
            <p>
              <span className="font-semibold">Specialty : </span>{" "}
              {doctorInfo.specialty}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Experience : </span>
              {doctorInfo.experience} years
            </p>
            <p>
              {" "}
              <span className="font-semibold">Graduation Year : </span>
              {formatDate(doctorInfo.graduationYear)}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Institution : </span>
              {doctorInfo.institution}
            </p>
          </div>
        </div>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
