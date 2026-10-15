import { useState } from "react";
import { Plus, Search, BedDouble, Eye, Edit } from "lucide-react";

type RoomStatus = "Bo'sh" | "Band" | "Ta'mirda";
type RoomType = "Standart" | "Deluxe" | "Suite" | "President";

interface Room {
  id: number;
  number: string;
  type: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
}

const mockRooms: Room[] = [
  { id: 1, number: "101", type: "Standart",  pricePerNight: 350000,  status: "Bo'sh",    floor: 1 },
  { id: 2, number: "102", type: "Deluxe",    pricePerNight: 550000,  status: "Band",     floor: 1 },
  { id: 3, number: "203", type: "Suite",     pricePerNight: 900000,  status: "Bo'sh",    floor: 2 },
  { id: 4, number: "204", type: "Standart",  pricePerNight: 350000,  status: "Ta'mirda", floor: 2 },
  { id: 5, number: "305", type: "Deluxe",    pricePerNight: 550000,  status: "Band",     floor: 3 },
  { id: 6, number: "306", type: "President", pricePerNight: 1500000, status: "Bo'sh",    floor: 3 },
  { id: 7, number: "407", type: "Suite",     pricePerNight: 900000,  status: "Band",     floor: 4 },
  { id: 8, number: "408", type: "Standart",  pricePerNight: 350000,  status: "Bo'sh",    floor: 4 },
];

const STATUS_OPTIONS = ["Barchasi", "Bo'sh", "Band", "Ta'mirda"] as const;

const statusStyles: Record<RoomStatus, string> = {
  "Bo'sh":    "bg-green-100 text-green-700",
  "Band":     "bg-red-100 text-red-700",
  "Ta'mirda": "bg-yellow-100 text-yellow-700",
};

const typeColors: Record<RoomType, string> = {
  Standart:  "bg-blue-50 text-blue-600",
  Deluxe:    "bg-purple-50 text-purple-600",
  Suite:     "bg-indigo-50 text-indigo-600",
  President: "bg-amber-50 text-amber-600",
};

function formatPrice(amount: number): string {
  return amount.toLocaleString("uz-UZ") + " so'm";
}

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Barchasi");

  const filtered = mockRooms.filter((room) => {
    const matchesSearch =
      room.number.includes(search) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Barchasi" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xonalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Jami {mockRooms.length} ta xona
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Plus size={18} />
          Yangi xona qo'shish
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Xona raqami yoki turi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-700"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Room Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <BedDouble size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium">Xona topilmadi</p>
          <p className="text-sm">Qidiruv yoki filtrni o'zgartiring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BedDouble size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">
                      #{room.number}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {room.floor}-qavat
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[room.status]}`}
                >
                  {room.status}
                </span>
              </div>

              {/* Room Type */}
              <span
                className={`self-start text-xs font-semibold px-2.5 py-1 rounded-md ${typeColors[room.type]}`}
              >
                {room.type}
              </span>

              {/* Price */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-0.5">Bir kecha narxi</p>
                <p className="text-base font-bold text-gray-800">
                  {formatPrice(room.pricePerNight)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 py-2 rounded-lg transition-colors">
                  <Eye size={14} />
                  Ko'rish
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 py-2 rounded-lg transition-colors">
                  <Edit size={14} />
                  Tahrirlash
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
