import { extractUserId } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkUser } from "./types";

export async function getAuthUser(): Promise<ClerkUser | null> {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return null;
    const withoutPrefix = extractUserId(userId);
    return {
      userId: withoutPrefix,
      email: user.emailAddresses[0]?.emailAddress || "",
      role: (user.privateMetadata?.role as "user" | "administrator") || "user",
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    return null;
  }
}

export async function signOutAction() {
  // Clerk handles sign out through their components
  return { success: true, redirect: "/sign-in" };
}
