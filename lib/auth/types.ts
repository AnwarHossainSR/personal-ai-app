export interface ClerkUser {
  userId: string;
  email: string;
  role: "user" | "system_administrator";
}
