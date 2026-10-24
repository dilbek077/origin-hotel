import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Room, RoomStatus, RoomType } from "@/types/room";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/theme";

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
  const { t, translateStatus, translateRoomType } = useTranslation();
  const { isDark } = useTheme();
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
      setError(t('rooms.number') + " !");
      return;
    }
    if (pricePerNight <= 0) {
      setError("Price > 0 !");
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

  const labelClass = isDark ? "block text-xs font-semibold text-slate-300 mb-1" : "block text-xs font-semibold text-gray-700 mb-1";
  const inputClass = isDark
    ? "w-full px-3.5 py-2 text-sm border border-slate-700 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    : "w-full px-3.5 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('rooms.modalTitleEdit') : t('rooms.modalTitleAdd')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium border border-red-500/30">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('rooms.number')} *
            </label>
            <input
              type="text"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="101"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('rooms.floor')}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('rooms.type')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RoomType)}
              className={inputClass}
            >
              {ROOM_TYPES.map((tItem) => (
                <option key={tItem} value={tItem} className={isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                  {translateRoomType(tItem)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {t('rooms.capacity')} *
            </label>
            <input
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="2 kishilik"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('rooms.price')} *
            </label>
            <input
              type="number"
              min={1000}
              step={1}
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('common.status')}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className={inputClass}
            >
              {ROOM_STATUSES.map((s) => (
                <option key={s} value={s} className={isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                  {translateStatus(s)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className={
              isDark
                ? "px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                : "px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            }
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition shadow-xs cursor-pointer"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
