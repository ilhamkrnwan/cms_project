import { format, parseISO, subDays } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock content analytics data for the last 30 days
const generateData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: date.toISOString().split("T")[0],
      publishedArticles: Math.floor(Math.random() * 5) + 1,
      contentViews: Math.floor(Math.random() * 500) + 200,
      socialShares: Math.floor(Math.random() * 80) + 20,
    });
  }
  return data;
};

const chartData = generateData();

const chartConfig = {
  publishedArticles: {
    label: "Published Articles",
    color: "hsl(var(--primary))",
  },
  contentViews: {
    label: "Content Views",
    color: "hsl(var(--chart-2, 217 91% 60%))",
  },
  socialShares: {
    label: "Social Shares",
    color: "hsl(var(--chart-3, 142 71% 45%))",
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Distribution & Reach</CardTitle>
          <CardDescription>Publication activity and engagement across connected adapters</CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillContentViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-contentViews)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--color-contentViews)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              dataKey="contentViews"
              type="monotone"
              fill="url(#fillContentViews)"
              stroke="var(--color-contentViews)"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              dataKey="socialShares"
              type="monotone"
              stroke="var(--color-socialShares)"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              dataKey="publishedArticles"
              type="monotone"
              stroke="var(--color-publishedArticles)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
