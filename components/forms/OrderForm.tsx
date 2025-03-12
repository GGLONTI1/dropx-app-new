"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, setDate } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useGetCouriers } from "@/lib/query/queries";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/appwrite/auth";

const FormSchema = z.object({
  address: z.string().min(2, {
    message: "Target must be at least 2 characters.",
  }),
  target: z.string().min(2, {
    message: "Target must be at least 2 characters.",
  }),
  phone: z.string().min(2, {
    message: "phone must not be empty",
  }),
  date: z.date({ required_error: "A date of birth is required." }),
  time: z.string().min(1, "Time is required"),
  courier: z.string({ required_error: "Please select a courier to display." }),
  price: z.string().min(1, "Price is required"),
});

type OrderValues = {
  address: string;
  target: string;
  phone: string;
  price: string;
  date: Date | undefined;
  time: string;
  courier: string;
  author: string;
};

export interface OrderData extends OrderValues {
  author: string;
}

interface Courier {
  firstName: string;
  lastName: string;
  $id: string;
}

const OrderForm = () => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const { user } = useUserContext();
  const router = useRouter();

  const form = useForm<OrderData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
      target: "",
      phone: "",
      courier: "",
      date: undefined,
      time: "",
      price: "",
    },
  });
  const {
    data: couriers,
    isPending: isGettingCouriers,
    isSuccess,
  } = useGetCouriers();

  async function onSubmit(values: OrderValues) {
    const orderData: OrderData = { ...values, author: user.userId };
    try {
      await createOrder(orderData);
      if (isSuccess) {
        toast.success("Order has been created");
        router.push("/dashboard");
      }
    } catch (error: any) {
      throw Error("Error creating order:", error);
    }
  }
  return (
    <div className=" flex-1 flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center text-2xl font-extrabold py-6">
            Create Order
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
                          selected={field.value as Date | undefined}
                          onSelect={(newValue) => {
                            field.onChange(newValue);
                            setOpen(false);
                          }}
                          fromDate={today}
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
              name="courier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Courier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a courier to bring your Order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {couriers?.map((item: Courier) => (
                        <SelectItem key={item.$id} value={item.$id}>
                          {item.firstName} {item.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input type="number" placeholder="0.00" {...field} />
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

export default OrderForm;
