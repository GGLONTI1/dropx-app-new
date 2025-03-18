// src/app/oauth/route.js

import { createAdminClient } from "../../../lib/appwrite/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();
  if (!userId || !secret) {
    return NextResponse.json(
      { error: "Missing userId or secret" },
      { status: 400 }
    );
  }
  const session = await account.createSession(userId, secret);

  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/account`);
}
