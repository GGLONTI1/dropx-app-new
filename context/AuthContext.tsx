"use client";

import { checkAuth, getUser } from "@/lib/appwrite/auth";
import { useGetUser } from "@/lib/query/queries";
import { AuthState } from "@/typings";
import { createContext, useContext, useEffect, useState } from "react";

export const defaultUser = {
  userId: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  type: "",
};

const AuthContext = createContext<AuthState>({
  user: defaultUser,
  setUser: () => {},
  isGettingUser: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(defaultUser);
  const { data: userData, isPending: isGettingUser } = useGetUser();

  useEffect(() => {
    if (userData) {
      setUser({
        userId: userData.$id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
        email: userData.email,
        type: userData.type,
      });
    }
  }, [userData]);

  return (
    <AuthContext.Provider value={{ user, setUser, isGettingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUserContext = () => useContext(AuthContext);
