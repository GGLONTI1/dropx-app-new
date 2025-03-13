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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetOrderById, useGetCouriers } from "@/lib/query/queries";
import { updateOrder } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";

const FormSchema = z.object({
  address: z.string().min(2),
  target: z.string().min(2),
  phone: z.string().min(2),
  status: z.string().min(1),
  datetime: z.date(),
  courier: z.string().min(1),
  price: z.string().min(1),
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
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";
  const [open, setOpen] = useState(false);
  const { data: orderDetails, isLoading } = useGetOrderById(orderId as string);
  const { data: couriers } = useGetCouriers();

  const form = useForm<OrderValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
      target: "",
      phone: "",
      status: "draft",
      courier: "",
      datetime: undefined,
      price: "",
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
        courier: orderDetails.courier,
        price: orderDetails.price,
      });
    }
  }, [orderDetails, form]);

  interface Courier {
    firstName: string;
    lastName: string;
    $id: string;
  }

  async function onSubmit(values: OrderValues) {
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <SmartDatetimeInput
                        value={field.value}
                        onValueChange={(date) => {
                          field.onChange(date);
                          setOpen(false);
                        }}
                        placeholder="e.g., tomorrow at 5pm or in 2 hours"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                    ></PopoverContent>
                  </Popover>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
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
              name="courier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Courier</FormLabel>
                  <Select
                    value={field.value || orderDetails?.courier}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a courier" />
                    </SelectTrigger>
                    <SelectContent>
                      {couriers?.map((courier: Courier) => (
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

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
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
