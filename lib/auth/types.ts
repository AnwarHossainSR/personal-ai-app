export interface ClerkUser {
  userId: string;
  email: string;
  role: "user" | "administrator";
  imageUrl?: string;
}
