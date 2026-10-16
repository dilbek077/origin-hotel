import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Room, RoomStatus, RoomType } from "@/types/room";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: Omit<Room, "id"> | Room) => { success: boolean; error?: string };
  initialData?: Room | null;
}

const ROOM_TYPES: RoomType[] = ["Standart", "Deluxe", "Suite", "President"];
const ROOM_STATUSES: RoomStatus[] = ["Bo'sh", "Band", "Tozalashda", "Ta'mirda"];

export default function RoomModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: RoomModalProps) {
  const [number, setNumber] = useState("");
  const [type, setType] = useState<RoomType>("Standart");
  const [pricePerNight, setPricePerNight] = useState<number>(350000);
  const [capacity, setCapacity] = useState("2 kishilik");
  const [status, setStatus] = useState<RoomStatus>("Bo'sh");
  const [floor, setFloor] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNumber(initialData.number);
      setType(initialData.type);
      setPricePerNight(initialData.pricePerNight);
      setCapacity(initialData.capacity);
      setStatus(initialData.status);
      setFloor(initialData.floor);
    } else {
      setNumber("");
      setType("Standart");
      setPricePerNight(350000);
      setCapacity("2 kishilik");
      setStatus("Bo'sh");
      setFloor(1);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!number.trim()) {
      setError("Xona raqamini kiriting!");
      return;
    }
    if (pricePerNight <= 0) {
      setError("Narx 0 dan katta bo‘lishi kerak!");
      return;
    }

    const payload = initialData
      ? {
          ...initialData,
          number: number.trim(),
          type,
          pricePerNight: Number(pricePerNight),
          capacity: capacity.trim() || "1 kishilik",
          status,
          floor: Number(floor) || 1,
        }
      : {
          number: number.trim(),
          type,
          pricePerNight: Number(pricePerNight),
          capacity: capacity.trim() || "1 kishilik",
          status,
          floor: Number(floor) || 1,
        };

    const res = onSave(payload);
    if (!res.success) {
      setError(res.error || "Xatolik yuz berdi");
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Xonani tahrirlash" : "Yangi xona qo‘shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Xona raqami *
            </label>
            <input
              type="text"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Masalan, 101"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Qavat
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Xona turi
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RoomType)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sig‘imi (kishilik) *
            </label>
            <input
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Masalan, 2 kishilik"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Bir kecha narxi (so‘m) *
            </label>
            <input
              type="number"
              min={1000}
              step={10000}
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Holati
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {ROOM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
          >
            {initialData ? "Saqlash" : "Qo‘shish"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
