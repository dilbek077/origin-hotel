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
import Modal from "@/components/common/Modal";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Yashamoqda: "bg-blue-100 text-blue-700 border border-blue-200",
  Tasdiqlangan: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Kutilmoqda: "bg-amber-100 text-amber-700 border border-amber-200",
  Tugatilgan: "bg-gray-100 text-gray-700 border border-gray-200",
  Bekor: "bg-red-100 text-red-600 border border-red-200",
};

const STATUS_DOT: Record<BookingStatus, string> = {
  Yashamoqda: "bg-blue-500",
  Tasdiqlangan: "bg-emerald-500",
  Kutilmoqda: "bg-amber-500",
  Tugatilgan: "bg-gray-500",
  Bekor: "bg-red-500",
};

type FilterTab = "Barchasi" | BookingStatus;

const TABS: FilterTab[] = [
  "Barchasi",
  "Yashamoqda",
  "Tasdiqlangan",
  "Kutilmoqda",
  "Tugatilgan",
  "Bekor",
];

function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ") + " so‘m";
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("Barchasi");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

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
    if (window.confirm("Haqiqatan ham bu bronni o‘chirmoqchimisiz?")) {
      StorageService.deleteBooking(id);
    }
  };

  const handleCheckIn = (id: number) => {
    if (window.confirm("Mehmonni ro‘yxatga olish (Check-in) va xonani Band qilishni tasdiqlaysizmi?")) {
      StorageService.checkInBooking(id);
    }
  };

  const handleCheckOut = (id: number) => {
    if (window.confirm("Mehmonni chiqarish (Check-out), xonani Tozalashga o‘tkazish va to‘lovni hisobga olishni tasdiqlaysizmi?")) {
      StorageService.checkOutBooking(id);
    }
  };

  const filtered =
    activeTab === "Barchasi"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const countByStatus = (status: BookingStatus) =>
    bookings.filter((b) => b.status === status).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bronlar & Yashash</h1>
            <p className="text-sm text-gray-500">
              Jami {bookings.length} ta bron (Hozir yashamoqda: {countByStatus("Yashamoqda")})
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yangi bron yaratish
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-xs">
        {TABS.map((tab) => {
          const count =
            tab === "Barchasi" ? bookings.length : countByStatus(tab as BookingStatus);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-blue-500 text-white"
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Mehmon
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Xona
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Kelish / Ketish
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Muddat
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Narxi
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amallar & Check-in/out
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Bron topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-xs">
                            {booking.guest.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {booking.guest}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {booking.checkIn} <span className="text-gray-400">→</span> {booking.checkOut}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">
                        {booking.nights}
                      </span>
                      <span className="text-gray-400 ml-1 text-xs">kecha</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(booking.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          STATUS_STYLES[booking.status]
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`}
                        />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Check-in button */}
                        {(booking.status === "Tasdiqlangan" || booking.status === "Kutilmoqda") && (
                          <button
                            onClick={() => handleCheckIn(booking.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                            title="Xonaga joylashtirish (Check-in)"
                          >
                            <LogIn size={13} />
                            Check-in
                          </button>
                        )}

                        {/* Check-out button */}
                        {booking.status === "Yashamoqda" && (
                          <button
                            onClick={() => handleCheckOut(booking.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                            title="Chiqarish (Check-out) va xonani tozalashga o‘tkazish"
                          >
                            <LogOut size={13} />
                            Check-out
                          </button>
                        )}

                        {/* Regular CRUD actions */}
                        <button
                          onClick={() => setViewBooking(booking)}
                          title="Ko‘rish"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(booking)}
                          title="Tahrirlash"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          title="O‘chirish"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
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
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-gray-500 font-medium">
            Jami {filtered.length} ta bron ko‘rsatilmoqda
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Yashamoqda: {countByStatus("Yashamoqda")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Tasdiqlangan: {countByStatus("Tasdiqlangan")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Kutilmoqda: {countByStatus("Kutilmoqda")}
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

      {/* View Booking Details Modal */}
      {viewBooking && (
        <Modal
          isOpen={!!viewBooking}
          onClose={() => setViewBooking(null)}
          title={`Bron #${viewBooking.id} ma’lumotlari`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mehmon:</span>
                <span className="font-bold text-gray-900">{viewBooking.guest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Xona:</span>
                <span className="font-semibold text-gray-800">{viewBooking.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kelish va Ketish:</span>
                <span className="font-semibold text-gray-800">
                  {viewBooking.checkIn} — {viewBooking.checkOut} ({viewBooking.nights} kecha)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Holat:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[viewBooking.status]}`}>
                  {viewBooking.status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-500">Jami to‘lov:</span>
                <span className="font-bold text-blue-600 text-base">{formatPrice(viewBooking.price)}</span>
              </div>
              {viewBooking.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="block text-gray-500 mb-1">Izoh:</span>
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700">
                    <FileText size={14} className="text-gray-400 mt-0.5" />
                    <span>{viewBooking.notes}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewBooking(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
