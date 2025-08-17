"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IUser } from "@/lib/auth/models";
import {
  AlertCircle,
  Ban,
  CheckCircle,
  MoreHorizontal,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  blockUserClientAction,
  unblockUserClientAction,
  updateUserRoleClientAction,
} from "../actions/client-actions";

interface UserActionsProps {
  user: IUser;
  currentUserId: string;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">(user.role);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isCurrentUser = user._id.toString() === currentUserId;

  const resetDialog = () => {
    setReason("");
    setError(null);
    setSelectedRole(user.role);
  };

  const handleRoleChange = async () => {
    const formData = new FormData();
    formData.append("userId", user._id.toString());
    formData.append("role", selectedRole);
    formData.append("reason", reason);

    startTransition(async () => {
      const result = await updateUserRoleClientAction(formData);

      if (result.success) {
        setIsRoleDialogOpen(false);
        resetDialog();
        router.refresh();
      } else {
        setError(result.error || "Failed to update user role");
      }
    });
  };

  const handleBlock = async () => {
    const formData = new FormData();
    formData.append("userId", user._id.toString());
    formData.append("reason", reason);

    startTransition(async () => {
      const result = await blockUserClientAction(formData);

      if (result.success) {
        setIsBlockDialogOpen(false);
        resetDialog();
        router.refresh();
      } else {
        setError(result.error || "Failed to block user");
      }
    });
  };

  const handleUnblock = async () => {
    const formData = new FormData();
    formData.append("userId", user._id.toString());
    formData.append("reason", reason);

    startTransition(async () => {
      const result = await unblockUserClientAction(formData);

      if (result.success) {
        setIsUnblockDialogOpen(false);
        resetDialog();
        router.refresh();
      } else {
        setError(result.error || "Failed to unblock user");
      }
    });
  };

  const handleDialogClose = (dialogType: "role" | "block" | "unblock") => {
    if (isPending) return; // Prevent closing while loading

    resetDialog();

    switch (dialogType) {
      case "role":
        setIsRoleDialogOpen(false);
        break;
      case "block":
        setIsBlockDialogOpen(false);
        break;
      case "unblock":
        setIsUnblockDialogOpen(false);
        break;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {!isCurrentUser && (
            <>
              <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
                <UserCog className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>

              {user.is_blocked ? (
                <DropdownMenuItem onClick={() => setIsUnblockDialogOpen(true)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unblock User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setIsBlockDialogOpen(true)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Block User
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Change Dialog */}
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={() => handleDialogClose("role")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {user.full_name} ({user.email})
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">New Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: "user" | "admin") =>
                  setSelectedRole(value)
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for role change..."
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose("role")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={isPending}>
              {isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog
        open={isBlockDialogOpen}
        onOpenChange={() => handleDialogClose("block")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Block {user.full_name} ({user.email}) from accessing the system
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blockReason">Reason *</Label>
              <Textarea
                id="blockReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for blocking this user..."
                required
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose("block")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlock}
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Blocking..." : "Block User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unblock User Dialog */}
      <Dialog
        open={isUnblockDialogOpen}
        onOpenChange={() => handleDialogClose("unblock")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Restore access for {user.full_name} ({user.email})
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unblockReason">Reason (Optional)</Label>
              <Textarea
                id="unblockReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for unblocking this user..."
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose("unblock")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUnblock} disabled={isPending}>
              {isPending ? "Unblocking..." : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
