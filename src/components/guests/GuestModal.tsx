import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import type { Guest } from "@/types/guest";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/theme";

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
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
      setError(t('guests.name') + " *");
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

  const labelClass = isDark ? "block text-xs font-semibold text-slate-300 mb-1" : "block text-xs font-semibold text-gray-700 mb-1";
  const inputClass = isDark
    ? "w-full px-3.5 py-2 text-sm border border-slate-700 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    : "w-full px-3.5 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('guests.modalTitleEdit') : t('guests.modalTitleAdd')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium border border-red-500/30">
            {error}
          </div>
        )}

        <div>
          <label className={labelClass}>
            {t('guests.name')} *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jasur Aliyev"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {t('common.phone')}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('guests.passport')}
            </label>
            <input
              type="text"
              value={passport}
              onChange={(e) => setPassport(e.target.value.toUpperCase())}
              placeholder="AA 1234567"
              className={`${inputClass} uppercase font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            {t('common.address')}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Qarshi"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            {t('common.notes')}
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="..."
            className={`${inputClass} resize-none`}
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
            {t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
