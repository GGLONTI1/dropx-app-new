"use client";

import {
  ContactIcon,
  House,
  LayoutDashboard,
  LogOutIcon,
  PlusCircleIcon,
  User2Icon,
} from "lucide-react";
import NavButton from "./NavButton";
import { useSignOut } from "@/lib/query/queries";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const { mutateAsync: signOut, isPending } = useSignOut();

  const handleLogOut = async () => {
    const response = await signOut();
    if (response?.success) {
      router.push("/sign-in");
    }
  };

  return (
    <div className="h-16 flex items-center justify-between border-b border-black dark:border-white ">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">
          <Link href="/dashboard">
            <span className="cursor-pointer">DROP</span>
          </Link>
          <span className="text-red-500">X</span>
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <NavButton
          href="/dashboard/create"
          label="dashboard"
          icon={PlusCircleIcon}
          title="Create Order "
          onClick={() => {}}
        />
        <NavButton
          href="/profile"
          title="Profile"
          label="Profile"
          icon={User2Icon}
          onClick={() => {}}
        />
        <NavButton
          href="/dashboard"
          label="dashboard"
          icon={LayoutDashboard}
          title="Dashboard"
          onClick={() => {}}
        />
        <NavButton
          href="/contact"
          label="Contact"
          title="Contact"
          icon={ContactIcon}
          onClick={() => {}}
        />
        <ThemeToggle />
        <div className="bg-red-500 h-5 w-1"></div>{" "}
        <NavButton label="Logout" icon={LogOutIcon} onClick={handleLogOut} />
      </div>
    </div>
  );
}
