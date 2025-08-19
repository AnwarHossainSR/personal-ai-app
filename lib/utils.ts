import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractUserId(clerkUserId: string) {
  if (!clerkUserId || typeof clerkUserId !== "string") {
    return clerkUserId;
  }

  return clerkUserId.startsWith("user_")
    ? clerkUserId.replace(/^user_/, "")
    : clerkUserId;
}
