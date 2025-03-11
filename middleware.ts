import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("appwrite-session");

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!sessionCookie && isProtected) {
    const absoluteUrl = new URL("/sign-in", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  const isPublic = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (sessionCookie && isPublic) {
    const absoluteUrl = new URL("/dashboard", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
}
