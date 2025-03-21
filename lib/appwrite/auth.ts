"use server";

import { ProfileFormValues, userDataType } from "@/typings";
import { createAdminClient, createSessionClient } from "./appwrite";
import { cookies, headers } from "next/headers";
import { ID, OAuthProvider, Query } from "node-appwrite";
import { OrderData } from "@/components/forms/OrderForm";
import { redirect } from "next/navigation";

const { account, database } = await createAdminClient();

export async function SignUp(userData: userDataType) {
  const { email, password, mobile } = userData;
  try {
    const newAccount = await account.create(ID.unique(), email, password);
    //if no new account return error
    if (!newAccount) {
      throw new Error("Failed to create user");
    }
    //create a new document in the database
    const newUser = await saveUserToDb(userData, newAccount.$id);
    if (!newUser) {
      throw new Error("Failed to save user");
    }

    //create session

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to signup user");
  }
}

export async function saveUserToDb(userData: userDataType, userId: string) {
  const { firstName, lastName, email, mobile } = userData;
  try {
    const newUser = await database.createDocument(
      process.env.DATABASE_ID!,
      process.env.USER_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        firstName,
        lastName,
        mobile,
        email,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser() {
  try {
    const sessionUser = await checkAuth();

    let user;
    if (sessionUser) {
      user = await getUserDetails(sessionUser.$id);
      return user;
    }
    if (!sessionUser) {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function checkAuth() {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) return null;

    const { account } = sessionClient;

    const session = await account.get();

    if (!session) return null;

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserDetails(userId: string) {
  try {
    const user = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.USER_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );
    if (user.total === 0) {
      return null;
    }
    return JSON.parse(JSON.stringify(user.documents[0]));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function SignIn(email: string, password: string) {
  console.log("function:" + email, password);

  try {
    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to sign in user");
  }
}

export async function SignOut() {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) return null;
    const { account } = sessionClient;
    (await cookies()).delete("appwrite-session");

    await account.deleteSession("current");

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to sign out user");
  }
}

export async function signInWithGoogle() {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  console.log("OAuth Origin:", origin);

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/api/oauth`,
    `${origin}/sign-in`,
    [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ]
  );

  if (!redirectUrl) {
    throw new Error("Failed to create OAuth2 token");
  }

  return redirect(redirectUrl);
}

export async function createOrder(orderData: OrderData) {
  try {
    const newOrder = await database.createDocument(
      process.env.DATABASE_ID!,
      process.env.ORDER_COLLECTION_ID!,
      ID.unique(),
      orderData
    );

    console.log("Order saved successfully:", newOrder);
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getCouriers() {
  try {
    const couriers = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.USER_COLLECTION_ID!,
      [Query.equal("type", "courier")]
    );
    if (couriers.total === 0) {
      return null;
    }
    return JSON.parse(JSON.stringify(couriers.documents));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOrdersById(author: string) {
  try {
    const orders = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.ORDER_COLLECTION_ID!,
      [Query.equal("author", author)]
    );
    return orders.documents;
  } catch (error) {
    console.error("Error Loading order:", error);
    throw error;
  }
}

export async function updateProfile(user: ProfileFormValues) {
  const { id, firstName, lastName, phone } = user;
  try {
    const response = await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.USER_COLLECTION_ID!,
      id,
      {
        firstName,
        lastName,
        mobile: phone,
      }
    );
    return { sucess: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteOrderById(orderId: string) {
  const response = await database.deleteDocument(
    process.env.DATABASE_ID!,
    process.env.ORDER_COLLECTION_ID!,
    orderId
  );
  return response;
}

export async function getOrderById(orderId: string) {
  try {
    const order = await database.getDocument(
      process.env.DATABASE_ID!,
      process.env.ORDER_COLLECTION_ID!,
      orderId
    );
    console.log("Order fetched successfully:", order);
    return order;
  } catch (error) {
    console.error("Error loading order:", error);
    throw error;
  }
}

export async function updateOrder(orderId: string, orderData: OrderData) {
  try {
    const response = await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.ORDER_COLLECTION_ID!,
      orderId,
      orderData
    );
    console.log("Order updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}
