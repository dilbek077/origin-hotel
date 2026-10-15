import { useState } from "react";
import { Eye, Pencil, Trash2, CalendarDays, Plus } from "lucide-react";

type BookingStatus = "Kutilmoqda" | "Tasdiqlangan" | "Bekor";

interface Booking {
  id: number;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  price: number;
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    guest: "Aliyev Jasur",
    room: "101 — Standart",
    checkIn: "15.10.2025",
    checkOut: "18.10.2025",
    nights: 3,
    price: 750000,
    status: "Tasdiqlangan",
  },
  {
    id: 2,
    guest: "Karimova Malika",
    room: "205 — Deluxe",
    checkIn: "16.10.2025",
    checkOut: "20.10.2025",
    nights: 4,
    price: 1200000,
    status: "Kutilmoqda",
  },
  {
    id: 3,
    guest: "Toshmatov Sardor",
    room: "310 — Suite",
    checkIn: "14.10.2025",
    checkOut: "17.10.2025",
    nights: 3,
    price: 1800000,
    status: "Tasdiqlangan",
  },
  {
    id: 4,
    guest: "Rahimova Dilnoza",
    room: "108 — Standart",
    checkIn: "10.10.2025",
    checkOut: "12.10.2025",
    nights: 2,
    price: 500000,
    status: "Bekor",
  },
  {
    id: 5,
    guest: "Yusupov Bobur",
    room: "212 — Deluxe",
    checkIn: "18.10.2025",
    checkOut: "22.10.2025",
    nights: 4,
    price: 1200000,
    status: "Kutilmoqda",
  },
  {
    id: 6,
    guest: "Nazarova Feruza",
    room: "401 — Prezident",
    checkIn: "20.10.2025",
    checkOut: "25.10.2025",
    nights: 5,
    price: 3500000,
    status: "Tasdiqlangan",
  },
  {
    id: 7,
    guest: "Hamidov Sherzod",
    room: "115 — Standart",
    checkIn: "08.10.2025",
    checkOut: "09.10.2025",
    nights: 1,
    price: 250000,
    status: "Bekor",
  },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  Tasdiqlangan: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Kutilmoqda: "bg-amber-100 text-amber-700 border border-amber-200",
  Bekor: "bg-red-100 text-red-600 border border-red-200",
};

const STATUS_DOT: Record<BookingStatus, string> = {
  Tasdiqlangan: "bg-emerald-500",
  Kutilmoqda: "bg-amber-500",
  Bekor: "bg-red-500",
};

type FilterTab = "Barchasi" | BookingStatus;

const TABS: FilterTab[] = ["Barchasi", "Kutilmoqda", "Tasdiqlangan", "Bekor"];

function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ") + " so'm";
}

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Barchasi");

  const filtered =
    activeTab === "Barchasi"
      ? mockBookings
      : mockBookings.filter((b) => b.status === activeTab);

  const countByStatus = (status: BookingStatus) =>
    mockBookings.filter((b) => b.status === status).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bronlar</h1>
            <p className="text-sm text-gray-500">{mockBookings.length} ta bron mavjud</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Yangi bron
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
        {TABS.map((tab) => {
          const count =
            tab === "Barchasi"
              ? mockBookings.length
              : countByStatus(tab as BookingStatus);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-500"
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
              <tr className="bg-gray-50 border-b border-gray-100">
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
                  Kirish sanasi
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Chiqish sanasi
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Kunlar
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Narx
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    Bron topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-xs">
                            {booking.guest.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {booking.guest}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.room}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.checkIn}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.checkOut}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {booking.nights}
                      </span>
                      <span className="text-gray-400 ml-1 text-xs">kun</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(booking.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
                      <div className="flex items-center gap-1">
                        <button
                          title="Ko'rish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Tahrirlash"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="O'chirish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Jami {filtered.length} ta bron ko'rsatilmoqda
          </span>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Tasdiqlangan: {countByStatus("Tasdiqlangan")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Kutilmoqda: {countByStatus("Kutilmoqda")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Bekor: {countByStatus("Bekor")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
