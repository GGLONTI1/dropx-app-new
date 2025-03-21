"use client";

import {
  ContactIcon,
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
import { MobileNav } from "./mobile-nav";
import { Sheet, SheetTrigger } from "./ui/sheet";

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
    <div className="min-h-16 flex items-center justify-between border-b border-black dark:border-white ">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">
          <Link href="/dashboard">
            <span className="cursor-pointer">DROP</span>
          </Link>
          <span className="text-red-500 cursor-pointer">X</span>
        </h2>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <NavButton
          href="/dashboard"
          label="dashboard"
          icon={LayoutDashboard}
          title="Dashboard"
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
          href="/contact"
          label="Contact"
          title="Contact"
          icon={ContactIcon}
          onClick={() => {}}
        />
        <NavButton
          className="hover:bg-green-600"
          href="/dashboard/create"
          label="dashboard"
          icon={PlusCircleIcon}
          title="Create Order "
          onClick={() => {}}
        />
        <ThemeToggle />
        <div className="bg-red-500 h-5 w-1"></div>{" "}
        <NavButton label="Logout" icon={LogOutIcon} onClick={handleLogOut} />
      </div>
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-full w-10 h-10 flex items-center justify-center" />
          </SheetTrigger>
          <MobileNav />
        </Sheet>
      </div>
    </div>
  );
}
