import { useState, useEffect } from "react";
import { Plus, Search, BedDouble, Eye, Edit, Trash2, Users } from "lucide-react";
import type { Room, RoomStatus } from "@/types/room";
import { StorageService } from "@/services/storage";
import RoomModal from "@/components/rooms/RoomModal";
import Modal from "@/components/common/Modal";

const STATUS_OPTIONS = ["Barchasi", "Bo'sh", "Band", "Tozalashda", "Ta'mirda"] as const;

const statusStyles: Record<RoomStatus, string> = {
  "Bo'sh": "bg-emerald-100 text-emerald-800 border border-emerald-200",
  "Band": "bg-red-100 text-red-800 border border-red-200",
  "Tozalashda": "bg-amber-100 text-amber-800 border border-amber-200",
  "Ta'mirda": "bg-purple-100 text-purple-800 border border-purple-200",
};

const typeColors: Record<string, string> = {
  Standart: "bg-blue-50 text-blue-700 border border-blue-100",
  Deluxe: "bg-purple-50 text-purple-700 border border-purple-100",
  Suite: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  President: "bg-amber-50 text-amber-700 border border-amber-100",
};

function formatPrice(amount: number): string {
  return amount.toLocaleString("uz-UZ") + " so‘m";
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Barchasi");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [viewRoom, setViewRoom] = useState<Room | null>(null);

  const loadRooms = () => {
    setRooms(StorageService.getRooms());
  };

  useEffect(() => {
    loadRooms();
    const handleStorageChange = () => loadRooms();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const handleSave = (roomData: Omit<Room, "id"> | Room) => {
    if ("id" in roomData) {
      return StorageService.updateRoom(roomData as Room);
    } else {
      return StorageService.addRoom(roomData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Haqiqatan ham bu xonani o‘chirmoqchimisiz?")) {
      StorageService.deleteRoom(id);
    }
  };

  const filtered = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Barchasi" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xonalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Jami {rooms.length} ta xona (Bo‘sh: {rooms.filter((r) => r.status === "Bo'sh").length}, Band: {rooms.filter((r) => r.status === "Band").length})
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          Yangi xona qo‘shish
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
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-700 shadow-xs"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer shadow-xs"
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
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <BedDouble size={48} className="mb-3 opacity-40" />
          <p className="text-base font-semibold text-gray-700">Xona topilmadi</p>
          <p className="text-xs text-gray-400 mt-1">Qidiruv yoki filtr mezonlarini o‘zgartiring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                      <BedDouble size={22} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900 leading-none">
                        #{room.number}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {room.floor}-qavat
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[room.status]}`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 my-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${typeColors[room.type] || "bg-gray-100 text-gray-700"}`}
                  >
                    {room.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    <Users size={12} />
                    {room.capacity}
                  </span>
                </div>
              </div>

              <div>
                {/* Price */}
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <p className="text-[11px] text-gray-400 font-medium">1 kecha uchun narx</p>
                  <p className="text-base font-bold text-gray-900">
                    {formatPrice(room.pricePerNight)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => setViewRoom(room)}
                    title="Ko‘rish"
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-xl transition"
                  >
                    <Eye size={14} />
                    Ko‘rish
                  </button>
                  <button
                    onClick={() => handleOpenEdit(room)}
                    title="Tahrirlash"
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-2 rounded-xl transition"
                  >
                    <Edit size={14} />
                    Tahrir
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    title="O‘chirish"
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingRoom}
      />

      {/* View Details Modal */}
      {viewRoom && (
        <Modal
          isOpen={!!viewRoom}
          onClose={() => setViewRoom(null)}
          title={`Xona #${viewRoom.number} tafsilotlari`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Xona raqami:</span>
                <span className="font-bold text-gray-900">#{viewRoom.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Xona turi:</span>
                <span className="font-semibold text-gray-800">{viewRoom.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Qavat:</span>
                <span className="font-semibold text-gray-800">{viewRoom.floor}-qavat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sig‘imi:</span>
                <span className="font-semibold text-gray-800">{viewRoom.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Holati:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[viewRoom.status]}`}>
                  {viewRoom.status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-500">Bir kecha narxi:</span>
                <span className="font-bold text-blue-600 text-base">{formatPrice(viewRoom.pricePerNight)}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewRoom(null)}
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
