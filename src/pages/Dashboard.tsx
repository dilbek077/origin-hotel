import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  PlusCircle,
  UserPlus,
  LogIn,
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import BookingModal from "@/components/bookings/BookingModal";
import GuestModal from "@/components/guests/GuestModal";

export default function Dashboard() {
  const { isDark } = useTheme();
  const { t, locale, translateStatus } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const loadData = () => {
    setRooms(StorageService.getRooms());
    setBookings(StorageService.getBookings());
    setGuests(StorageService.getGuests());
    setTransactions(StorageService.getTransactions());
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  // Room counts
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "Band").length;
  const vacantRooms = rooms.filter((r) => r.status === "Bo'sh").length;
  const cleaningRooms = rooms.filter((r) => r.status === "Tozalashda").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "Ta'mirda").length;

  const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Today's check-ins and check-outs
  const todayCheckIns = bookings.filter((b) => b.checkIn === todayStr).length;
  const todayCheckOuts = bookings.filter((b) => b.checkOut === todayStr).length;

  // Income and Expense sums
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (n: number) =>
    n.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');

  const handleSaveBooking = (data: Omit<Booking, "id"> | Booking) => {
    if ("id" in data) {
      return StorageService.updateBooking(data as Booking);
    } else {
      return StorageService.addBooking(data);
    }
  };

  const handleSaveGuest = (guestData: Omit<Guest, "id"> | Guest) => {
    if ("id" in guestData) {
      StorageService.updateGuest(guestData as Guest);
    } else {
      StorageService.addGuest(guestData);
    }
    return true;
  };

  const handleCheckIn = (id: number) => {
    if (window.confirm(t('dashboard.confirmCheckIn'))) {
      StorageService.checkInBooking(id);
    }
  };

  const handleCheckOut = (id: number) => {
    if (window.confirm(t('dashboard.confirmCheckOut'))) {
      StorageService.checkOutBooking(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const text = translateStatus(status);
    let colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    if (status === "Yashamoqda") {
      colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30";
    } else if (status === "Tasdiqlangan") {
      colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";
    } else if (status === "Kutilmoqda") {
      colorClass = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
    } else if (status === "Bekor") {
      colorClass = "bg-red-100 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";
    }
    return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>{text}</span>;
  };

  const dateLocaleCode =
    locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 p-6 space-y-8 text-slate-100" : "min-h-screen bg-gray-50 p-6 space-y-8 text-gray-900"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
            {t('nav.dashboard')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t('dashboard.today')}{" "}
            {new Date().toLocaleDateString(dateLocaleCode, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBookingModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <PlusCircle size={16} />
            {t('dashboard.newBooking')}
          </button>
          <button
            onClick={() => setGuestModalOpen(true)}
            className={
              isDark
                ? "flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                : "flex items-center gap-1.5 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            }
          >
            <UserPlus size={16} className="text-purple-500" />
            {t('dashboard.newGuest')}
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Xonalar jami & bandlik */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 flex items-center gap-4" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"}>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl p-3.5">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.totalRooms')}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight mt-0.5">{totalRooms} {t('dashboard.roomsCount')}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              {t('status.vacant')}: {vacantRooms} | {t('status.occupied')}: {occupiedRooms}
            </p>
          </div>
        </div>

        {/* 2. Bugungi kirish va chiqishlar */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 flex items-center gap-4" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"}>
          <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl p-3.5">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.todayInOut')}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight mt-0.5">
              {todayCheckIns} / {todayCheckOuts}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              {t('dashboard.checkIn')}: {todayCheckIns} | {t('dashboard.checkOut')}: {todayCheckOuts}
            </p>
          </div>
        </div>

        {/* 3. Kirim yig'indisi */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 flex items-center gap-4" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"}>
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl p-3.5">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.totalIncome')}</p>
            <p className="text-xl font-black text-green-600 dark:text-green-400 leading-tight mt-0.5">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t('dashboard.allRevenue')}</p>
          </div>
        </div>

        {/* 4. Chiqim yig'indisi */}
        <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 flex items-center gap-4" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"}>
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl p-3.5">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.totalExpense')}</p>
            <p className="text-xl font-black text-red-600 dark:text-red-400 leading-tight mt-0.5">{formatCurrency(totalExpense)}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t('dashboard.allExpenses')}</p>
          </div>
        </div>
      </div>

      {/* Room Status Breakdown Bar */}
      <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-gray-900"}>{t('dashboard.monitoring')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-400">{t('dashboard.currentOccupancy')} {occupancyPercent}%</p>
          </div>
          <Link
            to="/admin/xonalar"
            className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline mt-2 sm:mt-0"
          >
            {t('dashboard.viewAllRooms')}
          </Link>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden mb-5">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className={isDark ? "bg-emerald-950/40 rounded-xl py-3 px-2 border border-emerald-800/40" : "bg-emerald-50 rounded-xl py-3 px-2 border border-emerald-100"}>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{vacantRooms}</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mt-0.5">{t('status.vacant')}</p>
          </div>
          <div className={isDark ? "bg-red-950/40 rounded-xl py-3 px-2 border border-red-800/40" : "bg-red-50 rounded-xl py-3 px-2 border border-red-100"}>
            <p className="text-xl font-black text-red-600 dark:text-red-400">{occupiedRooms}</p>
            <p className="text-xs font-semibold text-red-600 dark:text-red-300 mt-0.5">{t('status.occupied')}</p>
          </div>
          <div className={isDark ? "bg-amber-950/40 rounded-xl py-3 px-2 border border-amber-800/40" : "bg-amber-50 rounded-xl py-3 px-2 border border-amber-100"}>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{cleaningRooms}</p>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 mt-0.5">{t('status.cleaning')}</p>
          </div>
          <div className={isDark ? "bg-purple-950/40 rounded-xl py-3 px-2 border border-purple-800/40" : "bg-purple-50 rounded-xl py-3 px-2 border border-purple-100"}>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">{maintenanceRooms}</p>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 mt-0.5">{t('status.maintenance')}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className={isDark ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" : "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <div>
            <h2 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-gray-900"}>{t('dashboard.recentBookings')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-400">{t('dashboard.recentSub')}</p>
          </div>
          <Link
            to="/admin/bronlar"
            className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline"
          >
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-slate-800/80 text-slate-300 text-xs uppercase font-semibold" : "bg-gray-50/70 text-gray-500 text-xs uppercase font-semibold"}>
                <th className="px-6 py-3.5 text-left">{t('dashboard.guest')}</th>
                <th className="px-6 py-3.5 text-left">{t('dashboard.room')}</th>
                <th className="px-6 py-3.5 text-left">{t('dashboard.checkIn')}</th>
                <th className="px-6 py-3.5 text-left">{t('dashboard.checkOut')}</th>
                <th className="px-6 py-3.5 text-left">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className={isDark ? "hover:bg-slate-800/50 transition-colors" : "hover:bg-blue-50/30 transition-colors"}>
                  <td className={isDark ? "px-6 py-4 font-semibold text-white" : "px-6 py-4 font-semibold text-gray-900"}>{b.guest}</td>
                  <td className={isDark ? "px-6 py-4 text-slate-300 font-medium" : "px-6 py-4 text-gray-700 font-medium"}>{b.room}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-slate-400 text-xs font-mono">{b.checkIn}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-slate-400 text-xs font-mono">{b.checkOut}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(b.status === "Tasdiqlangan" || b.status === "Kutilmoqda") && (
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <LogIn size={13} />
                        Check-in
                      </button>
                    )}
                    {b.status === "Yashamoqda" && (
                      <button
                        onClick={() => handleCheckOut(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <LogOut size={13} />
                        Check-out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSave={handleSaveBooking}
        rooms={rooms}
        guests={guests}
      />

      <GuestModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        onSave={handleSaveGuest}
      />
    </div>
  );
}
