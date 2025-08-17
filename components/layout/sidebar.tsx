"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { getModulesForRole } from "@/modules/registry"

interface SidebarProps {
  userRole: "user" | "admin"
  className?: string
}

interface SidebarState {
  [moduleId: string]: boolean
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [moduleStates, setModuleStates] = useState<SidebarState>({})

  const modules = getModulesForRole(userRole)

  // Load collapsed states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-module-states")
    if (saved) {
      try {
        setModuleStates(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse sidebar states:", error)
      }
    } else {
      // Default to expanded for all modules
      const defaultStates: SidebarState = {}
      modules.forEach((module) => {
        defaultStates[module.id] = true
      })
      setModuleStates(defaultStates)
    }
  }, [modules])

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-module-states", JSON.stringify(moduleStates))
  }, [moduleStates])

  const toggleModule = (moduleId: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const isRouteActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Fuel App</h2>
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isRouteActive("/dashboard")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Module Navigation */}
          {modules.map((module) => (
            <Collapsible
              key={module.id}
              open={moduleStates[module.id] || false}
              onOpenChange={() => toggleModule(module.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 h-auto font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-3">
                    <module.icon className="h-4 w-4" />
                    <span>{module.name}</span>
                  </div>
                  {moduleStates[module.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {module.routes
                  .filter((route) => !route.requireRole || route.requireRole === userRole)
                  .map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={cn(
                        "flex items-center gap-3 px-6 py-2 rounded-md text-sm transition-colors ml-3",
                        isRouteActive(route.path)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      {route.icon && <route.icon className="h-4 w-4" />}
                      <span>{route.label}</span>
                    </Link>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">v1.0.0 • {modules.length} modules</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="sm" className="lg:hidden fixed top-4 left-4 z-50" onClick={() => setIsOpen(true)}>
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

// Import BarChart3 for the dashboard link
import { BarChart3 } from "lucide-react"
