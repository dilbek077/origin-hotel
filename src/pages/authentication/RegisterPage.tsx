import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hotel,
  Lock,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { registerMockUser, storeUserSession } from '@/services/mockAuth';
import { BookingStateService } from '@/services/bookingState';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pendingBooking = BookingStateService.getPendingBooking();
  const fromBooking = Boolean(location.state?.fromBooking || pendingBooking);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = '+998 ';
    let raw = e.target.value;
    if (!raw.startsWith(prefix)) {
      raw = prefix;
    }
    const digits = raw.slice(prefix.length).replace(/\D/g, '').slice(0, 9);
    let formatted = prefix;
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!cleanFirst) {
      setError('Iltimos, ismingizni kiriting.');
      return;
    }

    if (!cleanLast) {
      setError('Iltimos, familiyangizni kiriting.');
      return;
    }

    if (phoneDigits.length < 9) {
      setError('Iltimos, telefon raqamingizni to‘liq kiriting (+998 XX XXX XX XX).');
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Kiritilgan parollar bir-biriga mos kelmadi.');
      return;
    }

    setLoading(true);

    try {
      const res = registerMockUser({
        firstName: cleanFirst,
        lastName: cleanLast,
        phone,
        password,
      });

      if (!res.success || !res.user) {
        setError(res.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
        setLoading(false);
        return;
      }

      // Tizimga sessiyani o'rnatish
      storeUserSession(res.user);

      // Agar booking jarayonidan kelgan bo'lsa, asosiy sahifadagi booking modaliga qaytarish
      if (fromBooking) {
        navigate('/', { replace: true, state: { resumeBooking: true } });
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      setError('Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-[#0a0a0a] dark:text-neutral-100 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-black/60 sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Asosiy sahifaga qaytish</span>
          </Link>

          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Hotel className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg tracking-normal">Origin Hotel</span>
          </Link>

          <Link
            to="/login"
            state={{ fromBooking }}
            className="text-xs font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-white sm:text-sm"
          >
            Tizimga kirish
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#121212] sm:p-8">
            <div className="mb-6">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                Ro‘yxatdan o‘tish
              </h1>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Origin Hotel orqali xonalarni qulay va tez bron qilish uchun yangi hisob yarating.
              </p>

              {fromBooking && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-neutral-100/70 p-3 text-xs text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900 dark:text-white" />
                  <span>
                    Tanlangan xonangiz saqlab qolindi. Ro‘yxatdan o‘tgach, darhol bron qilishni yakunlashingiz mumkin.
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Ism & Familiya (2 ustun) */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-first-name"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Ism *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="reg-first-name"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jasur"
                      className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-last-name"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Familiya *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="reg-last-name"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Aliyev"
                      className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Telefon raqami */}
              <div>
                <label
                  htmlFor="reg-phone"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Telefon raqami *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 text-sm font-medium tracking-wide text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    required
                  />
                </div>
              </div>

              {/* Parol */}
              <div>
                <label
                  htmlFor="reg-password"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Parol *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-10 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Parolni tasdiqlash */}
              <div>
                <label
                  htmlFor="reg-confirm-password"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Parolni tasdiqlash *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-10 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label={showConfirmPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Xatolik xabari */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-neutral-200 bg-neutral-100 p-3 text-xs text-red-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {loading ? 'Ro‘yxatdan o‘tkazilmoqda...' : 'Ro‘yxatdan o‘tish'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              Hisobingiz bormi?{' '}
              <Link
                to="/login"
                state={{ fromBooking }}
                className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-white"
              >
                Tizimga kirish
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-4 w-4" />
            <span>Origin Hotel shaxsiy ma’lumotlar xavfsizligini kafolatlaydi</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-400 dark:text-neutral-600">
        © 2026 Origin Hotel. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
}
