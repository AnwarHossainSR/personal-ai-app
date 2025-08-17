import { Badge } from "@/components/ui/badge";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { getAuthUser } from "@/lib/auth/clerk-helpers";
import type { IUser } from "@/lib/auth/models";
import { UserManagementService } from "@/modules/admin/services/user-management-service";
import { UserActions } from "@/modules/admin/ui/user-actions";
import { Shield, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UsersManagementPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await UserManagementService.getAllUsers();

  const columns: DataGridColumn<IUser>[] = [
    {
      key: "full_name",
      header: "Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      searchable: true,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "admin" ? "default" : "secondary"}>
          {value === "admin" ? (
            <Shield className="mr-1 h-3 w-3" />
          ) : (
            <User className="mr-1 h-3 w-3" />
          )}
          {value}
        </Badge>
      ),
    },
    {
      key: "is_blocked",
      header: "Status",
      sortable: true,
      render: (value) => (
        <Badge variant={value ? "destructive" : "default"}>
          {value ? "Blocked" : "Active"}
        </Badge>
      ),
    },
    {
      key: "email_verified",
      header: "Verified",
      sortable: true,
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "_id",
      header: "Actions",
      render: (value, row) => (
        <UserActions user={row} currentUserId={user.userId} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
      </div>

      <DataGrid
        data={users}
        columns={columns}
        emptyMessage="No users found."
        pageSize={20}
      />
    </div>
  );
}
