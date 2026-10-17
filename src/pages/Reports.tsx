import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Percent,
} from "lucide-react";
import { StorageService } from "@/services/storage";
import type { Transaction } from "@/types/finance";
import type { Room } from "@/types/room";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

export default function Reports() {
  const { isDark } = useTheme();
  const { t, locale, translateCategory } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Default from 1st of current month to end of current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(lastDay);

  const loadData = () => {
    setTransactions(StorageService.getTransactions());
    setRooms(StorageService.getRooms());
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const formatCurrency = (n: number) =>
    n.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((tx) => {
    if (!fromDate && !toDate) return true;
    if (fromDate && tx.date < fromDate) return false;
    if (toDate && tx.date > toDate) return false;
    return true;
  });

  const periodIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const periodExpense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const periodNet = periodIncome - periodExpense;

  // Occupancy rate calculation for rooms in period
  const totalRoomsCount = rooms.length || 1;
  const occupiedRoomsCount = rooms.filter((r) => r.status === "Band").length;
  const occupancyRate = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  // Category breakdown for Income & Expense
  const incomeByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((tx) => tx.type === "income")
    .forEach((tx) => {
      incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
    });

  const expenseByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    });

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Sana,Turi,Kategoriya,Tavsif,Summa\n";
    const rows = filteredTransactions
      .map(
        (tx) =>
          `${tx.id},${tx.date},${tx.type === "income" ? "Kirim" : "Chiqim"},"${tx.category}","${tx.description}",${tx.amount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OriginHotel_Report_${fromDate}_${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isDark ? "p-6 space-y-6 min-h-screen bg-slate-950 text-slate-100" : "p-6 space-y-6 min-h-screen bg-gray-50 text-gray-900"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.reports')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t('reports.subtitle')}
          </p>
        </div>

        {/* Date Filter + Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={isDark ? "flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-xs" : "flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs"}>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">{t('reports.from')}:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-xs font-semibold text-gray-700 dark:text-white outline-none bg-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm">—</span>
          <div className={isDark ? "flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-xs" : "flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs"}>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">{t('reports.to')}:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-xs font-semibold text-gray-700 dark:text-white outline-none bg-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {t('reports.export')}
          </button>
        </div>
      </div>

      {/* 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami Kirim */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300">
              {t('status.income')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.periodIncome')}</p>
          <p className="text-xl font-black text-green-600 dark:text-green-400 mt-1">{formatCurrency(periodIncome)}</p>
        </div>

        {/* Jami Chiqim */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300">
              {t('status.expense')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.periodExpense')}</p>
          <p className="text-xl font-black text-red-600 dark:text-red-400 mt-1">{formatCurrency(periodExpense)}</p>
        </div>

        {/* Sof Natija */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300">
              {t('finance.netProfit')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.periodNet')}</p>
          <p className={`text-xl font-black mt-1 ${periodNet >= 0 ? "text-blue-600 dark:text-sky-400" : "text-red-500"}`}>
            {formatCurrency(periodNet)}
          </p>
        </div>

        {/* Bandlik Ko'rsatkichi */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
              {t('reports.occupancy')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.occupancy')}</p>
          <p className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1">
            {occupancyRate}% ({occupiedRoomsCount}/{totalRoomsCount})
          </p>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kirim Kategoriyalari */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"}>
          <h3 className={isDark ? "text-sm font-bold text-white mb-4 flex items-center gap-2" : "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"}>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            {t('reports.incomeStructure')}
          </h3>
          <div className="space-y-3">
            {[
              "Xona haqi",
              "Ovqatlanish",
              "Qo‘shimcha xizmatlar",
              "Ijara",
              "Boshqa kirim",
            ].map((cat) => {
              const amount = incomeByCategory[cat] || 0;
              const percent = periodIncome > 0 ? Math.round((amount / periodIncome) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={isDark ? "font-semibold text-slate-300" : "font-semibold text-gray-700"}>{translateCategory(cat)}</span>
                    <span className={isDark ? "font-bold text-white" : "font-bold text-gray-900"}>
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chiqim Kategoriyalari */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"}>
          <h3 className={isDark ? "text-sm font-bold text-white mb-4 flex items-center gap-2" : "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            {t('reports.expenseStructure')}
          </h3>
          <div className="space-y-3">
            {[
              "Ish haqi",
              "Kommunal to‘lovlar",
              "Material/xaridlar",
              "Ta’mirlash",
              "Boshqa chiqim",
            ].map((cat) => {
              const amount = expenseByCategory[cat] || 0;
              const percent = periodExpense > 0 ? Math.round((amount / periodExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={isDark ? "font-semibold text-slate-300" : "font-semibold text-gray-700"}>{translateCategory(cat)}</span>
                    <span className={isDark ? "font-bold text-white" : "font-bold text-gray-900"}>
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Details Table for this period */}
      <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" : "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <h3 className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-gray-900"}>
            {t('reports.allOperations')} ({filteredTransactions.length})
          </h3>
          <span className="text-xs text-gray-400 dark:text-slate-400">
            {fromDate} — {toDate}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-slate-800/80 text-slate-300 text-left text-xs uppercase font-semibold" : "bg-gray-50/70 text-gray-500 text-left text-xs uppercase font-semibold"}>
                <th className="px-6 py-3.5">{t('common.date')}</th>
                <th className="px-6 py-3.5">{t('common.type')}</th>
                <th className="px-6 py-3.5">{t('common.category')}</th>
                <th className="px-6 py-3.5">{t('common.description')}</th>
                <th className="px-6 py-3.5 text-right">{t('common.amount')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className={isDark ? "hover:bg-slate-800/50 transition" : "hover:bg-blue-50/30 transition"}>
                    <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {tx.date}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          tx.type === "income"
                            ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/40"
                            : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40"
                        }`}
                      >
                        {tx.type === "income" ? `+ ${t('status.income')}` : `- ${t('status.expense')}`}
                      </span>
                    </td>
                    <td className={isDark ? "px-6 py-3.5 font-semibold text-slate-200" : "px-6 py-3.5 font-semibold text-gray-800"}>
                      {translateCategory(tx.category)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400 text-xs">{tx.description}</td>
                    <td className="px-6 py-3.5 text-right font-black">
                      <span className={tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className={isDark ? "bg-slate-800 border-t-2 border-slate-700 text-xs font-bold" : "bg-gray-50 border-t-2 border-gray-200 text-xs font-bold"}>
                <td colSpan={4} className={isDark ? "px-6 py-3.5 text-slate-200" : "px-6 py-3.5 text-gray-700"}>
                  {t('reports.periodNet')}
                </td>
                <td className={`px-6 py-3.5 text-right text-sm ${periodNet >= 0 ? "text-blue-600 dark:text-sky-400" : "text-red-500"}`}>
                  {formatCurrency(periodNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
