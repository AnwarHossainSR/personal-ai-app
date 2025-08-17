import { auth, currentUser } from "@clerk/nextjs/server";

export interface ClerkUser {
  userId: string;
  email: string;
  role: "user" | "system_administrator";
}

export async function getAuthUser(): Promise<ClerkUser | null> {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return null;

    return {
      userId,
      email: user.emailAddresses[0]?.emailAddress || "",
      role:
        (user.privateMetadata?.role as "user" | "system_administrator") ||
        "user",
    };
  } catch (error) {
    return null;
  }
}

export async function signOutAction() {
  // Clerk handles sign out through their components
  return { success: true, redirect: "/sign-in" };
}
