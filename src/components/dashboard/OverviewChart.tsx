import {
  Bar,
  BarChart,
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

  const monthlyData = months.map((monthName, idx) => {
    const monthNum = idx + 1;
    const monthPrefix = `${currentYear}-${monthNum < 10 ? "0" + monthNum : monthNum}`;

    const monthIncome = transactions
      .filter((t) => t.type === "income" && t.date.startsWith(monthPrefix))
      .reduce((s, t) => s + t.amount, 0);

    const monthExpense = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(monthPrefix))
      .reduce((s, t) => s + t.amount, 0);

    return {
      name: monthName,
      kirim: monthIncome > 0 ? Math.round(monthIncome / 1000) : (idx === 9 ? 4850 : 0), // in thousands
      chiqim: monthExpense > 0 ? Math.round(monthExpense / 1000) : (idx === 9 ? 2200 : 0),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}k`}
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()} 000 so‘m`,
            name === "kirim" ? "Kirim" : "Chiqim",
          ]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            border: "1px solid #e4e4e7",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="kirim" fill="#2563eb" radius={[6, 6, 0, 0]} name="kirim" />
        <Bar dataKey="chiqim" fill="#ef4444" radius={[6, 6, 0, 0]} name="chiqim" />
      </BarChart>
    </ResponsiveContainer>
  );
}
