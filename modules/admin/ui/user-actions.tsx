"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Ban, CheckCircle, UserCog } from "lucide-react"
import type { IUser } from "@/lib/auth/models"
import { updateUserRoleAction, blockUserAction, unblockUserAction } from "../actions/user-actions"
import { useRouter } from "next/navigation"

interface UserActionsProps {
  user: IUser
  currentUserId: string
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">(user.role)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isCurrentUser = user._id.toString() === currentUserId

  const handleRoleChange = async () => {
    setIsLoading(true)
    try {
      const result = await updateUserRoleAction({
        userId: user._id.toString(),
        role: selectedRole,
        reason,
      })

      if (result.success) {
        setIsRoleDialogOpen(false)
        setReason("")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlock = async () => {
    setIsLoading(true)
    try {
      const result = await blockUserAction({
        userId: user._id.toString(),
        reason,
      })

      if (result.success) {
        setIsBlockDialogOpen(false)
        setReason("")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to block user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async () => {
    setIsLoading(true)
    try {
      const result = await unblockUserAction({
        userId: user._id.toString(),
        reason,
      })

      if (result.success) {
        setIsUnblockDialogOpen(false)
        setReason("")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to unblock user:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {user.full_name} ({user.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">New Role</Label>
              <Select value={selectedRole} onValueChange={(value: "user" | "admin") => setSelectedRole(value)}>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Block {user.full_name} ({user.email}) from accessing the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blockReason">Reason *</Label>
              <Textarea
                id="blockReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for blocking this user..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlock} disabled={isLoading || !reason}>
              {isLoading ? "Blocking..." : "Block User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unblock User Dialog */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Restore access for {user.full_name} ({user.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unblockReason">Reason (Optional)</Label>
              <Textarea
                id="unblockReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for unblocking this user..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnblockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUnblock} disabled={isLoading}>
              {isLoading ? "Unblocking..." : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
