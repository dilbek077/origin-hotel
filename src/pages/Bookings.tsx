import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Plus,
  LogIn,
  LogOut,
  FileText,
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

const TABS: FilterTab[] = [
  "Barchasi",
  "Yashamoqda",
  "Tasdiqlangan",
  "Kutilmoqda",
  "Tugatilgan",
  "Bekor",
];

export default function Bookings() {
  const { isDark } = useTheme();
  const { t, locale, translateStatus } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("Barchasi");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);

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

  const filtered =
    activeTab === "Barchasi"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const countByStatus = (status: BookingStatus) =>
    bookings.filter((b) => b.status === status).length;

  const getStatusBadge = (status: BookingStatus) => {
    const text = translateStatus(status);
    let colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
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
    <div className={isDark ? "min-h-screen bg-slate-950 p-6 text-slate-100" : "min-h-screen bg-gray-50 p-6 text-gray-900"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
              {t('nav.bookings')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('bookings.total').replace('{n}', String(bookings.length))} ({t('status.living')}: {countByStatus("Yashamoqda")})
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('bookings.new')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={isDark ? "flex flex-wrap items-center gap-1 mb-6 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit shadow-xs" : "flex flex-wrap items-center gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-xs"}>
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
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : isDark
                    ? "bg-slate-800 text-slate-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className={isDark ? "bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden" : "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-slate-800/80 border-b border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider" : "bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider"}>
                <th className="text-left px-6 py-4">#</th>
                <th className="text-left px-6 py-4">{t('dashboard.guest')}</th>
                <th className="text-left px-6 py-4">{t('dashboard.room')}</th>
                <th className="text-left px-6 py-4">{t('bookings.checkIn')} / {t('bookings.checkOut')}</th>
                <th className="text-left px-6 py-4">{t('dashboard.duration')}</th>
                <th className="text-left px-6 py-4">{t('common.amount')}</th>
                <th className="text-left px-6 py-4">{t('common.status')}</th>
                <th className="text-left px-6 py-4">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={isDark ? "hover:bg-slate-800/50 transition-colors" : "hover:bg-blue-50/30 transition-colors"}
                  >
                    <td className="px-6 py-4 text-gray-400 dark:text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-sky-300 font-bold text-xs">
                            {booking.guest.charAt(0)}
                          </span>
                        </div>
                        <span className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}>
                          {booking.guest}
                        </span>
                      </div>
                    </td>
                    <td className={isDark ? "px-6 py-4 font-semibold text-slate-300" : "px-6 py-4 font-semibold text-gray-700"}>
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {booking.checkIn} <span className="text-gray-400">→</span> {booking.checkOut}
                    </td>
                    <td className="px-6 py-4">
                      <span className={isDark ? "font-bold text-slate-200" : "font-bold text-gray-800"}>
                        {booking.nights}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500 ml-1 text-xs">{t('bookings.nights')}</span>
                    </td>
                    <td className={isDark ? "px-6 py-4 font-bold text-white whitespace-nowrap" : "px-6 py-4 font-bold text-gray-900 whitespace-nowrap"}>
                      {formatPrice(booking.price)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Check-in button */}
                        {(booking.status === "Tasdiqlangan" || booking.status === "Kutilmoqda") && (
                          <button
                            onClick={() => handleCheckIn(booking.id)}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
                          >
                            <LogIn size={13} />
                            Check-in
                          </button>
                        )}

                        {/* Check-out button */}
                        {booking.status === "Yashamoqda" && (
                          <button
                            onClick={() => handleCheckOut(booking.id)}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition cursor-pointer"
                          >
                            <LogOut size={13} />
                            Check-out
                          </button>
                        )}

                        {/* Regular CRUD actions */}
                        <button
                          onClick={() => setViewBooking(booking)}
                          title={t('common.view')}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(booking)}
                          title={t('common.edit')}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/40 text-gray-400 hover:text-amber-600 transition cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          title={t('common.delete')}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className={`px-6 py-3 border-t flex flex-wrap items-center justify-between gap-2 ${isDark ? "border-slate-800 bg-slate-900/60" : "border-gray-100 bg-gray-50/50"}`}>
          <span className="text-xs text-gray-400 dark:text-slate-400 font-medium">
            {t('bookings.total').replace('{n}', String(filtered.length))}
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t('status.living')}: {countByStatus("Yashamoqda")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {t('status.confirmed')}: {countByStatus("Tasdiqlangan")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {t('status.pending')}: {countByStatus("Kutilmoqda")}
            </span>
          </div>
        </div>
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
            <div className={isDark ? "p-4 bg-slate-800/80 rounded-xl space-y-3 text-sm" : "p-4 bg-gray-50 rounded-xl space-y-3 text-sm"}>
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
                  <div className={isDark ? "flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs text-slate-300" : "flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700"}>
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
                    ? "px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition cursor-pointer"
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
