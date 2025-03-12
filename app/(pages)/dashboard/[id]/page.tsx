"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useGetOrderById, useGetCouriers } from "@/lib/query/queries";
import { updateOrder } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";

const FormSchema = z.object({
  address: z.string().min(2),
  target: z.string().min(2),
  phone: z.string().min(2),
  status: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
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
  date: Date | undefined;
  time: string;
  author: string;
  courier: string;
};

const OrderEdit = () => {
  const router = useRouter();
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";
  const [open, setOpen] = useState(false);
  const today = new Date();
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
      date: undefined,
      author: "",
      time: "",
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
        date: new Date(orderDetails.date),
        time: orderDetails.time,
        courier: orderDetails.courier,
        author: orderDetails.author,
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
      await updateOrder(orderId, values);
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
    <div className=" flex-1 flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center text-2xl font-extrabold py-6">
            Edit Order
          </div>
          <div className="flex flex-col space-y-4 w-96">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order ID</FormLabel>
                  <FormControl>
                    <Input value={orderId} disabled />
                  </FormControl>
                  <FormDescription>You cannot change Order ID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full sm:w-[184px]">
                    <FormLabel>Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(newValue) => {
                            field.onChange(newValue);
                            setOpen(false);
                          }}
                          fromDate={today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col  w-full sm:w-[184px]">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Input
                          type="time"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full  appearance-none"
                        />
                        <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        <SelectItem value="draft">draft</SelectItem>
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="processing">processing</SelectItem>
                        <SelectItem value="completed">completed</SelectItem>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
              <Button className="flex w-full" type="button">
                Cancel
              </Button>
              <Button
                className="flex w-full bg-green-800 hover:bg-green-600 text-white"
                type="submit"
              >
                Update
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderEdit;
