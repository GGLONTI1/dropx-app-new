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
import { useRouter } from "next/navigation";
import { useSignUp } from "@/lib/query/queries";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  mobile: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8),
});

const SignUpForm = () => {
  const router = useRouter();
  const { mutateAsync: signUp, isPending: isLoading } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await signUp(values);
      console.log(response);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
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
          <div className="flex flex-col w-full sm:flex-row gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last Name</FormLabel>
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
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
              disabled={isLoading}
              className="flex w-full bg-green-800 hover:bg-green-600 text-white"
              type="submit"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </div>
          <div className="flex justify-center text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-extrabold underline cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
