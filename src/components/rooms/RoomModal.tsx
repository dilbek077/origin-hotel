import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Room, RoomStatus, RoomType } from "@/types/room";
import { useTranslation } from "@/i18n";

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

  const labelClass = "mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400";
  const inputClass = "w-full h-11 rounded-xl border border-slate-700 bg-[#0e1215] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none";
  const actionButtonClass = "rounded-xl border border-slate-700 bg-[#141b1f] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800";
  const submitButtonClass = "rounded-xl bg-[#dfe0e4] px-4 py-2.5 text-sm font-semibold text-[#101418] transition hover:bg-white";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('rooms.modalTitleEdit') : t('rooms.modalTitleAdd')}
      maxWidth="max-w-[620px]"
      variant="dark"
    >
      <div className="bg-[#11181d] px-5 pb-5 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.number')}</label>
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
              <label className={labelClass}>{t('rooms.floor')}</label>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.type')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className={inputClass}
              >
                {ROOM_TYPES.map((tItem) => (
                  <option key={tItem} value={tItem} className="bg-[#111315] text-white">
                    {translateRoomType(tItem)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('common.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
                className={inputClass}
              >
                {ROOM_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#111315] text-white">
                    {translateStatus(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.capacity')}</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="2 kishilik"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t('rooms.price')}</label>
              <input
                type="number"
                min={1000}
                step={1}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={actionButtonClass}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={submitButtonClass}>
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
