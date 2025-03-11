import Header from "@/components/Header";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full px-10">
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
