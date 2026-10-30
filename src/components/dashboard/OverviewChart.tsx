import { useState } from "react";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";

interface OverviewChartProps {
  transactions: Transaction[];
}

export function OverviewChart({ transactions }: OverviewChartProps) {
  const [chartType, setChartType] = useState<"bar" | "area">("bar");

  const months = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
    "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
  ];

  const currentYear = new Date().getFullYear();
  const sampleIncome = [18500, 24200, 21800, 29400, 34100, 38900, 42500, 46000, 39800, 48200, 44000, 51200];
  const sampleExpense = [9200, 11400, 10200, 13800, 15100, 16900, 18200, 19400, 17500, 21000, 19800, 22400];

  const monthlyData = months.map((monthName, idx) => {
    const monthNum = idx + 1;
    const monthPrefix = `${currentYear}-${monthNum < 10 ? "0" + monthNum : monthNum}`;
    const monthTransactions = transactions.filter((t) => t.date.startsWith(monthPrefix));

    const realIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const realExpense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const isSample = monthTransactions.length === 0;
    const incomeValue = isSample ? sampleIncome[idx] : Math.round(realIncome / 1000);
    const expenseValue = isSample ? sampleExpense[idx] : Math.round(realExpense / 1000);

    return {
      name: monthName,
      tushum: incomeValue,
      xarajat: expenseValue,
      sof: Math.max(0, incomeValue - expenseValue),
      isSample,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="h-2.5 w-2.5 rounded-xs bg-foreground" />
            Tushum
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-xs bg-zinc-300 dark:bg-zinc-700" />
            Xarajat
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/40">
          <Button
            variant={chartType === "bar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setChartType("bar")}
            className="h-7 px-2.5 text-xs font-medium"
          >
            <BarChart3 className="mr-1 h-3.5 w-3.5" />
            Ustunli
          </Button>
          <Button
            variant={chartType === "area" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setChartType("area")}
            className="h-7 px-2.5 text-xs font-medium"
          >
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Chiziqli
          </Button>
        </div>
      </div>

      <div className="h-[290px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.6} />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}m` : `${value}k`}`}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-popover-foreground">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label} {currentYear}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-xs bg-foreground" />
                            Tushum:
                          </span>
                          <span className="font-semibold">
                            {(data.tushum * 1000).toLocaleString("uz-UZ")} so'm
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="h-2 w-2 rounded-xs bg-zinc-400" />
                            Xarajat:
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {(data.xarajat * 1000).toLocaleString("uz-UZ")} so'm
                          </span>
                        </div>
                        <div className="mt-1.5 border-t border-border pt-1.5 flex items-center justify-between gap-4 font-medium text-emerald-600 dark:text-emerald-400">
                          <span>Sof foyda:</span>
                          <span>{(data.sof * 1000).toLocaleString("uz-UZ")} so'm</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="tushum"
                fill="var(--foreground)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="xarajat"
                fill="currentColor"
                className="text-zinc-300 dark:text-zinc-700"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="zincAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.6} />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}m` : `${value}k`}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-popover-foreground">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label} {currentYear}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-xs bg-foreground" />
                            Tushum:
                          </span>
                          <span className="font-semibold">
                            {(data.tushum * 1000).toLocaleString("uz-UZ")} so'm
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="h-2 w-2 rounded-xs bg-zinc-400" />
                            Xarajat:
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {(data.xarajat * 1000).toLocaleString("uz-UZ")} so'm
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="tushum"
                stroke="var(--foreground)"
                strokeWidth={2}
                fill="url(#zincAreaGrad)"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
