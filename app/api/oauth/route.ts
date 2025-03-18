import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/appwrite/appwrite";
import { cookies } from "next/headers";

export async function GET(req: { url: string | URL }, res: any) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const userId = searchParams.get("userId");

    console.log("secret", secret);
    console.log("userId", userId);

    if (!secret || !userId) {
      return NextResponse.json(
        { error: "Missing secret or userId" },
        { status: 400 }
      );
    }

    const { account } = await createAdminClient();

    const session = await account.createSession(secret, userId);

    console.log("session", session);

    return NextResponse.json(
      { message: "User authenticated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
