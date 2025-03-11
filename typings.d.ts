import React from "react";
import { defaultUser } from "./context/AuthContext";

interface userDataType {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
}
interface AuthState {
  user: typeof defaultUser;
  setUser: React.Dispatch<React.SetStateAction<typeof defaultUser>>;
  isGettingUser: boolean;
}

type ProfileFormValues = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
};
