import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { getAuthUser } from "@/lib/auth/clerk-helpers"
import { redirect } from "next/navigation"

interface AppLayoutProps {
  children: ReactNode
}

export async function AppLayout({ children }: AppLayoutProps) {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
