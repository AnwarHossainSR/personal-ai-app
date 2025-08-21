"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getModulesForRole } from "@/modules/registry";
import { BarChart3, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface SidebarProps {
  userRole: "user" | "administrator";
  className?: string;
}

interface SidebarState {
  [moduleId: string]: boolean;
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [moduleStates, setModuleStates] = useState<SidebarState>({});

  const modules = useMemo(() => getModulesForRole(userRole), [userRole]);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-module-states");
    if (saved) {
      try {
        setModuleStates(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse sidebar states:", error);
        // Set default states on error
        const defaultStates: SidebarState = {};
        modules.forEach((module) => {
          defaultStates[module.id] = true;
        });
        setModuleStates(defaultStates);
      }
    } else {
      // Default to expanded for all modules
      const defaultStates: SidebarState = {};
      modules.forEach((module) => {
        defaultStates[module.id] = true;
      });
      setModuleStates(defaultStates);
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (Object.keys(moduleStates).length > 0) {
      localStorage.setItem(
        "sidebar-module-states",
        JSON.stringify(moduleStates)
      );
    }
  }, [moduleStates]);

  const toggleModule = (moduleId: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const isRouteActive = (path: string) => {
    return pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="rounded-lg flex items-center justify-center">
            <Image src="/logo.svg" alt="FuelApp Logo" width={50} height={50} />
          </div>
          <Link href="/" className="text-xl font-bold text-sidebar-foreground">
            Fuel App
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-sidebar-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              isRouteActive("/dashboard")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Module Navigation */}
          <div className="space-y-1 mt-6">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Modules
            </p>
            {modules.map((module) => (
              <Collapsible
                key={module.id}
                open={moduleStates[module.id] || false}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-3 h-auto font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <module.icon className="h-5 w-5" />
                      <span>{module.name}</span>
                    </div>
                    {moduleStates[module.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {module.routes
                    .filter(
                      (route) =>
                        !route.requireRole || route.requireRole === userRole
                    )
                    .map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={cn(
                          "flex items-center gap-3 px-8 py-2 rounded-lg text-sm transition-all duration-200 ml-4",
                          isRouteActive(route.path)
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {route.icon && <route.icon className="h-4 w-4" />}
                        <span>{route.label}</span>
                      </Link>
                    ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20">
        <div className="text-xs text-muted-foreground flex items-center justify-between">
          <span>v1.0.0</span>
          <span>{modules.length} modules</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
