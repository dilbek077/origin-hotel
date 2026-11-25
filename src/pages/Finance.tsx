import { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Plus,
  Minus,
  Trash2,
  Calendar,
} from "lucide-react";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import TransactionModal from "@/components/finance/TransactionModal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button } from "@/components/ui/button";

export default function Finance() {
  const { isDark } = useTheme();
  const { t, translateCategory } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");
  const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);

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

  const formatCurrency = (amount: number) =>
    Math.abs(amount).toLocaleString('en-US') + " so'm";

  const handleOpenAdd = (type: "income" | "expense") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Transaction, "id">) => {
    return StorageService.addTransaction(data);
  };

  const handleDelete = (id: number) => {
    setDeleteTransactionId(id);
  };

  const confirmDeleteTransaction = () => {
    if (deleteTransactionId === null) return;
    StorageService.deleteTransaction(deleteTransactionId);
    setDeleteTransactionId(null);
  };

  const filtered = transactions.filter((tItem) => {
    if (activeTab === "all") return true;
    return tItem.type === activeTab;
  });

  return (
    <div className={isDark ? "min-h-screen bg-[#06090e] p-6 text-slate-100 space-y-6" : "min-h-screen bg-gray-50 p-6 text-gray-900 space-y-6"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-[2.1rem] font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {t('nav.finance')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('finance.subtitle')}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <Button
            type="button"
            onClick={() => handleOpenAdd("income")}
            className="w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>Kirim qo‘shish</span>
          </Button>
          <Button
            type="button"
            onClick={() => handleOpenAdd("expense")}
            className="w-full sm:w-auto"
          >
            <Minus size={16} />
            <span>Chiqim qo‘shish</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Jami daromad */}
        <div className={isDark ? "min-h-36 rounded-lg border border-slate-800/80 bg-card p-4 shadow-sm" : "min-h-36 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Jami daromad (kirim)</p>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
            isDark
              ? "bg-[#092218] border border-emerald-900/40 text-emerald-400"
              : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}>
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 min-w-0">
            <p className={`whitespace-nowrap text-xl font-bold tracking-tight ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>{formatCurrency(totalIncome)}</p>
            <span className={`mt-0.5 block text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              {transactions.filter((tItem) => tItem.type === "income").length} ta amal
            </span>
          </div>
        </div>

        {/* Jami xarajat */}
        <div className={isDark ? "min-h-36 rounded-lg border border-slate-800/80 bg-card p-4 shadow-sm" : "min-h-36 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Jami xarajat (chiqim)</p>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
            isDark
              ? "bg-[#261016] border border-rose-900/40 text-rose-400"
              : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 min-w-0">
            <p className={`whitespace-nowrap text-xl font-bold tracking-tight ${isDark ? "text-rose-400" : "text-rose-700"}`}>{formatCurrency(totalExpense)}</p>
            <span className={`mt-0.5 block text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              {transactions.filter((tItem) => tItem.type === "expense").length} ta amal
            </span>
          </div>
        </div>

        {/* Sof foyda */}
        <div className={isDark ? "min-h-36 rounded-lg border border-slate-800/80 bg-card p-4 shadow-sm" : "min-h-36 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t('finance.netProfit')}</p>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
            netProfit >= 0
              ? isDark
                ? "bg-[#092218] border border-emerald-900/40 text-emerald-400"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : isDark
                ? "bg-[#261016] border border-rose-900/40 text-rose-400"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}>
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 min-w-0">
            <p className={`whitespace-nowrap text-xl font-bold tracking-tight ${
              netProfit >= 0
                ? isDark ? "text-emerald-400" : "text-emerald-700"
                : isDark ? "text-rose-400" : "text-rose-700"
            }`}>
              {netProfit < 0 ? `–${formatCurrency(Math.abs(netProfit))}` : formatCurrency(netProfit)}
            </p>
            <span className={`mt-0.5 block text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              Kirim − chiqim
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + Table Container */}
      <div className={isDark ? "bg-[#0c1117] rounded-2xl border border-slate-800/80 shadow-sm overflow-hidden" : "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"}>
        {/* Filter Tabs */}
        <div className="p-4 sm:p-5">
          <div className={`inline-flex items-center gap-1 p-1 rounded-xl ${isDark ? "bg-[#06090d] border border-slate-800/70" : "bg-gray-100 border border-gray-200"}`}>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "all"
                  ? (isDark ? "bg-[#141b23] text-white shadow-sm border border-slate-700/50" : "bg-white text-gray-900 shadow-sm border border-gray-300")
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-900")
              }`}
            >
              {t('finance.tabAll')} ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "income"
                  ? (isDark ? "bg-[#141b23] text-white shadow-sm border border-slate-700/50" : "bg-white text-gray-900 shadow-sm border border-gray-300")
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-900")
              }`}
            >
              {t('finance.tabIncome')}
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "expense"
                  ? (isDark ? "bg-[#141b23] text-white shadow-sm border border-slate-700/50" : "bg-white text-gray-900 shadow-sm border border-gray-300")
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-900")
              }`}
            >
              {t('finance.tabExpense')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left text-xs text-slate-400 font-medium ${isDark ? "border-b border-slate-800/80" : "border-b border-gray-200 bg-gray-50/50"}`}>
                <th className="px-6 py-4 font-medium">№</th>
                <th className="px-6 py-4 font-medium">{t('common.date')}</th>
                <th className="px-6 py-4 font-medium">{t('common.type')}</th>
                <th className="px-6 py-4 font-medium">{t('common.category')}</th>
                <th className="px-6 py-4 font-medium">{t('common.description')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('common.amount')}</th>
                <th className="px-6 py-4 font-medium text-center">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={isDark ? "divide-y divide-slate-800/50" : "divide-y divide-gray-100"}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={isDark ? "hover:bg-slate-800/20 transition-colors" : "hover:bg-gray-50 transition-colors"}
                  >
                    <td className="px-6 py-4 text-slate-400 text-xs font-normal">{idx + 1}</td>
                    <td className="px-6 py-4 text-slate-300 text-xs font-normal whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{row.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${
                          row.type === "income"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {row.type === "income" ? "+ Kirim" : "– Chiqim"}
                      </span>
                    </td>
                    <td className={isDark ? "px-6 py-4 font-bold text-white text-sm" : "px-6 py-4 font-bold text-gray-900 text-sm"}>
                      {translateCategory(row.category)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">
                      {row.description}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-sm whitespace-nowrap">
                      <span className={row.type === "income" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                        {row.type === "income" ? "+ " : "– "} {formatCurrency(row.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(row.id)}
                        title={t('common.delete')}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
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
      <ConfirmActionModal
        isOpen={deleteTransactionId !== null}
        title={t('common.delete')}
        description={t('finance.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.delete')}
        onClose={() => setDeleteTransactionId(null)}
        onConfirm={confirmDeleteTransaction}
      />
    </div>
  );
}
