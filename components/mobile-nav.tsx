"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  PlusCircleIcon,
  User2Icon,
  LayoutDashboard,
  ContactIcon,
  LogOutIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSignOut } from "@/lib/query/queries";
import NavButton from "./NavButton";
import Loading from "./Loading";

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  href?: string;
  onClick?: () => void;
}

const navItems: NavItem[] = [];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync: signOut } = useSignOut();

  const handleLogOut = async () => {
    const response = await signOut();
    if (response?.success) {
      router.push("/sign-in");
    }
  };
  const handleNavClick = (href: string) => {
    setLoading(true);
    setOpen(false);
    router.push(href);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="rounded-full w-10 h-10 p-0 ">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-md [&>button]:hidden"
        >
          <SheetHeader>
            <SheetDescription />
            <SheetClose asChild>
              <button className="absolute right-4 top-4 cursor-pointer dark:text-white">
                <X className="w-6 h-6" />
              </button>
            </SheetClose>
            <SheetTitle className="flex justify-center font-bold cursor-pointer">
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-8 cursor-pointer">
            {loading && <Loading />}
            {navItems.map((item) => (
              <button
                key={item.title}
                className="flex items-center gap-3 text-lg font-medium transition-all hover:text-primary hover:underline hover:underline-offset-[8px]"
                onClick={() => item.href && handleNavClick(item.href)}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </button>
            ))}
            <NavButton
              label="Create Order"
              title="Create Order"
              icon={PlusCircleIcon}
              href="/dashboard/create"
              onClick={() => handleNavClick("/dashboard/create")}
            />
            <NavButton
              label="Dashboard"
              title="Dashboard"
              icon={LayoutDashboard}
              href="/dashboard"
              onClick={() => handleNavClick("/dashboard")}
            />
            <NavButton
              label="Profile"
              title="Profile"
              icon={User2Icon}
              href="/profile"
              onClick={() => handleNavClick("/profile")}
            />
            <NavButton
              label="Contact"
              title="Contact"
              icon={ContactIcon}
              href="/contact"
              onClick={() => handleNavClick("/contact")}
            />
            <NavButton
              label="Logout"
              title="Logout"
              icon={LogOutIcon}
              onClick={() => {
                handleLogOut();
                setOpen(false);
              }}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
