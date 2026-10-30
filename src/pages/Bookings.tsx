import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Plus,
  Search,
  LogIn,
  FileText,
  Users,
  CalendarCheck,
  Clock3,
  Check,
  CircleDollarSign,
  X,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Room } from "@/types/room";
import type { Guest } from "@/types/guest";
import { StorageService } from "@/services/storage";
import BookingModal from "@/components/bookings/BookingModal";
import { CheckInConfirmDialog } from "@/components/bookings/CheckInConfirmDialog";
import { CheckOutConfirmModal } from "@/components/bookings/CheckOutConfirmModal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import Modal from "@/components/common/Modal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

type FilterTab = "Barchasi" | BookingStatus;
type ActionFilter = "Barchasi" | "Yashamoqda" | "Tasdiqlangan" | "Kutilmoqda";

const TABS: FilterTab[] = [
  "Barchasi",
  "Yashamoqda",
  "Tasdiqlangan",
  "Kutilmoqda",
  "Tugatilgan",
  "Bekor",
];

export default function Bookings() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();
  const { t, locale, translateStatus } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("Barchasi");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);
  const [statusActionError, setStatusActionError] = useState("");

  const loadAll = () => {
    setBookings(StorageService.getBookings());
    setRooms(StorageService.getRooms());
    setGuests(StorageService.getGuests());
  };

  useEffect(() => {
    loadAll();
    const handleStorageChange = () => loadAll();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const handleOpenAdd = () => {
    setEditingBooking(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Booking) => {
    setEditingBooking(b);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Booking, "id"> | Booking) => {
    if ("id" in data) {
      return StorageService.updateBooking(data as Booking);
    } else {
      return StorageService.addBooking(data);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteBookingId(id);
  };

  const confirmDeleteBooking = () => {
    if (deleteBookingId === null) return;
    StorageService.deleteBooking(deleteBookingId);
    setDeleteBookingId(null);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');
  };

  const handleCheckIn = (id: number) => {
    setCheckInBooking(bookings.find((booking) => booking.id === id) ?? null);
  };

  const confirmCheckIn = (id: number) => {
    return StorageService.checkInBooking(id);
  };

  const handleCheckOut = (id: number) => {
    setCheckOutBooking(bookings.find((booking) => booking.id === id) ?? null);
  };

  const confirmCheckOut = (id: number) => {
    return StorageService.checkOutBooking(id);
  };

  const updateBookingStatus = (booking: Booking, status: BookingStatus) => {
    const result = StorageService.updateBooking({ ...booking, status });
    setStatusActionError(result.success ? "" : result.error || "Bron holatini o‘zgartirib bo‘lmadi.");
  };

  const actionView = pathname.endsWith("/kelish-ketish");
  const countByStatus = (status: BookingStatus) =>
    bookings.filter((b) => b.status === status).length;
  const statusFiltered = actionView
    ? bookings.filter((booking) => {
        const matchesStatus =
          actionFilter === "Barchasi"
            ? booking.status === "Tasdiqlangan" ||
              booking.status === "Kutilmoqda" ||
              booking.status === "Yashamoqda"
            : booking.status === actionFilter;
        return matchesStatus;
      })
    : activeTab === "Barchasi"
      ? bookings
      : bookings.filter((booking) => booking.status === activeTab);
  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = statusFiltered.filter((booking) =>
    !query ||
    booking.guest.toLocaleLowerCase().includes(query) ||
    booking.room.toLocaleLowerCase().includes(query) ||
    booking.notes?.toLocaleLowerCase().includes(query) ||
    String(booking.id).includes(query)
  );

  const getStatusBadge = (status: BookingStatus) => {
    const text = translateStatus(status);
    let colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#10171d] dark:text-slate-300 dark:border-[#1c252d]";
    let dotClass = "bg-gray-500";

    if (status === "Yashamoqda") {
      colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30";
      dotClass = "bg-blue-500";
    } else if (status === "Tasdiqlangan") {
      colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";
      dotClass = "bg-emerald-500";
    } else if (status === "Kutilmoqda") {
      colorClass = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
      dotClass = "bg-amber-500";
    } else if (status === "Bekor") {
      colorClass = "bg-red-100 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";
      dotClass = "bg-red-500";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        {text}
      </span>
    );
  };

  return (
    <div className={isDark ? "min-h-screen bg-[#05080b] p-6 text-slate-100" : "min-h-screen bg-gray-50 p-6 text-gray-900"}>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {actionView ? (
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
            {t('nav.checkInOut')}
          </h1>
        ) : (
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                Bronlarni boshqarish
              </p>
              <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
                {t('nav.bookings')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {`${t('bookings.total').replace('{n}', String(bookings.length))} (${t('status.living')}: ${countByStatus("Yashamoqda")})`}
              </p>
            </div>
          </div>
        )}
        {actionView ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('bookings.actionSearchPlaceholder')}
              aria-label={t('bookings.actionSearchPlaceholder')}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ) : (
          <button
            onClick={handleOpenAdd}
            className="flex cursor-pointer items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            {t('bookings.new')}
          </button>
        )}
      </div>

      {!actionView && (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { status: "Yashamoqda" as const, label: translateStatus("Yashamoqda"), subtitle: "Hozir mehmonxonada", icon: Users, tone: "blue" },
            { status: "Tasdiqlangan" as const, label: translateStatus("Tasdiqlangan"), subtitle: "Tasdiqlangan bronlar", icon: CalendarCheck, tone: "emerald" },
            { status: "Kutilmoqda" as const, label: translateStatus("Kutilmoqda"), subtitle: "Tasdiq kutilmoqda", icon: Clock3, tone: "amber" },
            { status: "Tugatilgan" as const, label: translateStatus("Tugatilgan"), subtitle: "Yakunlangan bronlar", icon: Check, tone: "slate" },
            { status: "Bekor" as const, label: translateStatus("Bekor"), subtitle: "Bekor qilingan bronlar", icon: CircleDollarSign, tone: "red" },
          ].map(({ status, label, subtitle, icon: Icon, tone }) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveTab(status)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                isDark ? "border-[#1c252d] bg-[#0a0f13] hover:bg-[#0d1419]" : "border-gray-200 bg-white hover:bg-gray-50"
              } ${activeTab === status ? (isDark ? "ring-1 ring-blue-500/50" : "ring-1 ring-blue-300") : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  tone === "blue" ? "bg-blue-500/10 text-blue-400" :
                  tone === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                  tone === "amber" ? "bg-amber-500/10 text-amber-400" :
                  tone === "red" ? "bg-red-500/10 text-red-400" :
                  isDark ? "bg-[#10171d] text-slate-300" : "bg-slate-100 text-slate-600"
                }`}>
                  <Icon size={17} />
                </span>
              </div>
              <div className={`mt-3 text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{countByStatus(status)}</div>
              <div className={`mt-1 text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {subtitle}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      {actionView ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["Barchasi", "Yashamoqda", "Tasdiqlangan", "Kutilmoqda"] as const).map((filter) => {
            const active = actionFilter === filter;
            const label = filter === "Barchasi" ? t('common.all') : translateStatus(filter);
            const count = filter === "Barchasi"
              ? countByStatus("Yashamoqda") + countByStatus("Tasdiqlangan") + countByStatus("Kutilmoqda")
              : countByStatus(filter);
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActionFilter(filter)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : isDark
                      ? "border-[#1c252d] bg-[#0a0f13] text-slate-300 hover:border-slate-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
                <span className={active ? "font-bold text-white" : "font-semibold text-current"}>{count}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={`mb-5 flex flex-col gap-3 rounded-2xl border p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-[#1c252d] bg-[#0a0f13]" : "border-gray-200 bg-white"}`}>
          <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => {
          const count =
            tab === "Barchasi" ? bookings.length : countByStatus(tab as BookingStatus);
          const isActive = activeTab === tab;
          const label = tab === "Barchasi" ? t('common.all') : translateStatus(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : isDark
                  ? "text-slate-400 hover:text-white hover:bg-[#10171d]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : isDark
                    ? "bg-[#10171d] text-slate-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
          })}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('bookings.actionSearchPlaceholder')}
              aria-label={t('bookings.actionSearchPlaceholder')}
              className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition ${
                isDark ? "border-[#1c252d] bg-[#05080b] text-slate-100 placeholder:text-slate-500 focus:border-slate-600" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300"
              }`}
            />
          </div>
        </div>
      )}

      {statusActionError && (
        <div role="alert" className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {statusActionError}
        </div>
      )}

      {/* Table */}
      <div className={isDark ? "bg-[#0a0f13] rounded-2xl shadow-sm border border-[#1c252d] overflow-hidden" : "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"}>
        {actionView ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-sm">
                <thead>
                  <tr className={isDark
                    ? "border-b border-[#1c252d] bg-[#0d1419] text-left text-xs font-semibold text-slate-400"
                    : "border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500"}>
                    <th className="px-5 py-4">{t('dashboard.guest')}</th>
                    <th className="px-4 py-4">{t('dashboard.room')}</th>
                    <th className="px-4 py-4">{t('bookings.checkIn')}</th>
                    <th className="px-4 py-4">{t('bookings.checkOut')}</th>
                    <th className="px-4 py-4">{t('dashboard.duration')}</th>
                    <th className="px-4 py-4 text-right">{t('common.amount')}</th>
                    <th className="px-4 py-4">{t('common.status')}</th>
                    <th className="px-5 py-4 text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-[#1c252d]" : "divide-slate-200"}`}>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="h-40 text-center text-sm text-muted-foreground">
                        {t('rooms.notFound')}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((booking) => {
                      const [roomNumber, ...roomType] = booking.room.split(" — ");
                      return (
                        <tr
                          key={booking.id}
                          className={`group transition-colors ${isDark ? "hover:bg-[#10171d]" : "hover:bg-blue-50/40"}`}
                        >
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-sky-300">
                                {booking.guest.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                              </div>
                              <span className="font-semibold text-foreground">{booking.guest}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <span className="font-bold text-foreground">{roomNumber}</span>
                            <span className="ml-2 text-muted-foreground">{roomType.join(" — ")}</span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-foreground">{booking.checkIn}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-foreground">{booking.checkOut}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-foreground">
                            {booking.nights} {t('bookings.nights')}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-foreground">
                            {formatPrice(booking.price)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">{getStatusBadge(booking.status)}</td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              {booking.status === "Kutilmoqda" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => updateBookingStatus(booking, "Tasdiqlangan")}
                                    title={translateStatus("Tasdiqlangan")}
                                    aria-label={`${booking.guest} — ${translateStatus("Tasdiqlangan")}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateBookingStatus(booking, "Bekor")}
                                    title={translateStatus("Bekor")}
                                    aria-label={`${booking.guest} — ${translateStatus("Bekor")}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              {booking.status === "Tasdiqlangan" && (
                                <button
                                  type="button"
                                  onClick={() => handleCheckIn(booking.id)}
                                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${isDark ? "bg-[#30332f] text-slate-100 hover:bg-[#3b3f3a]" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                                >
                                  <LogIn size={14} />
                                  {t('bookings.checkInAction')}
                                </button>
                              )}
                              {booking.status === "Yashamoqda" && (
                                <button
                                  type="button"
                                  onClick={() => handleCheckOut(booking.id)}
                                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${isDark ? "bg-[#30332f] text-slate-100 hover:bg-[#3b3f3a]" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                                >
                                  <Check size={14} />
                                  {t('bookings.checkOutAction')}
                                </button>
                              )}
                              {(booking.status === "Tugatilgan" || booking.status === "Bekor") && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(booking.id)}
                                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-50 px-3 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                                >
                                  <Trash2 size={14} />
                                  {t('common.delete')}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(booking)}
                                title={t('common.edit')}
                                aria-label={`${booking.guest} — ${t('common.edit')}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setViewBooking(booking)}
                                title={t('common.view')}
                                aria-label={`${booking.guest} — ${t('common.view')}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-xs ${isDark ? "border-[#1c252d] text-slate-400" : "border-slate-200 text-slate-500"}`}>
              <span>{t('bookings.total').replace('{n}', String(filtered.length))}</span>
              <span>
                {t('status.confirmed')}: {countByStatus("Tasdiqlangan")} · {t('status.pending')}: {countByStatus("Kutilmoqda")} · {t('status.living')}: {countByStatus("Yashamoqda")}
              </span>
            </div>
          </>
        ) : (
          <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-xs">
            <thead>
              <tr className={isDark ? "bg-[#0d1419] border-b border-[#1c252d] text-slate-300 text-xs font-semibold uppercase tracking-wider" : "bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider"}>
                <th className="px-3 py-3 text-left">{t('dashboard.guest')}</th>
                <th className="px-2.5 py-3 text-left">{t('dashboard.room')}</th>
                <th className="px-2.5 py-3 text-left">{t('bookings.checkIn')} — {t('bookings.checkOut')}</th>
                <th className="px-2.5 py-3 text-left">{t('dashboard.duration')}</th>
                <th className="px-2.5 py-3 text-left">{t('common.notes')}</th>
                <th className="px-2.5 py-3 text-left">{t('common.status')}</th>
                <th className="px-2.5 py-3 text-right">{t('common.amount')}</th>
                <th className="px-3 py-3 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-[#1c252d]" : "divide-gray-50"}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`group transition-colors ${isDark ? "hover:bg-[#10171d]" : "hover:bg-blue-50/30"}`}
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-blue-500/15" : "bg-blue-100"}`}>
                          <span className={`text-xs font-bold ${isDark ? "text-sky-300" : "text-blue-700"}`}>
                            {booking.guest.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}>{booking.guest}</div>
                          <div className={`mt-0.5 text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>OR-{String(booking.id).padStart(6, "0")}</div>
                        </div>
                      </div>
                    </td>
                    <td className={isDark ? "whitespace-nowrap px-2.5 py-3 font-semibold text-slate-300" : "whitespace-nowrap px-2.5 py-3 font-semibold text-gray-700"}>
                      {booking.room}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-[11px] font-medium text-gray-500 dark:text-slate-400">
                      {booking.checkIn} <span className="text-gray-400">→</span> {booking.checkOut}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3">
                      <span className={isDark ? "font-bold text-slate-200" : "font-bold text-gray-800"}>
                        {booking.nights}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500 ml-1 text-xs">{t('bookings.nights')}</span>
                    </td>
                    <td className={`max-w-36 truncate px-2.5 py-3 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`} title={booking.notes || ""}>
                      {booking.notes || "—"}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className={isDark ? "whitespace-nowrap px-2.5 py-3 text-right font-bold text-white" : "whitespace-nowrap px-2.5 py-3 text-right font-bold text-gray-900"}>
                      {formatPrice(booking.price)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.status === "Kutilmoqda" && (
                          <>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(booking, "Tasdiqlangan")}
                            title={translateStatus("Tasdiqlangan")}
                            aria-label={`${booking.guest} — ${translateStatus("Tasdiqlangan")}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(booking, "Bekor")}
                            title={translateStatus("Bekor")}
                            aria-label={`${booking.guest} — ${translateStatus("Bekor")}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                          >
                            <X size={16} />
                          </button>
                          </>
                        )}

                        {booking.status === "Tasdiqlangan" && (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(booking.id)}
                            className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition ${isDark ? "bg-[#30332f] text-slate-100 hover:bg-[#3b3f3a]" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                          >
                            <LogIn size={14} />
                            {t('bookings.checkInAction')}
                          </button>
                        )}

                        {booking.status === "Yashamoqda" && (
                          <button
                            type="button"
                            onClick={() => handleCheckOut(booking.id)}
                            className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition ${isDark ? "bg-[#30332f] text-slate-100 hover:bg-[#3b3f3a]" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                          >
                            <Check size={14} />
                            {t('bookings.checkOutAction')}
                          </button>
                        )}

                        {(booking.status === "Tugatilgan" || booking.status === "Bekor") && (
                          <button
                            type="button"
                            onClick={() => handleDelete(booking.id)}
                            className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-rose-50 px-3 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                          >
                            <Trash2 size={14} />
                            {t('common.delete')}
                          </button>
                        )}

                        <button
                          onClick={() => setViewBooking(booking)}
                          title={t('common.view')}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition focus-visible:opacity-100 group-hover:opacity-100 ${isDark ? "text-slate-400 hover:bg-[#202421] hover:text-white" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(booking)}
                          title={t('common.edit')}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition focus-visible:opacity-100 group-hover:opacity-100 ${isDark ? "text-slate-400 hover:bg-[#202421] hover:text-white" : "text-slate-500 hover:bg-amber-50 hover:text-amber-600"}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex flex-wrap items-center justify-between gap-2 ${isDark ? "border-[#1c252d] bg-[#0a0f13]" : "border-gray-100 bg-gray-50/50"}`}>
          <span className="text-xs text-gray-400 dark:text-slate-400 font-medium">
            {t('bookings.total').replace('{n}', String(filtered.length))}
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t('status.living')}: {countByStatus("Yashamoqda")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t('status.confirmed')}: {countByStatus("Tasdiqlangan")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {t('status.pending')}: {countByStatus("Kutilmoqda")}
            </span>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingBooking}
        rooms={rooms}
        guests={guests}
      />
      <CheckInConfirmDialog
        booking={checkInBooking}
        onOpenChange={(open) => {
          if (!open) setCheckInBooking(null);
        }}
        onConfirm={confirmCheckIn}
      />
      <CheckOutConfirmModal
        booking={checkOutBooking}
        onOpenChange={(open) => {
          if (!open) setCheckOutBooking(null);
        }}
        onConfirm={confirmCheckOut}
      />
      <ConfirmActionModal
        isOpen={deleteBookingId !== null}
        title={t('common.delete')}
        description={t('bookings.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.delete')}
        onClose={() => setDeleteBookingId(null)}
        onConfirm={confirmDeleteBooking}
      />

      {/* View Booking Details Modal */}
      {viewBooking && (
        <Modal
          isOpen={!!viewBooking}
          onClose={() => setViewBooking(null)}
          title={`${t('bookings.detailsTitle')} #${viewBooking.id}`}
        >
          <div className="space-y-4">
            <div className={isDark ? "p-4 bg-[#0d1419] rounded-xl space-y-3 text-sm" : "p-4 bg-gray-50 rounded-xl space-y-3 text-sm"}>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('dashboard.guest')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewBooking.guest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('dashboard.room')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{viewBooking.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('bookings.checkIn')} — {t('bookings.checkOut')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">
                  {viewBooking.checkIn} — {viewBooking.checkOut} ({viewBooking.nights} {t('bookings.nights')})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('common.status')}:</span>
                {getStatusBadge(viewBooking.status)}
              </div>
              <div className={`flex justify-between pt-2 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                <span className="text-gray-400 dark:text-slate-400">{t('bookings.totalSum')}:</span>
                <span className="font-bold text-blue-600 dark:text-sky-400 text-base">{formatPrice(viewBooking.price)}</span>
              </div>
              {viewBooking.notes && (
                <div className={`pt-2 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                  <span className="block text-gray-400 dark:text-slate-400 mb-1">{t('common.notes')}:</span>
                  <div className={isDark ? "flex items-start gap-2 bg-[#0a0f13] p-2.5 rounded-lg border border-[#1c252d] text-xs text-slate-300" : "flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700"}>
                    <FileText size={14} className="text-gray-400 mt-0.5" />
                    <span>{viewBooking.notes}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewBooking(null)}
                className={
                  isDark
                    ? "px-5 py-2 bg-[#10171d] hover:bg-[#17212a] text-slate-200 font-semibold text-sm rounded-xl transition cursor-pointer"
                    : "px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
                }
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
