import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StorageService } from "@/services/storage";
import type { Transaction } from "@/types/finance";
import type { Room } from "@/types/room";
import type { LanguageCode } from "@/i18n";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  locale: LanguageCode;
};

function DatePicker({ label, value, onChange, isDark, locale }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = new Date(`${value}T00:00:00`);
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const selectedDate = new Date(`${value}T00:00:00`);
  const firstWeekday = locale === "en" ? 0 : 1;
  const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - ((firstOfMonth.getDay() - firstWeekday + 7) % 7));
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const day = (firstWeekday + index) % 7;
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 7 + day));
  });
  const previousMonthLabel = {
    uz: "Oldingi oy",
    ru: "Предыдущий месяц",
    en: "Previous month",
    fr: "Mois précédent",
    de: "Vorheriger Monat",
  }[locale];
  const nextMonthLabel = {
    uz: "Keyingi oy",
    ru: "Следующий месяц",
    en: "Next month",
    fr: "Mois suivant",
    de: "Nächster Monat",
  }[locale];

  const closeCalendar = useCallback(() => {
    if (closeTimerRef.current !== null) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 150);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const updatePopoverPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const popoverWidth = Math.min(304, window.innerWidth - 16);
      const preferredLeft = rect.left + rect.width / 2 - popoverWidth / 2;
      setPopoverPosition({
        top: rect.bottom + 12,
        left: Math.max(8, Math.min(preferredLeft, window.innerWidth - popoverWidth - 8)),
      });
    };
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!pickerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        closeCalendar();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCalendar();
    };
    updatePopoverPosition();
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [isOpen, closeCalendar]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  const changeMonth = (amount: number) => {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + amount, 1));
  };

  const formatIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div ref={pickerRef} className={`relative ${isOpen ? "z-30" : "z-10"}`}>
      <span className={`block text-xs font-semibold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
        {label}:
      </span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (isOpen) {
            if (closeTimerRef.current !== null) {
              window.clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
              setIsClosing(false);
              return;
            }
            closeCalendar();
            return;
          }
          if (closeTimerRef.current !== null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
          }
          setIsClosing(false);
          setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
          const rect = triggerRef.current?.getBoundingClientRect();
          if (rect) {
            const popoverWidth = Math.min(304, window.innerWidth - 16);
            const preferredLeft = rect.left + rect.width / 2 - popoverWidth / 2;
            setPopoverPosition({
              top: rect.bottom + 12,
              left: Math.max(8, Math.min(preferredLeft, window.innerWidth - popoverWidth - 8)),
            });
          }
          setIsOpen(true);
        }}
        aria-label={`${label}: ${new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(selectedDate)}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen && !isClosing}
        className={`mt-1 flex w-full items-center justify-between gap-2 rounded-lg text-left text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isDark ? "text-slate-100" : "text-gray-800"
        }`}
      >
        <span>{new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(selectedDate)}</span>
        <Calendar size={14} className={`shrink-0 ${isDark ? "text-sky-400" : "text-blue-600"}`} />
      </button>
      {isOpen && (
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={label}
            className={`date-picker-popover fixed z-50 w-[min(19rem,calc(100vw_-_1rem))] rounded-2xl border p-4 shadow-xl ${
              isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-gray-200 bg-white text-gray-900"
            }`}
            data-state={isClosing ? "closing" : "open"}
            style={{
              top: popoverPosition?.top ?? 0,
              left: popoverPosition?.left ?? 0,
              animation: isClosing
                ? "date-picker-out 150ms ease-in both"
                : "date-picker-in 180ms ease-out both",
            }}
          >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label={previousMonthLabel}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                isDark ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-bold">
              {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(visibleMonth)}
            </p>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label={nextMonthLabel}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                isDark ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((weekday, index) => (
              <span
                key={`${weekday}-${index}`}
                className={`py-1 text-xs font-semibold uppercase ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              >
                {weekday}
              </span>
            ))}
            {calendarDays.map((date) => {
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = formatIsoDate(date) === value;
              const isToday = formatIsoDate(date) === formatIsoDate(new Date());
              return (
                <button
                  key={formatIsoDate(date)}
                  type="button"
                  onClick={() => {
                    onChange(formatIsoDate(date));
                    closeCalendar();
                  }}
                  aria-label={new Intl.DateTimeFormat(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(date)}
                  aria-pressed={isSelected}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${
                    isSelected
                      ? "bg-blue-600 font-bold text-white shadow-sm"
                      : isCurrentMonth
                        ? isDark
                          ? "text-slate-200 hover:bg-slate-800"
                          : "text-gray-700 hover:bg-blue-50"
                        : isDark
                          ? "text-slate-600 hover:bg-slate-800"
                          : "text-gray-300 hover:bg-gray-50"
                  } ${isToday && !isSelected ? "ring-1 ring-blue-500" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          </div>,
          document.body,
        )
      )}
    </div>
  );
}

export default function Reports() {
  const { isDark } = useTheme();
  const { t, locale, translateCategory } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Default from 1st of current month to end of current month
  const now = new Date();
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const lastDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDate).padStart(2, "0")}`;

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
          <div className={`w-[min(10.5rem,calc(50vw_-_1.25rem))] rounded-xl border px-3 py-2 shadow-xs ${
            isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
          }`}>
            <DatePicker
              label={t('reports.from')}
              value={fromDate}
              onChange={setFromDate}
              isDark={isDark}
              locale={locale}
            />
          </div>
          <div className={`w-[min(10.5rem,calc(50vw_-_1.25rem))] rounded-xl border px-3 py-2 shadow-xs ${
            isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
          }`}>
            <DatePicker
              label={t('reports.to')}
              value={toDate}
              onChange={setToDate}
              isDark={isDark}
              locale={locale}
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
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600 dark:text-sky-400" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300">
              {t('status.income')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.periodIncome')}</p>
          <p className="text-xl font-black text-blue-600 dark:text-sky-400 mt-1">{formatCurrency(periodIncome)}</p>
        </div>

        {/* Jami Chiqim */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300">
              {t('status.expense')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.periodExpense')}</p>
          <p className="text-xl font-black text-red-600 dark:text-red-400 mt-1">{formatCurrency(periodExpense)}</p>
        </div>

        {/* Sof Natija */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm" : "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              periodNet >= 0
                ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400"
                : "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
            }`}>
              <DollarSign size={20} className={periodNet >= 0 ? "text-blue-600 dark:text-sky-400" : "text-red-600 dark:text-red-400"} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300">
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
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <Percent size={20} className="text-blue-600 dark:text-sky-400" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300">
              {t('reports.occupancy')}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 dark:text-slate-400">{t('reports.occupancy')}</p>
          <p className="text-xl font-black text-blue-700 dark:text-sky-400 mt-1">
            {occupancyRate}% ({occupiedRoomsCount}/{totalRoomsCount})
          </p>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kirim Kategoriyalari */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"}>
          <h3 className={isDark ? "text-sm font-bold text-white mb-4 flex items-center gap-2" : "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"}>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
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
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                    <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-slate-400 font-mono">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {tx.date}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          tx.type === "income"
                            ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border-blue-200 dark:border-blue-800/40"
                            : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40"
                        }`}
                      >
                        {tx.type === "income" ? `+ ${t('status.income')}` : `- ${t('status.expense')}`}
                      </span>
                    </td>
                    <td className={isDark ? "px-6 py-3.5 font-semibold text-slate-200" : "px-6 py-3.5 font-semibold text-gray-800"}>
                      {translateCategory(tx.category)}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-slate-400">{tx.description}</td>
                    <td className="px-6 py-3.5 text-right font-black">
                      <span className={tx.type === "income" ? "text-blue-600 dark:text-sky-400" : "text-red-600 dark:text-red-400"}>
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
