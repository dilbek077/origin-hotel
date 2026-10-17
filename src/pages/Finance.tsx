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

export default function Finance() {
  const { isDark } = useTheme();
  const { t, locale, translateCategory } = useTranslation();
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

  const formatCurrency = (amount: number) =>
    amount.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');

  const handleOpenAdd = (type: "income" | "expense") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Transaction, "id">) => {
    return StorageService.addTransaction(data);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('finance.deleteConfirm'))) {
      StorageService.deleteTransaction(id);
    }
  };

  const filtered = transactions.filter((tItem) => {
    if (activeTab === "all") return true;
    return tItem.type === activeTab;
  });

  return (
    <div className={isDark ? "p-6 space-y-6 min-h-screen bg-slate-950 text-slate-100" : "p-6 space-y-6 min-h-screen bg-gray-50 text-gray-900"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.finance')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t('finance.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAdd("income")}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            {t('finance.addIncome')}
          </button>
          <button
            onClick={() => handleOpenAdd("expense")}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            {t('finance.addExpense')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Jami daromad */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.incomeTotal')}</p>
            <p className="text-2xl font-black text-green-600 dark:text-green-400 mt-0.5">{formatCurrency(totalIncome)}</p>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {transactions.filter((tItem) => tItem.type === "income").length}
            </span>
          </div>
        </div>

        {/* Jami xarajat */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.expenseTotal')}</p>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">{formatCurrency(totalExpense)}</p>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {transactions.filter((tItem) => tItem.type === "expense").length}
            </span>
          </div>
        </div>

        {/* Sof foyda */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            netProfit >= 0
              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400"
              : "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
          }`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.netProfit')}</p>
            <p className={`text-2xl font-black mt-0.5 ${netProfit >= 0 ? "text-blue-600 dark:text-sky-400" : "text-red-500"}`}>
              {formatCurrency(netProfit)}
            </p>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {t('status.income')} − {t('status.expense')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + Table */}
      <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" : "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"}>
        {/* Tab Bar */}
        <div className={`flex border-b px-6 pt-3 gap-2 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "all"
                ? "text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabAll')} ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "income"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabIncome')}
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "expense"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabExpense')}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-slate-800/80 text-slate-300 text-left text-xs uppercase font-semibold" : "bg-gray-50/70 text-gray-500 text-left text-xs uppercase font-semibold"}>
                <th className="px-6 py-3.5">№</th>
                <th className="px-6 py-3.5">{t('common.date')}</th>
                <th className="px-6 py-3.5">{t('common.type')}</th>
                <th className="px-6 py-3.5">{t('common.category')}</th>
                <th className="px-6 py-3.5">{t('common.description')}</th>
                <th className="px-6 py-3.5 text-right">{t('common.amount')}</th>
                <th className="px-6 py-3.5 text-center">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className={isDark ? "hover:bg-slate-800/50 transition-colors" : "hover:bg-blue-50/30 transition-colors"}>
                    <td className="px-6 py-4 text-gray-400 dark:text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {row.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          row.type === "income"
                            ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/40"
                            : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40"
                        }`}
                      >
                        {row.type === "income" ? `+ ${t('status.income')}` : `- ${t('status.expense')}`}
                      </span>
                    </td>
                    <td className={isDark ? "px-6 py-4 font-semibold text-slate-200" : "px-6 py-4 font-semibold text-gray-800"}>
                      {translateCategory(row.category)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 max-w-xs truncate">{row.description}</td>
                    <td className="px-6 py-4 text-right font-black whitespace-nowrap">
                      <span className={row.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {row.type === "income" ? "+" : "-"} {formatCurrency(row.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(row.id)}
                        title={t('common.delete')}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition cursor-pointer"
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
