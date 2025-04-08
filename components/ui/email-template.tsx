import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  message,
  mobile,
}) => (
  <div>
    <h1>New Message</h1>
    <p className="font-bold"> {[firstName, lastName].join(" ")} </p>
    <p>Email - {email}</p>
    <p className="font-bold">Mobile - {mobile}</p>
    <p>{message}</p>
  </div>
);
