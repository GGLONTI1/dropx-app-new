import Header from "@/components/Header";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col px-10">
      <Header />
      {children}
    </div>
  );
};

export default ProfileLayout;