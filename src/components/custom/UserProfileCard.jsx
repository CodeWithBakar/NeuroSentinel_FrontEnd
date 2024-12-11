import { Card } from "@/components/ui/card";
import EditProfileDialogue from "./EditProfileDialogue";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserProfileCard({ user }) {
  const currentUser = user.currentUser;
  return (
    <div className="flex items-center justify-center bg-gray-100 h-[100%] rounded-lg">
      <Card className="w-96 bg-white text-gray-800 p-6 relative shadow-lg mt-6">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white rounded-2xl overflow-hidden shadow-md">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage
              src={
                `http://localhost:9002/uploads/${currentUser?.profileImage}` ||
                ""
              }
              alt={currentUser?.firstName}
            />
            <AvatarFallback className="rounded-none">AB</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-xl font-bold">
            {currentUser.firstName + " " + currentUser.lastName}
          </h2>
          <h2 className="text-[12px] text-gray- mb-1">{currentUser.email}</h2>
          <p className="text-sm text-gray-500 mb-4">{currentUser.role}</p>
          <EditProfileDialogue />
        </div>
      </Card>
    </div>
  );
}
