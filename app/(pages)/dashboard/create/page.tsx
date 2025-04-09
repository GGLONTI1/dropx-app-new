import OrderForm from "@/components/forms/OrderForm";
import React from "react";

const CreateOrder = () => {
  // if user type courier show you are not allowed to create an order
  return (
    <div className="flex flex-col h-full px-10">
      <OrderForm />
    </div>
  );
};

export default CreateOrder;
