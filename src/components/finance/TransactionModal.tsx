import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Transaction, IncomeCategory, ExpenseCategory } from "@/types/finance";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/theme";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: Omit<Transaction, "id">) => { success: boolean; error?: string };
  defaultType?: "income" | "expense";
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  "Xona haqi",
  "Ovqatlanish",
  "Qo‘shimcha xizmatlar",
  "Ijara",
  "Boshqa kirim",
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Ish haqi",
  "Kommunal to‘lovlar",
  "Material/xaridlar",
  "Ta’mirlash",
  "Boshqa chiqim",
];

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  defaultType = "income",
}: TransactionModalProps) {
  const { t, translateCategory } = useTranslation();
  const { isDark } = useTheme();
  const [type, setType] = useState<"income" | "expense">(defaultType);
  const [category, setCategory] = useState<string>(INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setType(defaultType);
    setCategory(defaultType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setError(null);
  }, [defaultType, isOpen]);

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType);
    setCategory(newType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError(t('common.amount') + " > 0 !");
      return;
    }
    if (!description.trim()) {
      setError(t('common.description') + " !");
      return;
    }

    const res = onSave({
      type,
      category: category as any,
      amount: numAmount,
      description: description.trim(),
      date,
    });

    if (!res.success) {
      setError(res.error || "Error");
    } else {
      onClose();
    }
  };

  const labelClass = isDark ? "block text-xs font-semibold text-slate-300 mb-1" : "block text-xs font-semibold text-gray-700 mb-1";
  const inputClass = isDark
    ? "w-full px-3.5 py-2 text-sm border border-slate-700 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    : "w-full px-3.5 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "income" ? t('finance.modalIncomeTitle') : t('finance.modalExpenseTitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium border border-red-500/30">
            {error}
          </div>
        )}

        {/* Type toggle */}
        <div className={isDark ? "flex bg-slate-800 p-1 rounded-xl" : "flex bg-gray-100 p-1 rounded-xl"}>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              type === "income"
                ? isDark
                  ? "bg-slate-900 text-sky-400 shadow-xs"
                  : "bg-white text-blue-700 shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            + {t('status.income')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              type === "expense"
                ? isDark
                  ? "bg-slate-900 text-red-400 shadow-xs"
                  : "bg-white text-red-700 shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            - {t('status.expense')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('common.category')} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                <option key={c} value={c} className={isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                  {translateCategory(c)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {t('common.amount')} ({t('common.currency')}) *
            </label>
            <input
              type="number"
              min={100}
              step={1000}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="100000"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            {t('common.date')} *
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            {t('common.description')} *
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="..."
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className={
              isDark
                ? "px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                : "px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            }
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition cursor-pointer"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
