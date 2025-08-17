// app/(modules)/admin/components/chart-section.tsx - Client Component
"use client";

import { ChartWrapper } from "@/components/ui/chart-wrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartSectionProps {
  userDistributionData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  moduleUsageData: Array<{
    name: string;
    users: number;
    enabled: boolean;
  }>;
}

export function ChartSection({
  userDistributionData,
  moduleUsageData,
}: ChartSectionProps) {
  // Define chart colors
  const chartColors = {
    primary: "#3b82f6", // Blue
    secondary: "#10b981", // Green
    accent: "#f59e0b", // Amber
    warning: "#ef4444", // Red
    info: "#8b5cf6", // Purple
  };

  // Enhanced module usage data with colors
  const enhancedModuleData = moduleUsageData.map((module, index) => ({
    ...module,
    fill: module.enabled
      ? index === 0
        ? chartColors.primary
        : chartColors.secondary
      : chartColors.warning,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartWrapper
        title="User Distribution"
        description="Breakdown of user types and status"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill={chartColors.primary}
              dataKey="value"
            >
              {userDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Module Usage" description="Active users per module">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enhancedModuleData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.7)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.7)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Bar dataKey="users" radius={[4, 4, 0, 0]}>
              {enhancedModuleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
