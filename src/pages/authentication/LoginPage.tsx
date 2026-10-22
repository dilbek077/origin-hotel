import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Hotel, KeyRound, MoonStar, Quote, Sparkles, SunMedium } from 'lucide-react';
import { LANGUAGES, useTranslation, type LanguageCode } from '@/i18n';
import { MOCK_USERS, authenticateMockUser, type MockUser } from '@/services/mockAuth';
import { useTheme } from '@/theme';

// Testimonial ma'lumotlari
const TESTIMONIALS = [
  {
    quote:
      "Seamless management experience! The system makes tracking rooms and guests so easy. I loved the instant reports and real-time updates.",
    name: "Jasur Aliyev",
    role: "Hotel Administrator, Tashkent",
    avatar: "JA",
  },
  {
    quote:
      "The best hotel management tool I've used. Booking tracking, finance reports — all in one place. Highly recommended for any hotel.",
    name: "Lola Karimova",
    role: "Hotel Manager, Samarkand",
    avatar: "LK",
  },
  {
    quote:
      "Fast, reliable and easy to use. Our reception team adapted within a day. Customer satisfaction has improved significantly.",
    name: "Sardor Toshmatov",
    role: "Reception Staff, Bukhara",
    avatar: "ST",
  },
];

// Shahar binolari SVG illustratsiyasi
function BuildingIllustration() {
  return (
    <svg
      viewBox="0 0 400 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm opacity-90"
    >
      {/* Chap kichik bino */}
      <rect x="10" y="80" width="50" height="140" rx="4" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1.5" />
      <rect x="20" y="95" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="38" y="95" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="20" y="117" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="38" y="117" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="20" y="139" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="38" y="139" width="10" height="14" rx="2" fill="#a7f3d0" />

      {/* Markaziy asosiy bino */}
      <rect x="140" y="20" width="90" height="200" rx="6" fill="#ecfdf5" stroke="#34d399" strokeWidth="2" />
      <rect x="155" y="38" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="182" y="38" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="155" y="70" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="182" y="70" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="155" y="102" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="182" y="102" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="155" y="134" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="182" y="134" width="16" height="20" rx="3" fill="#6ee7b7" />
      <rect x="168" y="168" width="36" height="52" rx="3" fill="#a7f3d0" />
      <rect x="148" y="10" width="74" height="16" rx="4" fill="#10b981" />
      <rect x="178" y="2" width="14" height="12" rx="2" fill="#059669" />

      {/* O'ng bino */}
      <rect x="248" y="55" width="70" height="165" rx="4" fill="#f0fdf4" stroke="#6ee7b7" strokeWidth="1.5" />
      <rect x="260" y="72" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="282" y="72" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="260" y="100" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="282" y="100" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="260" y="128" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="282" y="128" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="260" y="156" width="14" height="18" rx="2" fill="#a7f3d0" />
      <rect x="282" y="156" width="14" height="18" rx="2" fill="#a7f3d0" />

      {/* Kichik o'ng bino */}
      <rect x="330" y="100" width="55" height="120" rx="4" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1.5" />
      <rect x="342" y="115" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="360" y="115" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="342" y="137" width="10" height="14" rx="2" fill="#a7f3d0" />
      <rect x="360" y="137" width="10" height="14" rx="2" fill="#a7f3d0" />

      {/* Chap ikkinchi bino */}
      <rect x="65" y="50" width="68" height="170" rx="4" fill="#f0fdf4" stroke="#6ee7b7" strokeWidth="1.5" />
      <rect x="76" y="65" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="96" y="65" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="116" y="65" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="76" y="92" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="96" y="92" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="116" y="92" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="76" y="119" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="96" y="119" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="116" y="119" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="76" y="146" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="96" y="146" width="12" height="16" rx="2" fill="#a7f3d0" />
      <rect x="116" y="146" width="12" height="16" rx="2" fill="#a7f3d0" />

      {/* Yo'l */}
      <rect x="0" y="216" width="400" height="6" rx="2" fill="#6ee7b7" opacity="0.5" />

      {/* Daraxtlar */}
      <circle cx="30" cy="75" r="14" fill="#34d399" opacity="0.7" />
      <rect x="27" y="80" width="6" height="16" rx="2" fill="#059669" opacity="0.6" />
      <circle cx="375" cy="95" r="12" fill="#34d399" opacity="0.7" />
      <rect x="372" y="100" width="6" height="14" rx="2" fill="#059669" opacity="0.6" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testimonialIndex] = useState(() => Math.floor(Math.random() * TESTIMONIALS.length));
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const testimonial = TESTIMONIALS[testimonialIndex];

  const fillCredentials = (user: MockUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('login.empty'));
      return;
    }

    setLoading(true);
    try {
      const user = authenticateMockUser(username, password);

      if (!user) {
        setError(t('login.invalid'));
        return;
      }

      localStorage.setItem('token', 'mock-token-' + user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.name);

      setLoading(false);
      navigate(user.role === 'ADMIN' ? '/admin' : '/staff', { replace: true });
    } catch {
      setError('Tizimga kirishda xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDark
    ? 'bg-[#0f1b2d]/95 border-white/10'
    : 'bg-white/95 border-white shadow-blue-950/5';

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDark ? 'bg-[#0a1628]' : 'bg-[#f4f7f0]'
      }`}
    >
      {/* ─── Chap panel: testimonial + illustration ─────────────────────────── */}
      <div
        className={`hidden lg:flex lg:w-1/2 xl:w-[56%] relative flex-col justify-between overflow-hidden p-12 xl:p-16 ${
          isDark
            ? 'bg-gradient-to-br from-[#071322] via-[#0a2342] to-[#123d68]'
            : 'bg-gradient-to-br from-[#0a2342] via-[#123d68] to-[#1d5da8]'
        }`}
      >
        <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -left-28 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur">
            <Hotel className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xl font-bold tracking-wide text-white">Origin Hotel</span>
            <span className="text-xs tracking-[0.18em] text-blue-100/70">HOTEL MANAGEMENT</span>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 my-auto flex max-w-xl flex-col gap-6 py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sky-200">
            <Quote className="h-5 w-5" />
          </div>
          <p className="max-w-lg text-2xl font-medium leading-relaxed tracking-tight text-white xl:text-3xl">
            {testimonial.quote}
          </p>

          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-sm font-bold text-white shadow-md">
              {testimonial.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {testimonial.name}
              </p>
              <p className="mt-0.5 text-xs text-blue-100/70">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>

        {/* Bino illustratsiyasi */}
        <div className="relative z-10 mt-4 flex justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] pt-5 backdrop-blur-sm">
          <div className="absolute inset-x-10 bottom-0 h-20 rounded-full bg-sky-300/15 blur-2xl" />
          <div className="relative hue-rotate-[65deg] saturate-75">
            <BuildingIllustration />
          </div>
        </div>
      </div>

      {/* ─── O'ng panel: login form ──────────────────────────────────────────── */}
      <div
        className={`relative flex-1 flex items-center justify-center overflow-hidden px-6 py-12 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(45,127,232,0.14),transparent_34%),linear-gradient(145deg,#071322,#0a1628)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(91,182,255,0.18),transparent_34%),linear-gradient(145deg,#f7fbff,#edf5ff)]'
        }`}
      >
        <div className="relative z-10 w-full max-w-md">
          {/* Mobil logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Hotel className="h-5 w-5" />
            </div>
            <span
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-[#11263d]'
              }`}
            >
              Origin Hotel
            </span>
          </div>

          {/* Karta */}
          <div className={`relative overflow-hidden rounded-3xl border px-8 py-9 shadow-2xl shadow-slate-900/10 backdrop-blur-xl ${cardBg}`}>
            <div className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary via-sky-400 to-transparent" />
            {/* Sarlavha + theme/til tugmalar */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-[#11263d]'
                  }`}
                >
                  {t('login.welcome')}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? 'text-slate-400' : 'text-gray-500'
                  }`}
                >
                  {t('login.brandText')}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
                  className={`p-2 rounded-lg border ${
                    isDark
                      ? 'border-slate-700 bg-black text-white hover:bg-slate-900'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  } transition-all duration-300 active:scale-90`}
                  aria-label="Toggle theme"
                  aria-pressed={isDark}
                >
                  <span className="relative block h-[15px] w-[15px]">
                    <MoonStar
                      size={15}
                      className={`absolute inset-0 transition-all duration-500 motion-reduce:transition-none ${
                        isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                      }`}
                    />
                    <SunMedium
                      size={15}
                      className={`absolute inset-0 transition-all duration-500 motion-reduce:transition-none ${
                        isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                      }`}
                    />
                  </span>
                </button>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as LanguageCode)}
                  className={`rounded-lg border px-2 py-1.5 text-xs outline-none transition-colors ${
                    isDark
                      ? 'border-[#1e3a5f] bg-[#1a2d45] text-slate-300 focus:ring-1 focus:ring-green-500'
                      : 'border-gray-200 bg-gray-50 text-gray-700 focus:ring-1 focus:ring-primary'
                  }`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-[#11263d]'
                  }`}
                >
                  {t('login.username')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('login.demoHint')}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                      isDark
                        ? 'border-[#1e3a5f] bg-[#0a1628] text-white placeholder-slate-500'
                        : 'border-gray-200 bg-white text-[#11263d] placeholder-gray-400 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-[#11263d]'
                    }`}
                  >
                    {t('login.password')} <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#f97316] hover:underline font-medium"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                      isDark
                        ? 'border-[#1e3a5f] bg-[#0a1628] text-white placeholder-slate-500'
                        : 'border-gray-200 bg-white text-[#11263d] placeholder-gray-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? t('login.hidePassword') : t('login.showPassword')
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Xato */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                    {t('login.submit')}...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Demo foydalanuvchilar */}
            <div
              className={`mt-6 pt-5 border-t ${
                isDark ? 'border-[#1e3a5f]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-3 text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('login.demo')}</span>
              </div>
              <div className="space-y-2">
                {MOCK_USERS.map((user) => {
                  const isSelected = username === user.username;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => fillCredentials(user)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : isDark
                          ? 'border-[#1e3a5f] hover:border-primary/50 bg-[#0f1b2d] hover:bg-[#0f2234] text-slate-300'
                          : 'border-gray-100 hover:border-primary/30 bg-slate-50/80 hover:bg-primary/5 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm ${
                              isDark ? 'text-white' : 'text-[#11263d]'
                            }`}
                          >
                            {user.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                            }`}
                          >
                            {user.roleName}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] mt-1 flex items-center gap-2 ${
                            isDark ? 'text-slate-500' : 'text-gray-400'
                          }`}
                        >
                          <span>@{user.username}</span>
                          <span>•</span>
                          <span>
                            pass:{' '}
                            <strong
                              className={
                                isDark
                                  ? 'text-slate-300 font-mono'
                                  : 'text-gray-600 font-mono'
                              }
                            >
                              {user.password}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium text-[11px]">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Kirish</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p
            className={`text-center text-xs mt-5 ${
              isDark ? 'text-slate-600' : 'text-gray-400'
            }`}
          >
            © 2026 Origin Hotel Management System
          </p>
        </div>
      </div>
    </div>
  );
}
