"use server";

import { EmailTemplate } from "@/components/ui/email-template";
import { Resend } from "resend";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobile: z.string().min(1, "Enter phone number correctly"),
  email: z.string().min(2, "Enter email here correctly"),
  message: z.string().min(1, "Message is required"),
});

const resend = new Resend(process.env.RESEND_API_KEY);
export const send = async (emailFormData: z.infer<typeof formSchema>) => {
  try {
    const { error } = await resend.emails.send({
      from: `DROPX <${process.env.RESEND_FROM_EMAIL}>`,
      to: ["giorgiglonti23@gmail.com"],
      subject: "Welcome",
      react: await EmailTemplate({
        firstName: emailFormData.firstName,
        message: emailFormData.message,
        email: emailFormData.email,
        lastName: emailFormData.lastName,
        mobile: emailFormData.mobile,
      }),
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
