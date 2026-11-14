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
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { StorageService } from "@/services/storage";
import type { Transaction } from "@/types/finance";
import type { Room } from "@/types/room";
import type { LanguageCode } from "@/i18n";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDark?: boolean;
  locale: LanguageCode;
};

function DatePicker({ label, value, onChange, isDark: _isDark, locale }: DatePickerProps) {
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
        top: rect.bottom + 8,
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
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
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
      <span className="block text-[11px] font-medium text-muted-foreground mb-0.5">
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
              top: rect.bottom + 8,
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
        className="flex w-full items-center justify-between gap-2 rounded-lg text-left text-xs font-semibold text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>{new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(selectedDate)}</span>
        <Calendar size={14} className="shrink-0 text-muted-foreground" />
      </button>
      {isOpen && (
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={label}
            className="date-picker-popover fixed z-50 w-[min(19rem,calc(100vw_-_1rem))] rounded-2xl border border-border bg-popover text-popover-foreground p-4 shadow-xl"
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
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                <ChevronLeft size={18} />
              </button>
              <p className="text-sm font-semibold">
                {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(visibleMonth)}
              </p>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label={nextMonthLabel}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                const isSelected = formatIsoDate(day) === value;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      onChange(formatIsoDate(day));
                      closeCalendar();
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? "bg-primary font-bold text-primary-foreground"
                        : isCurrentMonth
                          ? "hover:bg-accent hover:text-accent-foreground text-foreground"
                          : "text-muted-foreground/40 hover:bg-accent/50"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
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

  // Default range: 1st of current month to today
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-01`;
  });
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

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
    Math.abs(n).toLocaleString('en-US') + " so'm";

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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 text-foreground space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[2.1rem] font-bold tracking-tight text-foreground">
            {t('nav.reports')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('reports.subtitle')}
          </p>
        </div>

        {/* Date Filter + Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-[min(10.5rem,calc(50vw_-_1.25rem))] rounded-xl border border-border bg-card px-3 py-1.5 shadow-xs">
            <DatePicker
              label={t('reports.from')}
              value={fromDate}
              onChange={setFromDate}
              isDark={isDark}
              locale={locale}
            />
          </div>
          <div className="w-[min(10.5rem,calc(50vw_-_1.25rem))] rounded-xl border border-border bg-card px-3 py-1.5 shadow-xs">
            <DatePicker
              label={t('reports.to')}
              value={toDate}
              onChange={setToDate}
              isDark={isDark}
              locale={locale}
            />
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-[52px] gap-2 rounded-xl border-border bg-card font-semibold shadow-xs hover:bg-accent active:scale-95 transition"
          >
            <Download className="h-4 w-4" />
            <span>{t('reports.export')}</span>
          </Button>
        </div>
      </div>

      {/* 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami Kirim */}
        <Card className="border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('reports.periodIncome')}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(periodIncome)}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-md">
                + {t('status.income')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {filteredTransactions.filter(tx => tx.type === 'income').length} ta amal
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Jami Chiqim */}
        <Card className="border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('reports.periodExpense')}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(periodExpense)}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-md">
                – {t('status.expense')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {filteredTransactions.filter(tx => tx.type === 'expense').length} ta amal
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sof Natija */}
        <Card className="border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('reports.periodNet')}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {periodNet < 0 ? `–${formatCurrency(Math.abs(periodNet))}` : formatCurrency(periodNet)}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-md">
                {t('finance.netProfit')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Kirim − chiqim
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bandlik Ko'rsatkichi */}
        <Card className="border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('reports.occupancy')}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {occupancyRate}%
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-md">
                {occupiedRoomsCount} / {totalRoomsCount} xona
              </Badge>
              <span className="text-xs text-muted-foreground">
                Hozirgi bandlik
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kirim Kategoriyalari */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold text-foreground">
                {t('reports.incomeBreakdown')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Daromadlarning toifalar bo‘yicha ulushi
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
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
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {translateCategory(cat)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <Progress
                    value={percent}
                    className="h-2 bg-muted"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Chiqim Kategoriyalari */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold text-foreground">
                {t('reports.expenseBreakdown')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Xarajatlarning toifalar bo‘yicha ulushi
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
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
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {translateCategory(cat)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  <Progress
                    value={percent}
                    className="h-2 bg-muted"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Details Table for this period */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/70 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              {t('reports.history')} ({filteredTransactions.length})
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Tanlangan davr ichidagi barcha moliyaviy amallar
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-border font-mono text-xs text-muted-foreground px-2.5 py-1">
            {fromDate} — {toDate}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/70 hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground px-6">{t('common.date')}</TableHead>
                <TableHead className="font-medium text-muted-foreground px-6">{t('common.type')}</TableHead>
                <TableHead className="font-medium text-muted-foreground px-6">{t('common.category')}</TableHead>
                <TableHead className="font-medium text-muted-foreground px-6">{t('common.description')}</TableHead>
                <TableHead className="font-medium text-muted-foreground px-6 text-right">{t('common.amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {t('rooms.notFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                    <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-muted-foreground shrink-0" />
                        <span>{tx.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal text-muted-foreground"
                      >
                        {tx.type === "income" ? `+ ${t('status.income')}` : `– ${t('status.expense')}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-foreground text-sm">
                      {translateCategory(tx.category)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">
                      {tx.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-semibold text-sm text-foreground whitespace-nowrap">
                      {tx.type === "income" ? "+" : "–"} {formatCurrency(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="border-t border-border bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="px-6 py-4 font-semibold text-foreground">
                  {t('reports.periodNet')}
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-bold text-sm text-foreground">
                  {periodNet < 0 ? `–${formatCurrency(Math.abs(periodNet))}` : `+${formatCurrency(periodNet)}`}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
