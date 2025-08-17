import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getAuthUser } from "@/lib/auth/clerk-helpers";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const user = await getAuthUser();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role!} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user!} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
