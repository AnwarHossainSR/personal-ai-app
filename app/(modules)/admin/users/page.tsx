import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { UserManagementService } from "@/modules/admin/services/user-management-service";
import { redirect } from "next/navigation";
import UsersManagementPage from "./users-management-client";

export default async function UsersManagementServerPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "system_administrator") {
    redirect("/dashboard");
  }

  const users = await UserManagementService.getAllUsers();

  return (
    <UsersManagementPage initialUsers={users} currentUserId={user.userId} />
  );
}
