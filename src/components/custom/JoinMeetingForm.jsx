import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStatus from "@/hooks/useAuthStatus";
import { SquarePlus, VoicemailIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function JoinMeetingForm({ updateMeetingStatus, appointmentId }) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const { user } = useAuthStatus();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (user) {
      if (name == "" || roomId == "") {
        toast.error("Fill the required fields !");
        return;
      }
      navigate(`/${user.currentUser.role}/room/${roomId}`);
      updateMeetingStatus(appointmentId);
    }
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-4">
          Join Meeting <VoicemailIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the Metting</DialogTitle>
          <DialogDescription>
            Enter your name and the meeting id below to join the room
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="enter here"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomId" className="text-right">
              Meet Code
            </Label>
            <Input
              id="roomId"
              placeholder="enter here"
              className="col-span-3"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleJoinMeeting} className="gap-3">
            Join
            <SquarePlus />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
