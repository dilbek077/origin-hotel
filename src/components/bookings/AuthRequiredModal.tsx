import React, { useEffect } from 'react';
import { Lock, X, Calendar, BedDouble } from 'lucide-react';
import type { PendingBooking } from '@/services/bookingState';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  pendingBooking?: PendingBooking | null;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  pendingBooking,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 text-neutral-900 shadow-2xl transition-all dark:border-neutral-800 dark:bg-[#121212] dark:text-white sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          aria-label="Yopish"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Lock Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
            <Lock className="h-6 w-6 stroke-[1.8]" />
          </div>

          {/* Sarlavha */}
          <h3
            id="auth-modal-title"
            className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl"
          >
            Tizimga kirish talab qilinadi
          </h3>

          {/* Tavsif */}
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Bron qilishni davom ettirish uchun hisobingizga kiring yoki yangi hisob yarating.
          </p>

          {/* Tanlangan ma'lumotlar saqlanganligi haqida qisqa eslatma */}
          {pendingBooking && (
            <div className="mt-5 w-full rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5 text-left text-xs dark:border-neutral-800 dark:bg-neutral-900/60">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Tanlovingiz saqlab qolindi:
                </span>
                <span className="text-[11px] text-neutral-400">Avtomatik tiklanadi</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-neutral-800 dark:text-neutral-200">
                {pendingBooking.roomName && (
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <BedDouble className="h-3.5 w-3.5 text-neutral-400" />
                    {pendingBooking.roomName}
                  </span>
                )}
                {pendingBooking.checkIn && (
                  <span className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    {pendingBooking.checkIn} — {pendingBooking.checkOut}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex w-full flex-col gap-2.5">
            {/* Tizimga kirish tugmasi */}
            <button
              type="button"
              onClick={onLogin}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              Tizimga kirish
            </button>

            {/* Ro'yxatdan o'tish tugmasi */}
            <button
              type="button"
              onClick={onRegister}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 active:scale-[0.99] dark:border-neutral-700 dark:bg-transparent dark:text-white dark:hover:bg-neutral-800/80"
            >
              Ro‘yxatdan o‘tish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
