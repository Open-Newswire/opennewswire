"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Search Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TopSearchesChart({ data }: { data: any }) {
  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart layout="vertical" data={data}>
        <CartesianGrid vertical={true} />
        <XAxis type="number" dataKey="count" allowDecimals={false} />
        <YAxis
          dataKey="query"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={120}
        />
        <Bar dataKey="count" fill="var(--primary)" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
