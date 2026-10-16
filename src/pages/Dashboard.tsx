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
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import BookingModal from "@/components/bookings/BookingModal";
import GuestModal from "@/components/guests/GuestModal";

const statusStyles: Record<string, string> = {
  Yashamoqda: "bg-blue-100 text-blue-700 border border-blue-200",
  Tasdiqlangan: "bg-green-100 text-green-700 border border-green-200",
  Kutilmoqda: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Tugatilgan: "bg-gray-100 text-gray-700 border border-gray-200",
  Bekor: "bg-red-100 text-red-600 border border-red-200",
};

const formatCurrency = (n: number) => n.toLocaleString("uz-UZ") + " so‘m";

export default function Dashboard() {
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

  // Today's check-ins and check-outs (TZ requirement)
  const todayCheckIns = bookings.filter((b) => b.checkIn === todayStr).length;
  const todayCheckOuts = bookings.filter((b) => b.checkOut === todayStr).length;

  // Income and Expense sums (TZ requirement)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

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
    if (window.confirm("Mehmonni ro‘yxatga olish (Check-in) va xonani Band qilishni tasdiqlaysizmi?")) {
      StorageService.checkInBooking(id);
    }
  };

  const handleCheckOut = (id: number) => {
    if (window.confirm("Mehmonni chiqarish (Check-out) va xonani tozalashga o‘tkazishni tasdiqlaysizmi?")) {
      StorageService.checkOutBooking(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boshqaruv paneli (Dashboard)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bugun:{" "}
            {new Date().toLocaleDateString("uz-UZ", {
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
            Yangi bron
          </button>
          <button
            onClick={() => setGuestModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <UserPlus size={16} className="text-purple-600" />
            Yangi mehmon
          </button>
        </div>
      </div>

      {/* TZ Required Core 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Xonalar jami & bandlik */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 rounded-2xl p-3.5">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Xonalar jami</p>
            <p className="text-2xl font-black text-gray-900 leading-tight mt-0.5">{totalRooms} ta</p>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">
              Bo‘sh: {vacantRooms} | Band: {occupiedRooms}
            </p>
          </div>
        </div>

        {/* 2. Bugungi kirish va chiqishlar (Check-in / Check-out) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-purple-50 text-purple-600 rounded-2xl p-3.5">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bugungi kirish/chiqish</p>
            <p className="text-2xl font-black text-gray-900 leading-tight mt-0.5">
              {todayCheckIns} / {todayCheckOuts}
            </p>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">
              Kirish: {todayCheckIns} ta | Chiqish: {todayCheckOuts} ta
            </p>
          </div>
        </div>

        {/* 3. Kirim yig'indisi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-green-50 text-green-600 rounded-2xl p-3.5">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kirim yig‘indisi</p>
            <p className="text-xl font-black text-green-600 leading-tight mt-0.5">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Jami tushumlar</p>
          </div>
        </div>

        {/* 4. Chiqim yig'indisi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-red-50 text-red-600 rounded-2xl p-3.5">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chiqim yig‘indisi</p>
            <p className="text-xl font-black text-red-600 leading-tight mt-0.5">{formatCurrency(totalExpense)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Jami xarajatlar</p>
          </div>
        </div>
      </div>

      {/* Room Status Breakdown Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Xonalar holati monitoringi</h2>
            <p className="text-xs text-gray-400">Hozirgi bandlik darajasi: {occupancyPercent}%</p>
          </div>
          <Link
            to="/admin/xonalar"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 sm:mt-0"
          >
            Barcha xonalarni ko‘rish →
          </Link>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-5">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-emerald-50 rounded-xl py-3 px-2 border border-emerald-100">
            <p className="text-xl font-black text-emerald-700">{vacantRooms}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">Bo‘sh xonalar</p>
          </div>
          <div className="bg-red-50 rounded-xl py-3 px-2 border border-red-100">
            <p className="text-xl font-black text-red-700">{occupiedRooms}</p>
            <p className="text-xs font-semibold text-red-600 mt-0.5">Band xonalar</p>
          </div>
          <div className="bg-amber-50 rounded-xl py-3 px-2 border border-amber-100">
            <p className="text-xl font-black text-amber-700">{cleaningRooms}</p>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">Tozalashda</p>
          </div>
          <div className="bg-purple-50 rounded-xl py-3 px-2 border border-purple-100">
            <p className="text-xl font-black text-purple-700">{maintenanceRooms}</p>
            <p className="text-xs font-semibold text-purple-600 mt-0.5">Ta’mirda</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">So‘nggi bronlar & Check-in/out</h2>
            <p className="text-xs text-gray-400">Mehmonlarni tezkor joylashtirish va chiqarish</p>
          </div>
          <Link
            to="/admin/bronlar"
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Barchasini ko‘rish →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase font-semibold">
                <th className="px-6 py-3.5 text-left">Mehmon</th>
                <th className="px-6 py-3.5 text-left">Xona</th>
                <th className="px-6 py-3.5 text-left">Kelish</th>
                <th className="px-6 py-3.5 text-left">Ketish</th>
                <th className="px-6 py-3.5 text-left">Status</th>
                <th className="px-6 py-3.5 text-right">Tezkor amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{b.guest}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{b.room}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs font-mono">{b.checkIn}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs font-mono">{b.checkOut}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        statusStyles[b.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(b.status === "Tasdiqlangan" || b.status === "Kutilmoqda") && (
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                      >
                        <LogIn size={13} />
                        Check-in
                      </button>
                    )}
                    {b.status === "Yashamoqda" && (
                      <button
                        onClick={() => handleCheckOut(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
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
