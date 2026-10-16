import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Transaction, IncomeCategory, ExpenseCategory } from "@/types/finance";

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
      setError("Summa 0 dan katta bo‘lishi shart!");
      return;
    }
    if (!description.trim()) {
      setError("Tavsif yoki izoh kiritilishi shart!");
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
      setError(res.error || "Xatolik yuz berdi");
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "income" ? "Yangi kirim kiritish" : "Yangi chiqim kiritish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Type toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              type === "income"
                ? "bg-white text-green-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            + Kirim (Daromad)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              type === "expense"
                ? "bg-white text-red-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            - Chiqim (Xarajat)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kategoriya (TZ bo‘yicha 5 ta) *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sana *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Summa (so‘m, manfiy bo‘lmasin) *
          </label>
          <input
            type="number"
            min={1}
            required
            placeholder="Masalan, 500000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tavsif / Izoh *
          </label>
          <input
            type="text"
            required
            placeholder="To‘lov sababi yoki maqsadini yozing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition ${
              type === "income"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {type === "income" ? "Kirimni saqlash" : "Chiqimni saqlash"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
