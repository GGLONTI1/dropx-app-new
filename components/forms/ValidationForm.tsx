"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { userDataType } from "@/typings";
import { verifyOTP } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  otp_code: z.string().nonempty(),
});

const ValidationForm = ({
  currentStep,
  setCurrentStep,
  userData,
}: {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  userData: userDataType;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp_code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { otp_code } = values;

    try {
      const data = await verifyOTP(otp_code, userData);

      if (data.success) {
        toast.success("OTP verified successfully");
        router.push("/dashboard");
      } else {
        toast.error("Invalid OTP");
      }

      console.log("data:", data);
    } catch (error) {
      console.log("Error in verifyOTP:", error);
      toast.error("Error verifying OTP");
    }

    // if (data.success) {
    //   toast.success("OTP verified successfully");
    // } else {
    //   toast.error("Invalid OTP");
    // }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 min-w-96"
        >
          <h1 className="text-2xl font-bold text-center py-4">
            Create account
          </h1>
          <div className="flex flex-col w-full gap-2">
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Otp Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-black w-full py-4 gap-2 flex items-center justify-center">
            <Button
              onClick={() => setCurrentStep(0)}
              className="flex w-full"
              type="button"
            >
              Back
            </Button>
            <Button
              className="flex w-full bg-green-800 hover:bg-green-600 text-white"
              type="submit"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ValidationForm;
