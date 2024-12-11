import { BarChartComponent } from "@/components/custom/BarChartComponent";
import { LineChartComponent } from "@/components/custom/LineChartComponent";
import { PieChartcomponent } from "@/components/custom/PieChartcomponent";
import UserProfileCard from "@/components/custom/UserProfileCard";
import useAuthStatus from "@/hooks/useAuthStatus";
import React from "react";

export const PatientHome = () => {
  const { user } = useAuthStatus();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
      <div className="col-span-1">
        <BarChartComponent />
      </div>
      <div className="col-span-1">
        <PieChartcomponent />
      </div>
      <div className="col-span-1">
        {user && <UserProfileCard user={user} />}
      </div>
      <div className="col-span-3">
        <LineChartComponent />
      </div>
    </div>
  );
};
