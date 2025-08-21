"use client";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClerkUser } from "@/lib/auth/types";
import { moduleRegistry } from "@/modules/registry";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: ClerkUser;
}

export function Header({ user }: HeaderProps) {
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  const pathname = usePathname();

  const getTitle = (pathname: string) => {
    if (pathname === "/dashboard") return "App Dashboard";
    // Flatten all routes with a reference to their parent module
    const allRoutes = moduleRegistry.flatMap((m) =>
      m.routes.map((r) => ({ ...r, moduleName: m.name }))
    );

    // Find the route that matches current pathname
    const matchedRoute = allRoutes.find((route) => route.path === pathname);
    if (matchedRoute) {
      return matchedRoute.label || matchedRoute.moduleName;
    }

    // If no exact route match, maybe pathname starts with module root
    const matchedModule = moduleRegistry.find((m) =>
      pathname.startsWith(`/${m.id}`)
    );

    if (matchedModule) {
      return matchedModule.name;
    }

    return "Unknown Module";
  };

  return (
    <header className="flex items-center justify-end lg:justify-between md:justify-between px-6 py-4 bg-background border-b border-border">
      <div className="items-center gap-4 hidden lg:flex md:flex">
        <h1 className="text-xl font-semibold text-foreground ">
          {getTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl} alt={user.email} />
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
