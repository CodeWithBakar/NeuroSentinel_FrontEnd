import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const DashboardContentWrapper = ({ children }) => {
  return (
    <ScrollArea className="mx-6 h-[87vh] bg-neutral-50 p-4 rounded-[4px] shadow-md">
      {children}
    </ScrollArea>
  );
};

export default DashboardContentWrapper;
