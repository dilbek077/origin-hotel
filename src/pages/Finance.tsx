import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const incomeData = [
  { id: 1, date: '2024-01-05', description: "Xona ijarasi - 101", category: 'Xona', amount: 850000 },
  { id: 2, date: '2024-01-06', description: "Xona ijarasi - 205", category: 'Xona', amount: 1200000 },
  { id: 3, date: '2024-01-07', description: 'Restoran xizmati', category: 'Restoran', amount: 320000 },
  { id: 4, date: '2024-01-08', description: 'Konferens zal ijarasi', category: "Zal", amount: 500000 },
  { id: 5, date: '2024-01-09', description: "Spa va sog'lomlashtirish", category: 'Spa', amount: 275000 },
  { id: 6, date: '2024-01-10', description: "Xona ijarasi - 310", category: 'Xona', amount: 950000 },
  { id: 7, date: '2024-01-11', description: 'Minibar xizmati', category: 'Qo\'shimcha', amount: 145000 },
];

const expenseData = [
  { id: 1, date: '2024-01-05', description: "Ish haqi - iyun", category: 'Ish haqi', amount: 4500000 },
  { id: 2, date: '2024-01-06', description: "Elektr energiyasi", category: 'Kommunal', amount: 780000 },
  { id: 3, date: '2024-01-07', description: "Oziq-ovqat mahsulotlari", category: 'Oziq-ovqat', amount: 1200000 },
  { id: 4, date: '2024-01-08', description: "Ta'mirlash ishlari", category: "Ta'mirlash", amount: 350000 },
  { id: 5, date: '2024-01-09', description: "Internet va aloqa", category: 'Kommunal', amount: 120000 },
  { id: 6, date: '2024-01-10', description: "Tozalovchi vositalar", category: 'Materiallar', amount: 95000 },
];

const formatCurrency = (amount: number) =>
  amount.toLocaleString('uz-UZ') + " so'm";

const totalIncome = incomeData.reduce((s, r) => s + r.amount, 0);
const totalExpense = expenseData.reduce((s, r) => s + r.amount, 0);
const netProfit = totalIncome - totalExpense;

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moliya</h1>
        <p className="text-sm text-gray-500 mt-1">Daromad va xarajatlar boshqaruvi</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Jami daromad */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Jami daromad</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            <span className="inline-flex items-center gap-1 text-xs text-green-500 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.4% o'tgan oyga nisbatan
            </span>
          </div>
        </div>

        {/* Jami xarajat */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Jami xarajat</p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
            <span className="inline-flex items-center gap-1 text-xs text-red-400 mt-0.5">
              <ArrowDownRight className="w-3 h-3" /> +5.1% o'tgan oyga nisbatan
            </span>
          </div>
        </div>

        {/* Sof foyda */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sof foyda</p>
            <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {formatCurrency(Math.abs(netProfit))}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-blue-400 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8.7% o'tgan oyga nisbatan
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'income'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Daromadlar
            {activeTab === 'income' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'expense'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Xarajatlar
            {activeTab === 'expense' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
            )}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-6 py-3 font-medium">№</th>
                <th className="px-6 py-3 font-medium">Sana</th>
                <th className="px-6 py-3 font-medium">Tavsif</th>
                <th className="px-6 py-3 font-medium">Kategoriya</th>
                <th className="px-6 py-3 font-medium text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'income' ? incomeData : expenseData).map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-4 text-gray-600">{row.date}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{row.description}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {row.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    activeTab === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {activeTab === 'income' ? '+' : '-'} {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td colSpan={4} className="px-6 py-4 font-semibold text-gray-700">Jami</td>
                <td className={`px-6 py-4 text-right font-bold text-base ${
                  activeTab === 'income' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {formatCurrency(
                    activeTab === 'income' ? totalIncome : totalExpense
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
