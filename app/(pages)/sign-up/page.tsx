"use client";

import SignUpForm from "@/components/forms/SignUpForm";
import ValidationForm from "@/components/forms/ValidationForm";
import { userDataType } from "@/typings";
import React, { useState } from "react";

const newUser: userDataType = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  password: "",
};

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState(newUser);
  return (
    <div className="">
      {currentStep === 0 ? (
        <SignUpForm
          setUserData={setUserData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      ) : (
        <ValidationForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          userData={userData}
        />
      )}
    </div>
  );
};

export default SignUpPage;
