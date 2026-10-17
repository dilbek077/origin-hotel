import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import TransactionModal from "@/components/finance/TransactionModal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

const formatCurrency = (amount: number) =>
  amount.toLocaleString("uz-UZ") + " so‘m";

export default function Finance() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");

  const loadTransactions = () => {
    setTransactions(StorageService.getTransactions());
  };

  useEffect(() => {
    loadTransactions();
    const handleStorageChange = () => loadTransactions();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const handleOpenAdd = (type: "income" | "expense") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Transaction, "id">) => {
    return StorageService.addTransaction(data);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Haqiqatan ham bu yozuvni o‘chirmoqchimisiz?")) {
      StorageService.deleteTransaction(id);
    }
  };

  const filtered = transactions.filter((t) => {
    if (activeTab === "all") return true;
    return t.type === activeTab;
  });

  return (
    <div className={isDark ? "p-6 space-y-6 min-h-screen bg-slate-950 text-slate-100" : "p-6 space-y-6 min-h-screen bg-gray-50 text-gray-900"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.finance')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mehmonxonaning to‘liq moliyaviy hisob-kitoblari va kassa amallari
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAdd("income")}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            + Kirim qo‘shish
          </button>
          <button
            onClick={() => handleOpenAdd("expense")}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            - Chiqim qo‘shish
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Jami daromad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jami kirim (Daromad)</p>
            <p className="text-2xl font-black text-green-600 mt-0.5">{formatCurrency(totalIncome)}</p>
            <span className="text-xs text-gray-400">
              {transactions.filter((t) => t.type === "income").length} ta tranzaksiya
            </span>
          </div>
        </div>

        {/* Jami xarajat */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jami chiqim (Xarajat)</p>
            <p className="text-2xl font-black text-red-600 mt-0.5">{formatCurrency(totalExpense)}</p>
            <span className="text-xs text-gray-400">
              {transactions.filter((t) => t.type === "expense").length} ta tranzaksiya
            </span>
          </div>
        </div>

        {/* Sof foyda */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            netProfit >= 0 ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
          }`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sof natija (Foyda)</p>
            <p className={`text-2xl font-black mt-0.5 ${netProfit >= 0 ? "text-blue-600" : "text-red-500"}`}>
              {formatCurrency(netProfit)}
            </p>
            <span className="text-xs text-gray-400">
              Kirim − Chiqim farqi
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Barchasi ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === "income"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Kirimlar (5 ta kategoriya)
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === "expense"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Chiqimlar (5 ta kategoriya)
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-left text-xs uppercase font-semibold">
                <th className="px-6 py-3.5">№</th>
                <th className="px-6 py-3.5">Sana</th>
                <th className="px-6 py-3.5">Turi</th>
                <th className="px-6 py-3.5">Kategoriya</th>
                <th className="px-6 py-3.5">Tavsif / Izoh</th>
                <th className="px-6 py-3.5 text-right">Summa</th>
                <th className="px-6 py-3.5 text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Ma’lumot topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {row.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          row.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.type === "income" ? "+ Kirim" : "- Chiqim"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{row.category}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{row.description}</td>
                    <td className="px-6 py-4 text-right font-black whitespace-nowrap">
                      <span className={row.type === "income" ? "text-green-600" : "text-red-600"}>
                        {row.type === "income" ? "+" : "-"} {formatCurrency(row.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(row.id)}
                        title="O‘chirish"
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income/Expense Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        defaultType={modalType}
      />
    </div>
  );
}
