import { L } from '@/localization/elements';
import { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  WalletCards,
  Plus,
  Minus,
  Trash2,
  CalendarDays,
} from "lucide-react";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import TransactionModal from "@/components/finance/TransactionModal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

export default function Finance() {
  const { isDark } = useTheme();
  const { t, locale, translateCategory } = useTranslation();
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
    amount.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');

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
    <L.div className={isDark ? "p-6 space-y-6 min-h-screen bg-slate-950 text-slate-100" : "p-6 space-y-6 min-h-screen bg-gray-50 text-gray-900"}>
      {/* Header */}
      <L.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <L.div>
          <L.h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.finance')}</L.h1>
          <L.p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t('finance.subtitle')}
          </L.p>
        </L.div>

        <L.div className="flex items-center gap-2.5">
          <L.button
            onClick={() => handleOpenAdd("income")}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            {t('finance.addIncome')}
          </L.button>
          <L.button
            onClick={() => handleOpenAdd("expense")}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Minus size={16} />
            {t('finance.addExpense')}
          </L.button>
        </L.div>
      </L.div>

      {/* Summary Cards */}
      <L.div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Jami daromad */}
        <L.div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <L.div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </L.div>
          <L.div>
            <L.p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.incomeTotal')}</L.p>
            <L.p className="text-2xl font-black text-blue-600 dark:text-sky-400 mt-0.5">{formatCurrency(totalIncome)}</L.p>
            <L.span className="text-xs text-gray-400 dark:text-slate-500">
              {transactions.filter((tItem) => tItem.type === "income").length}
            </L.span>
          </L.div>
        </L.div>

        {/* Jami xarajat */}
        <L.div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <L.div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </L.div>
          <L.div>
            <L.p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.expenseTotal')}</L.p>
            <L.p className="text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">{formatCurrency(totalExpense)}</L.p>
            <L.span className="text-xs text-gray-400 dark:text-slate-500">
              {transactions.filter((tItem) => tItem.type === "expense").length}
            </L.span>
          </L.div>
        </L.div>

        {/* Sof foyda */}
        <L.div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm"}>
          <L.div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            netProfit >= 0
              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400"
              : "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
          }`}>
            <WalletCards className="w-6 h-6" />
          </L.div>
          <L.div>
            <L.p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('finance.netProfit')}</L.p>
            <L.p className={`text-2xl font-black mt-0.5 ${netProfit >= 0 ? "text-blue-600 dark:text-sky-400" : "text-red-500"}`}>
              {formatCurrency(netProfit)}
            </L.p>
            <L.span className="text-xs text-gray-400 dark:text-slate-500">
              {t('status.income')} − {t('status.expense')}
            </L.span>
          </L.div>
        </L.div>
      </L.div>

      {/* Tabs + Table */}
      <L.div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" : "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"}>
        {/* Tab Bar */}
        <L.div className={`flex border-b px-6 pt-3 gap-2 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <L.button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "all"
                ? "text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabAll')} ({transactions.length})
          </L.button>
          <L.button
            onClick={() => setActiveTab("income")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "income"
                ? "text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabIncome')}
          </L.button>
          <L.button
            onClick={() => setActiveTab("expense")}
            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "expense"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            {t('finance.tabExpense')}
          </L.button>
        </L.div>

        {/* Table */}
        <L.div className="overflow-x-auto">
          <L.table className="w-full text-sm">
            <L.thead>
              <L.tr className={isDark ? "bg-slate-800/80 text-slate-300 text-left text-xs uppercase font-semibold" : "bg-gray-50/70 text-gray-500 text-left text-xs uppercase font-semibold"}>
                <L.th className="px-6 py-3.5">№</L.th>
                <L.th className="px-6 py-3.5">{t('common.date')}</L.th>
                <L.th className="px-6 py-3.5">{t('common.type')}</L.th>
                <L.th className="px-6 py-3.5">{t('common.category')}</L.th>
                <L.th className="px-6 py-3.5">{t('common.description')}</L.th>
                <L.th className="px-6 py-3.5 text-right">{t('common.amount')}</L.th>
                <L.th className="px-6 py-3.5 text-center">{t('common.actions')}</L.th>
              </L.tr>
            </L.thead>
            <L.tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {filtered.length === 0 ? (
                <L.tr>
                  <L.td colSpan={7} className="text-center py-12 text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </L.td>
                </L.tr>
              ) : (
                filtered.map((row, idx) => (
                  <L.tr key={row.id} className={isDark ? "hover:bg-slate-800/50 transition-colors" : "hover:bg-blue-50/30 transition-colors"}>
                    <L.td className="px-6 py-4 text-gray-400 dark:text-slate-500 font-medium">{idx + 1}</L.td>
                    <L.td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-gray-400" />
                      {row.date}
                    </L.td>
                    <L.td className="px-6 py-4">
                      <L.span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          row.type === "income"
                            ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border-blue-200 dark:border-blue-800/40"
                            : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40"
                        }`}
                      >
                        {row.type === "income" ? `+ ${t('status.income')}` : `- ${t('status.expense')}`}
                      </L.span>
                    </L.td>
                    <L.td className={isDark ? "px-6 py-4 font-semibold text-slate-200" : "px-6 py-4 font-semibold text-gray-800"}>
                      {translateCategory(row.category)}
                    </L.td>
                    <L.td className="px-6 py-4 text-gray-500 dark:text-slate-400 max-w-xs truncate">{row.description}</L.td>
                    <L.td className="px-6 py-4 text-right font-black whitespace-nowrap">
                      <L.span className={row.type === "income" ? "text-blue-600 dark:text-sky-400" : "text-red-600 dark:text-red-400"}>
                        {row.type === "income" ? "+" : "-"} {formatCurrency(row.amount)}
                      </L.span>
                    </L.td>
                    <L.td className="px-6 py-4 text-center">
                      <L.button
                        onClick={() => handleDelete(row.id)}
                        title={t('common.delete')}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </L.button>
                    </L.td>
                  </L.tr>
                ))
              )}
            </L.tbody>
          </L.table>
        </L.div>
      </L.div>

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
    </L.div>
  );
}
