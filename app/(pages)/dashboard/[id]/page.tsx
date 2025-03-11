"use client";
import { useGetOrderById } from "@/lib/query/queries";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const pathname = usePathname();
  const orderId = pathname.split("/").pop();
  if (!orderId) return <div>No order id, please ...</div>;

  const { data: orderDetails } = useGetOrderById(orderId);




  return (
    <div className="flex-1 h-full">
      Order with id: <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
    </div>
  );
};

export default page;
