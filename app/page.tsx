
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black-500 h-full text-2xl flex flex-col items-center justify-center">
      <Link href="/">Home</Link>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
}
