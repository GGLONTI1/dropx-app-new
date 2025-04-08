"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useGetCouriers } from "@/lib/query/queries";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/appwrite/auth";
import { SmartDatetimeInput } from "../ui/smart-datetime-input";

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
  datetime: z.union([
    z.date({ required_error: "Date is required." }),
    z.string().min(1, "Time is required"),
  ]),
  courier: z.string({ required_error: "Please select a courier to display." }),
  price: z.string().min(1, "Price is required"),
});

type OrderValues = {
  address: string;
  target: string;
  phone: string;
  price: string;
  datetime: Date | string;
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
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const form = useForm<OrderData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
      target: "",
      phone: "",
      courier: "",
      datetime: undefined,
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
    <div className="flex-1 flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
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
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <div className="flex flex-col justify-center w-full">
                  <FormLabel htmlFor="datetime" className="flex py-3">
                    Choose Date & Time
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen} modal={false}>
                    <PopoverTrigger asChild>
                      <SmartDatetimeInput
                        value={field.value instanceof Date ? field.value : null}
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
                </div>
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
                    <Input
                      type="number"
                      placeholder="0.00"
                      min={0}
                      {...field}
                    />
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
