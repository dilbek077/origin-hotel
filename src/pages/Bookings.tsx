import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

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
    const statusStyles: Record<BookingStatus, { badge: string; dot: string }> = {
      Yashamoqda: {
        badge: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        dot: "bg-sky-500",
      },
      Tasdiqlangan: {
        badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
      },
      Kutilmoqda: {
        badge: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        dot: "bg-amber-500",
      },
      Tugatilgan: {
        badge: "border-muted-foreground/20 bg-muted text-muted-foreground",
        dot: "bg-muted-foreground",
      },
      Bekor: {
        badge: "border-destructive/30 bg-destructive/10 text-destructive",
        dot: "bg-destructive",
      },
    };
    const style = statusStyles[status];

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
        <span className={`size-1.5 rounded-full ${style.dot}`} />
        {text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {actionView ? (
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('nav.checkInOut')}
          </h1>
        ) : (
          <div>
            <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-foreground">
              {t('nav.bookings')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {`${t('bookings.total').replace('{n}', String(bookings.length))} (${t('status.living')}: ${countByStatus("Yashamoqda")})`}
            </p>
          </div>
        )}
        {actionView ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('bookings.actionSearchPlaceholder')}
              aria-label={t('bookings.actionSearchPlaceholder')}
              className="h-9 pl-9"
            />
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="self-start sm:self-auto"
          >
            <Plus className="size-4" />
            {t('bookings.new')}
          </Button>
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
              aria-pressed={activeTab === status}
              className={`rounded-xl border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors hover:bg-accent/40 ${
                activeTab === status ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className={`flex size-9 items-center justify-center rounded-lg ${
                  tone === "blue" ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" :
                  tone === "emerald" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                  tone === "amber" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  tone === "red" ? "bg-destructive/10 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>
                  <Icon size={17} />
                </span>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{countByStatus(status)}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{subtitle}</div>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      {actionView ? (
        <Tabs
          value={actionFilter}
          onValueChange={(value) => setActionFilter(value as ActionFilter)}
          className="mb-4"
        >
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 sm:w-fit">
            {(["Barchasi", "Yashamoqda", "Tasdiqlangan", "Kutilmoqda"] as const).map((filter) => {
            const active = actionFilter === filter;
            const label = filter === "Barchasi" ? t('common.all') : translateStatus(filter);
            const count = filter === "Barchasi"
              ? countByStatus("Yashamoqda") + countByStatus("Tasdiqlangan") + countByStatus("Kutilmoqda")
              : countByStatus(filter);
            return (
              <TabsTrigger key={filter} value={filter} className="h-8 flex-none rounded-lg px-3 text-xs">
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{count}</span>
              </TabsTrigger>
            );
          })}
          </TabsList>
        </Tabs>
      ) : (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as FilterTab)}
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-muted/60 p-1">
                {TABS.map((tab) => {
          const count =
            tab === "Barchasi" ? bookings.length : countByStatus(tab as BookingStatus);
          const isActive = activeTab === tab;
          const label = tab === "Barchasi" ? t('common.all') : translateStatus(tab);
          return (
            <TabsTrigger key={tab} value={tab} className="h-8 flex-none rounded-md px-3 text-xs">
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {count}
              </span>
            </TabsTrigger>
          );
          })}
              </TabsList>
            </Tabs>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('bookings.actionSearchPlaceholder')}
              aria-label={t('bookings.actionSearchPlaceholder')}
              className="h-9 pl-9"
            />
          </div>
        </div>
      )}

      {statusActionError && (
        <div role="alert" className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {statusActionError}
        </div>
      )}

      {/* Table */}
      <Card className="gap-0 overflow-hidden rounded-xl border-border bg-card py-0 text-card-foreground shadow-sm">
        {actionView ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold text-muted-foreground">
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
                <tbody className="divide-y divide-border">
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
                          className="group transition-colors hover:bg-muted/40"
                        >
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
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
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateBookingStatus(booking, "Tasdiqlangan")}
                                    title={translateStatus("Tasdiqlangan")}
                                    aria-label={`${booking.guest} — ${translateStatus("Tasdiqlangan")}`}
                                    className="size-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                  >
                                    <Check className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateBookingStatus(booking, "Bekor")}
                                    title={translateStatus("Bekor")}
                                    aria-label={`${booking.guest} — ${translateStatus("Bekor")}`}
                                    className="size-8 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </>
                              )}
                              {booking.status === "Tasdiqlangan" && (
                                <Button
                                  type="button"
                                  onClick={() => handleCheckIn(booking.id)}
                                  size="sm"
                                  className="h-8"
                                >
                                  <LogIn size={14} />
                                  {t('bookings.checkInAction')}
                                </Button>
                              )}
                              {booking.status === "Yashamoqda" && (
                                <Button
                                  type="button"
                                  onClick={() => handleCheckOut(booking.id)}
                                  size="sm"
                                  className="h-8"
                                >
                                  <Check size={14} />
                                  {t('bookings.checkOutAction')}
                                </Button>
                              )}
                              {(booking.status === "Tugatilgan" || booking.status === "Bekor") && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(booking.id)}
                                  className="h-8"
                                >
                                  <Trash2 size={14} />
                                  {t('common.delete')}
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(booking)}
                                title={t('common.edit')}
                                aria-label={`${booking.guest} — ${t('common.edit')}`}
                                className="size-8 text-muted-foreground"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewBooking(booking)}
                                title={t('common.view')}
                                aria-label={`${booking.guest} — ${t('common.view')}`}
                                className="size-8 text-muted-foreground"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-xs text-muted-foreground">
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
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
            <tbody className="divide-y divide-border">
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
                    className="group transition-colors hover:bg-muted/40"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold text-primary">
                            {booking.guest.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{booking.guest}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">OR-{String(booking.id).padStart(6, "0")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 font-semibold text-foreground">
                      {booking.room}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-[11px] font-medium text-gray-500 dark:text-slate-400">
                      {booking.checkIn} <span className="text-gray-400">→</span> {booking.checkOut}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3">
                      <span className="font-bold text-foreground">
                        {booking.nights}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">{t('bookings.nights')}</span>
                    </td>
                    <td className="max-w-36 truncate px-2.5 py-3 text-[11px] text-muted-foreground" title={booking.notes || ""}>
                      {booking.notes || "—"}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-right font-bold text-foreground">
                      {formatPrice(booking.price)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.status === "Kutilmoqda" && (
                          <>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateBookingStatus(booking, "Tasdiqlangan")}
                            title={translateStatus("Tasdiqlangan")}
                            aria-label={`${booking.guest} — ${translateStatus("Tasdiqlangan")}`}
                            className="size-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateBookingStatus(booking, "Bekor")}
                            title={translateStatus("Bekor")}
                            aria-label={`${booking.guest} — ${translateStatus("Bekor")}`}
                            className="size-8 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="size-4" />
                          </Button>
                          </>
                        )}

                        {booking.status === "Tasdiqlangan" && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleCheckIn(booking.id)}
                            className="h-8 shrink-0 whitespace-nowrap"
                          >
                            <LogIn size={14} />
                            {t('bookings.checkInAction')}
                          </Button>
                        )}

                        {booking.status === "Yashamoqda" && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleCheckOut(booking.id)}
                            className="h-8 shrink-0 whitespace-nowrap"
                          >
                            <Check size={14} />
                            {t('bookings.checkOutAction')}
                          </Button>
                        )}

                        {(booking.status === "Tugatilgan" || booking.status === "Bekor") && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
                            className="h-8 shrink-0 whitespace-nowrap"
                          >
                            <Trash2 size={14} />
                            {t('common.delete')}
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewBooking(booking)}
                          title={t('common.view')}
                          aria-label={`${booking.guest} — ${t('common.view')}`}
                          className="size-8 text-muted-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(booking)}
                          title={t('common.edit')}
                          aria-label={`${booking.guest} — ${t('common.edit')}`}
                          className="size-8 text-muted-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 px-6 py-3">
          <span className="text-xs font-medium text-muted-foreground">
            {t('bookings.total').replace('{n}', String(filtered.length))}
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500" />
              {t('status.living')}: {countByStatus("Yashamoqda")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t('status.confirmed')}: {countByStatus("Tasdiqlangan")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              {t('status.pending')}: {countByStatus("Kutilmoqda")}
            </span>
          </div>
        </div>
          </>
        )}
      </Card>

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
