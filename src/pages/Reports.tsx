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

const formatCurrency = (n: number) => n.toLocaleString("uz-UZ") + " so‘m";

export default function Reports() {
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

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t) => {
    if (!fromDate && !toDate) return true;
    if (fromDate && t.date < fromDate) return false;
    if (toDate && t.date > toDate) return false;
    return true;
  });

  const periodIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const periodExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const periodNet = periodIncome - periodExpense;

  // Occupancy rate calculation for rooms in period
  const totalRoomsCount = rooms.length || 1;
  const occupiedRoomsCount = rooms.filter((r) => r.status === "Band").length;
  const occupancyRate = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  // Category breakdown for Income & Expense
  const incomeByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === "income")
    .forEach((t) => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });

  const expenseByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Sana,Turi,Kategoriya,Tavsif,Summa\n";
    const rows = filteredTransactions
      .map(
        (t) =>
          `${t.id},${t.date},${t.type === "income" ? "Kirim" : "Chiqim"},"${t.category}","${t.description}",${t.amount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OriginHotel_Moliya_Hisobot_${fromDate}_${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hisobotlar va Tahlil</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tanlangan davr bo‘yicha Kirim, Chiqim, Sof natija va Bandlik ko‘rsatkichlari
          </p>
        </div>

        {/* Date Filter + Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs">
            <span className="text-xs text-gray-400 font-medium">Dan:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-xs font-semibold text-gray-700 outline-none bg-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm">—</span>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs">
            <span className="text-xs text-gray-400 font-medium">Gacha:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-xs font-semibold text-gray-700 outline-none bg-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            CSV Yuklab olish
          </button>
        </div>
      </div>

      {/* TZ Required 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami Kirim */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              Kirim
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400">Tanlangan davr kirimi</p>
          <p className="text-xl font-black text-green-600 mt-1">{formatCurrency(periodIncome)}</p>
        </div>

        {/* Jami Chiqim */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              Chiqim
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400">Tanlangan davr chiqimi</p>
          <p className="text-xl font-black text-red-600 mt-1">{formatCurrency(periodExpense)}</p>
        </div>

        {/* Sof Natija */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Sof Natija
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400">Kirim − Chiqim</p>
          <p className={`text-xl font-black mt-1 ${periodNet >= 0 ? "text-blue-600" : "text-red-500"}`}>
            {formatCurrency(periodNet)}
          </p>
        </div>

        {/* Bandlik Ko'rsatkichi */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              Bandlik
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400">Xonalar bandligi</p>
          <p className="text-xl font-black text-purple-700 mt-1">
            {occupancyRate}% ({occupiedRoomsCount}/{totalRoomsCount} xona)
          </p>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kirim Kategoriyalari */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Kirimlar taqsimoti (5 ta kategoriya)
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
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Chiqimlar taqsimoti (5 ta kategoriya)
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
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">
            Davr tranzaksiyalari ro‘yxati ({filteredTransactions.length} ta yozuv)
          </h3>
          <span className="text-xs text-gray-400">
            {fromDate} dan {toDate} gacha
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-left text-xs uppercase font-semibold">
                <th className="px-6 py-3.5">Sana</th>
                <th className="px-6 py-3.5">Turi</th>
                <th className="px-6 py-3.5">Kategoriya</th>
                <th className="px-6 py-3.5">Tavsif</th>
                <th className="px-6 py-3.5 text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Tanlangan sanalarda hech qanday tranzaksiya qayd etilmagan
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-6 py-3.5 text-xs text-gray-600 font-mono flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {tx.date}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.type === "income" ? "Kirim" : "Chiqim"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800">{tx.category}</td>
                    <td className="px-6 py-3.5 text-gray-600 text-xs">{tx.description}</td>
                    <td className="px-6 py-3.5 text-right font-black">
                      <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                        {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200 text-xs font-bold">
                <td colSpan={4} className="px-6 py-3.5 text-gray-700">
                  Davr bo‘yicha sof natija (Kirim − Chiqim)
                </td>
                <td className={`px-6 py-3.5 text-right text-sm ${periodNet >= 0 ? "text-blue-600" : "text-red-500"}`}>
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
