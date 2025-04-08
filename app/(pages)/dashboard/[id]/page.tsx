"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrderById, useGetCouriers } from "@/lib/query/queries";
import { updateOrder } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { useUserContext } from "@/context/AuthContext";
import { is } from "date-fns/locale";

const FormSchema = z.object({
  address: z.string().min(2),
  target: z.string().min(2),
  phone: z.string().min(2),
  status: z.string().min(1),
  datetime: z.date(),
  price: z.string().min(1),
  courier: z.string().min(1),
});

type OrderValues = {
  orderId: string;
  address: string;
  target: string;
  phone: string;
  status: string;
  price: string;
  datetime: Date | undefined;
  author: string;
  courier: string;
};

const OrderEdit = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const isCourier = user.type === "courier";
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";
  const { data: orderDetails, isLoading } = useGetOrderById(orderId as string);
  const { data: couriers } = useGetCouriers();

  const form = useForm<OrderValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
      target: "",
      phone: "",
      status: "draft",
      datetime: undefined,
      price: "",
      courier: "",
    },
  });

  useEffect(() => {
    if (orderDetails) {
      form.reset({
        address: orderDetails.address,
        target: orderDetails.target,
        phone: orderDetails.phone,
        status: orderDetails.status,
        datetime: orderDetails.datetime
          ? new Date(orderDetails.datetime)
          : undefined,
        price: orderDetails.price,
        courier: orderDetails.courier.$id,
      });
    }
  }, [orderDetails, form]);

  console.log(form.formState.errors);

  async function onSubmit(values: OrderValues) {
    console.log(values);

    try {
      await updateOrder(orderId, {
        ...values,
        datetime: values.datetime ? values.datetime.toISOString() : "",
      });
      toast.success("Order updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update order.");
    }
  }

  if (isLoading || !orderDetails)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center text-2xl font-extrabold py-6">
            Edit Order
          </div>
          <div className="flex flex-col space-y-4 w-96">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input disabled={isCourier} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Name</FormLabel>
                  <FormControl>
                    <Input disabled={isCourier} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input disabled={isCourier} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Date & Time</FormLabel>
                  <SmartDatetimeInput
                    disabled={isCourier}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g., tomorrow at 5pm or in 2 hours"
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status">
                          {field.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className={isCourier ? "hidden" : ""}
                          value="draft"
                        >
                          Draft
                        </SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={isCourier} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courier"
              render={({ field }) => (
                <FormItem className={isCourier ? "hidden" : ""}>
                  <FormLabel>Select Courier</FormLabel>
                  <Select
                    defaultValue={orderDetails?.courier?.$id}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a courier">
                        {couriers?.find((c: any) => c.$id === field.value)
                          ? `${
                              couriers.find((c: any) => c.$id === field.value)
                                ?.firstName
                            } ${
                              couriers.find((c: any) => c.$id === field.value)
                                ?.lastName
                            }`
                          : orderDetails?.courier
                          ? `${orderDetails.courier.firstName} ${orderDetails.courier.lastName}`
                          : "Select a courier"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {couriers?.map((courier: any) => (
                        <SelectItem key={courier.$id} value={courier.$id}>
                          {courier.firstName} {courier.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="sticky bottom-0 bg-white dark:bg-black w-full py-4 gap-2 flex items-center justify-center">
              <Button
                className="flex w-full"
                type="button"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                className="flex w-full bg-green-800 hover:bg-green-600 text-white"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderEdit;
