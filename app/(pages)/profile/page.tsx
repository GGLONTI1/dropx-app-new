"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useUserContext } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { useUpdateProfile } from "@/lib/query/queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "firstname must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "lastmame must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Enter phone number correctly.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEdit() {
  const { user, isGettingUser } = useUserContext();
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const defaultValues: Partial<ProfileFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.mobile,
      });
    }
  }, [user]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    // mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    const userData = { ...data, id: user.userId };
    try {
      await updateProfile(userData);
      toast.success("User updated successfully!");
    } catch (error) {
      console.log(error);
      form.setError("phone", {
        message: "Error updating Form",
      });
    }
  }

  if (isGettingUser) return <Loading />;

  return (
    <div className="flex justify-center p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[290px]"
        >
          <div className="flex justify-center text-center font-extrabold text-2xl py-6">
            Profile Edit
          </div>
          <FormField
            control={form.control}
            name="email"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormDescription>You cannot change email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                  <Input placeholder="Your phone" {...field} />
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
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Loading..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
      
    </div>
  );
}
