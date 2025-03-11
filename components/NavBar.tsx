import Link from "next/link";
import NavButton from "./NavButton";
import { HomeIcon, Settings } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="flex space-x-6">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <NavButton href="/" label="Home" icon={HomeIcon} />
        <span>Home</span>
      </Link>

      <Link
        href="/settings"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <NavButton href="/" label="settings" icon={Settings} />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default NavBar;
