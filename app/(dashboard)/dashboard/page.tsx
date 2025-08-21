"use client";

import { StatCard } from "@/components/ui/stat-card";
import { useUser } from "@clerk/nextjs";
import { Activity, Car, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [modules, setModules] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      setTimeout(() => {
        // Mock modules data
        setModules([
          {
            id: "fuel-log",
            name: "Fuel Log",
            description: "Track vehicle fuel and maintenance",
            icon: Car,
            routes: [{ path: "/fuel-log" }],
          },
          {
            id: "admin",
            name: "Admin Panel",
            description: "User and system management",
            icon: Users,
            routes: [{ path: "/admin" }],
          },
        ]);

        // Mock system stats for admin users
        if (user.publicMetadata?.role === "admin") {
          setSystemStats({
            totalUsers: 156,
            activeUsers: 142,
          });
        }
        setLoading(false);
      }, 1000);
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return null;
  }

  if (!user) return null;

  const userRole = (user.publicMetadata?.role as string) || "user";

  return (
    <div className="space-y-8 p-6">
      {/* System Stats for Admins */}
      {userRole === "admin" && systemStats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers}
            description="Registered users"
            icon={Users}
            trend={{
              value: 12,
              label: "from last month",
              isPositive: true,
            }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
          />
          <StatCard
            title="Active Users"
            value={systemStats.activeUsers}
            description="Non-blocked users"
            icon={Activity}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
          />
          <StatCard
            title="Active Modules"
            value={modules.length}
            description="Available modules"
            icon={Zap}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
          />
          <StatCard
            title="System Health"
            value="98.5%"
            description="Uptime this month"
            icon={TrendingUp}
            trend={{
              value: 2.1,
              label: "from last month",
              isPositive: true,
            }}
            className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module: any) => (
          <StatCard
            key={module.id}
            title={module.name}
            value={module.routes.length}
            description={module.description}
            icon={module.icon}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200"
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-teal-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {modules.slice(0, 3).map((module: any) => (
              <a
                key={module.id}
                href={module.routes[0]?.path || "#"}
                className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group"
              >
                <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900 group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                  <module.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-medium">{module.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  System Status: Online
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  All systems operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:blue-900/20">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Welcome to the Modular App
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Explore the available modules
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
