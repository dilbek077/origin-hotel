import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Guest } from "@/types/guest";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guestData: Omit<Guest, "id"> | Guest) => boolean;
  initialData?: Guest | null;
}

export default function GuestModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: GuestModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [passport, setPassport] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setPhone(initialData.phone || "");
      setPassport(initialData.passport || "");
      setNotes(initialData.notes || "");
      setAddress(initialData.address || "");
    } else {
      setFullName("");
      setPhone("");
      setPassport("");
      setNotes("");
      setAddress("");
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Ism-familiyani kiritish shart!");
      return;
    }

    const payload = initialData
      ? {
          ...initialData,
          fullName: fullName.trim(),
          phone: phone.trim(),
          passport: passport.trim(),
          notes: notes.trim(),
          address: address.trim(),
        }
      : {
          fullName: fullName.trim(),
          phone: phone.trim(),
          passport: passport.trim(),
          notes: notes.trim(),
          address: address.trim(),
        };

    const ok = onSave(payload);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Mehmon ma’lumotlarini tahrirlash" : "Yangi mehmon qo‘shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            F.I.O (Ism-Familiya) *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Masalan, Aliyev Jasur Baxtiyorovich"
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Telefon raqami (ixtiyoriy)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Passport raqami (test ma’lumoti)
            </label>
            <input
              type="text"
              value={passport}
              onChange={(e) => setPassport(e.target.value.toUpperCase())}
              placeholder="AA 1234567"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Manzil (shahar / viloyat)
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Qarshi shahri..."
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Izoh (Eslatma / Maxsus talablar)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mehmon haqida qo‘shimcha eslatmalar..."
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
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
