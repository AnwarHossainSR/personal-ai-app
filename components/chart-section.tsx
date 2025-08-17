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
              fill="#8884d8"
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
          <BarChart data={moduleUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
