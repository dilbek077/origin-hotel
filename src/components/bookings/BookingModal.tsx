import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Room } from "@/types/room";
import type { Guest } from "@/types/guest";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/theme";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingData: Omit<Booking, "id"> | Booking) => { success: boolean; error?: string };
  initialData?: Booking | null;
  rooms: Room[];
  guests: Guest[];
}

const BOOKING_STATUSES: BookingStatus[] = [
  "Kutilmoqda",
  "Tasdiqlangan",
  "Yashamoqda",
  "Tugatilgan",
  "Bekor",
];

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  rooms,
  guests,
}: BookingModalProps) {
  const { t, translateStatus, translateRoomType } = useTranslation();
  const { isDark } = useTheme();
  const [guestId, setGuestId] = useState<number>(guests[0]?.id || 0);
  const [roomId, setRoomId] = useState<number>(rooms[0]?.id || 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextThreeDays = new Date();
  nextThreeDays.setDate(nextThreeDays.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(nextThreeDays.toISOString().split("T")[0]);
  const [status, setStatus] = useState<BookingStatus>("Kutilmoqda");
  const [notes, setNotes] = useState("");
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  // Auto calculate nights
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const autoPrice = (selectedRoom?.pricePerNight || 350000) * (calculatedNights > 0 ? calculatedNights : 1);
  const finalPrice = customPrice !== "" ? Number(customPrice) : autoPrice;

  useEffect(() => {
    if (initialData) {
      setGuestId(initialData.guestId);
      setRoomId(initialData.roomId);
      setCheckIn(initialData.checkIn);
      setCheckOut(initialData.checkOut);
      setStatus(initialData.status);
      setNotes(initialData.notes || "");
      setCustomPrice(initialData.price);
    } else {
      if (guests.length > 0) setGuestId(guests[0].id);
      if (rooms.length > 0) setRoomId(rooms[0].id);
      setStatus("Kutilmoqda");
      setNotes("");
      setCustomPrice("");
    }
    setError(null);
  }, [initialData, isOpen, guests, rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date!");
      return;
    }

    const currentGuest = guests.find((g) => g.id === guestId);
    const currentRoom = rooms.find((r) => r.id === roomId);

    if (!currentGuest) {
      setError(t('bookings.selectGuest'));
      return;
    }
    if (!currentRoom) {
      setError(t('bookings.selectRoom'));
      return;
    }

    const payload = initialData
      ? {
          ...initialData,
          guestId,
          guest: currentGuest.fullName,
          roomId,
          room: `${currentRoom.number} — ${currentRoom.type}`,
          checkIn,
          checkOut,
          nights: calculatedNights,
          price: finalPrice,
          status,
          notes,
        }
      : {
          guestId,
          guest: currentGuest.fullName,
          roomId,
          room: `${currentRoom.number} — ${currentRoom.type}`,
          checkIn,
          checkOut,
          nights: calculatedNights,
          price: finalPrice,
          status,
          notes,
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
    ? "w-full px-3.5 py-2 text-sm border border-[#1c252d] bg-[#0b1015] text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    : "w-full px-3.5 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('bookings.modalTitleEdit') : t('bookings.modalTitleAdd')}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium border border-red-500/30">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('bookings.selectGuest')} *
            </label>
            <select
              value={guestId}
              onChange={(e) => setGuestId(Number(e.target.value))}
              className={inputClass}
            >
              {guests.map((g) => (
                <option key={g.id} value={g.id} className={isDark ? "bg-[#0b1015] text-white" : "bg-white text-slate-900"}>
                  {g.fullName} ({g.phone || "-"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {t('bookings.selectRoom')} *
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(Number(e.target.value))}
              className={inputClass}
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id} className={isDark ? "bg-[#0b1015] text-white" : "bg-white text-slate-900"}>
                  #{r.number} - {translateRoomType(r.type)} ({r.capacity}) - {r.pricePerNight.toLocaleString()} {t('common.currency')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('bookings.checkIn')} *
            </label>
            <input
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('bookings.checkOut')} *
            </label>
            <input
              type="date"
              required
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('common.status')}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className={inputClass}
            >
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s} className={isDark ? "bg-[#0b1015] text-white" : "bg-white text-slate-900"}>
                  {translateStatus(s)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {t('bookings.totalSum')} ({calculatedNights} {t('bookings.nights')}) *
            </label>
            <input
              type="number"
              min={0}
              value={finalPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            {t('common.notes')}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="..."
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className={
              isDark
                ? "px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                : "px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            }
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition cursor-pointer"
          >
            {initialData ? t('common.save') : t('landing.rooms.book')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
