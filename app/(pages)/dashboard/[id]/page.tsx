"use client";
import { useGetOrderById } from "@/lib/query/queries";
import { usePathname } from "next/navigation";
import React from "react";

const page = () => {


  

  return (
    <div className="flex-1 h-full">
      {/* Order with id: <pre>{JSON.stringify(orderDetails, null, 2)}</pre> */}
    </div>
  );
};

export default page;
