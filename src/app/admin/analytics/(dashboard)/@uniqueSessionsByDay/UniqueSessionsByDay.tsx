"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { UniqueSessionsByDay } from "@/types/analytics";
import { LoadingResult } from "@/types/shared";
import { utc } from "@date-fns/utc";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "Sessions",
  },
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UniqueSessionsByDayChart(
  props: LoadingResult<UniqueSessionsByDay[]>,
) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Unique Daily Sessions</CardTitle>
        <CardDescription>
          Unique sessions grouped per day during selected date range
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={props.result}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id="fillCounts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: Date) => {
                  return format(value, "PP", { in: utc });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(_, meta) => {
                      const day = meta[0].payload.day;
                      return format(day, "PP", { in: utc });
                    }}
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCounts)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
