"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FuelChartClientProps {
  data: Array<{
    month: string;
    cost: number;
    volume: number;
  }>;
}

export function FuelChartClient({ data }: FuelChartClientProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
        />
        <Bar dataKey="cost" fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
