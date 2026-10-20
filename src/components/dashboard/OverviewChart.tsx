import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Transaction } from "@/types/finance";

interface OverviewChartProps {
  transactions: Transaction[];
}

export function OverviewChart({ transactions }: OverviewChartProps) {
  // Aggregate income by month
  const months = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
    "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
  ];

  const currentYear = new Date().getFullYear();
  const sampleIncome = [3200, 3800, 4100, 3600, 4500, 4800, 5200, 4700, 4300, 5000, 4900, 5300];
  const sampleExpense = [2400, 2900, 3100, 2800, 3500, 3700, 4000, 3600, 3300, 6700, 3800, 4100];

  const monthlyData = months.map((monthName, idx) => {
    const monthNum = idx + 1;
    const monthPrefix = `${currentYear}-${monthNum < 10 ? "0" + monthNum : monthNum}`;
    const monthTransactions = transactions.filter((t) => t.date.startsWith(monthPrefix));

    const monthIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const monthExpense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const isSample = monthTransactions.length === 0;

    return {
      name: monthName,
      kirim: isSample ? sampleIncome[idx] : Math.round(monthIncome / 1000),
      chiqim: isSample ? sampleExpense[idx] : Math.round(monthExpense / 1000),
      isSample,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.16} />
            <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => Number(value).toLocaleString("uz-UZ")}
        />
        <Tooltip
          formatter={(value, name, item) => [
            `${item.payload.isSample ? "Namuna: " : ""}${Number(value).toLocaleString("uz-UZ")} ming so‘m`,
            name === "kirim" ? "Kirim" : "Chiqim",
          ]}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderRadius: "0.75rem",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            fontSize: "12px",
            color: "var(--card-foreground)",
          }}
        />
        <Area
          type="monotone"
          dataKey="kirim"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#incomeFill)"
          activeDot={{ r: 5, strokeWidth: 0 }}
          name="kirim"
        />
        <Area
          type="monotone"
          dataKey="chiqim"
          stroke="var(--muted-foreground)"
          strokeWidth={2}
          fill="url(#expenseFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="chiqim"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
