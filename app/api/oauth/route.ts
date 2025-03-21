import {
  createAdminClient,
  createSessionClient,
} from "../../../lib/appwrite/appwrite";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { Query } from "node-appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  const { account, database } = await createAdminClient();
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

  const sessionClient = await createSessionClient();
  if (!sessionClient) {
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in`);
  }

  const user = await sessionClient.account.get();
  console.log("OAuth User:", user);

  const DATABASE_ID = process.env.DATABASE_ID!;
  const USER_COLLECTION_ID = process.env.USER_COLLECTION_ID!;

  try {
    const existingUsers = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    const fullName = user.name || "Unknown";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || ""; 
    const lastName = nameParts.slice(1).join(" ") || "";

    if (existingUsers.documents.length === 0) {
      await database.createDocument(DATABASE_ID, USER_COLLECTION_ID, user.$id, {
        userId: user.$id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        mobile: user.phone || "",
      });
      console.log("User created successfully.");
    } else {
      console.log("User already exists in the database.");
    }
    return NextResponse.redirect(`${request.nextUrl.origin}/profile`);
  } catch (error) {
    console.error("Error in OAuth flow:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in`);
  }
}
