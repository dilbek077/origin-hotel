import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Headset,
  Hotel,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Star,
  Sun,
  UserRound,
} from 'lucide-react';
import { LANGUAGES, useTranslation } from '@/i18n';
import { MOCK_USERS, authenticateMockUser, type MockUser } from '@/services/mockAuth';
import { useTheme } from '@/theme';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=85';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageMenuClosing, setLanguageMenuClosing] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuTimer = useRef<number | null>(null);
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const closeLanguageMenu = useCallback(() => {
    if (languageMenuTimer.current !== null) return;
    setLanguageMenuClosing(true);
    languageMenuTimer.current = window.setTimeout(() => {
      setLanguageMenuOpen(false);
      setLanguageMenuClosing(false);
      languageMenuTimer.current = null;
    }, 160);
  }, []);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) closeLanguageMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLanguageMenu();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen, closeLanguageMenu]);

  useEffect(() => () => {
    if (languageMenuTimer.current !== null) window.clearTimeout(languageMenuTimer.current);
  }, []);

  const fillCredentials = (user: MockUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

      localStorage.setItem('token', `mock-token-${user.id}`);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.name);
      navigate(user.role === 'ADMIN' ? '/admin' : '/staff', { replace: true });
    } catch {
      setError('Tizimga kirishda xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `h-12 w-full rounded-lg border pl-11 pr-4 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 ${
    isDark
      ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500'
      : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
  }`;

  return (
    <main className={`min-h-screen md:grid md:grid-cols-2 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <section className="relative flex min-h-[340px] flex-col justify-between overflow-hidden px-7 py-7 text-white sm:min-h-[400px] sm:px-12 sm:py-10 md:min-h-screen md:px-8 md:py-12 lg:px-14 xl:px-20">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2342] via-slate-900/40 to-slate-950/75" />

        <a href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#11263d]">
            <Hotel className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-tight">Origin Hotel</span>
            <span className="mt-1 block text-[9px] tracking-[0.24em] text-white/75">
              {t('landing.tagline').toLocaleUpperCase()}
            </span>
          </span>
        </a>

        <div className="relative z-10 my-10 max-w-lg md:my-0 md:py-12">
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
            {t('login.welcome')}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/85 sm:text-base">
            {t('login.subtitle')}
          </p>
        </div>

        <div className="relative z-10 grid max-w-xl grid-cols-3 divide-x divide-white/20">
          {[
            { icon: ShieldCheck, label: t('login.feature.security') },
            { icon: Headset, label: t('login.feature.support') },
            { icon: Star, label: t('login.feature.quality') },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col gap-2 px-3 first:pl-0 sm:px-5">
              <Icon className="h-5 w-5 text-white/90" strokeWidth={1.7} />
              <span className="text-xs leading-4 text-white/85">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`relative flex min-h-[620px] items-center justify-center px-5 py-14 sm:px-10 md:min-h-screen md:px-6 lg:px-12 ${isDark ? 'bg-slate-950' : 'bg-[#fbfcfe]'}`}>
        <div className="absolute right-6 top-6 flex items-center gap-2 sm:right-10 sm:top-8">
          <button
            type="button"
            onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={isDark ? 'Yorug‘ mavzu' : 'Qorong‘i mavzu'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div ref={languageMenuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                if (languageMenuOpen && !languageMenuClosing) {
                  closeLanguageMenu();
                  return;
                }
                if (languageMenuTimer.current !== null) {
                  window.clearTimeout(languageMenuTimer.current);
                  languageMenuTimer.current = null;
                }
                setLanguageMenuClosing(false);
                setLanguageMenuOpen(true);
              }}
              aria-label={t('common.language')}
              aria-haspopup="listbox"
              aria-expanded={languageMenuOpen && !languageMenuClosing}
              className={`flex h-9 items-center gap-2 rounded-lg border px-2.5 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{LANGUAGES.find((language) => language.code === locale)?.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${
                languageMenuOpen && !languageMenuClosing ? 'rotate-180' : ''
              }`} />
            </button>
            {languageMenuOpen && (
              <div
                role="listbox"
                aria-label={t('common.language')}
                data-state={languageMenuClosing ? 'closing' : 'open'}
                className={`language-menu absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border p-1 shadow-lg ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-100'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                {LANGUAGES.map((language) => {
                  const isSelected = language.code === locale;
                  return (
                    <button
                      key={language.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setLocale(language.code);
                        closeLanguageMenu();
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition ${
                        isSelected
                          ? isDark
                            ? 'bg-sky-500/15 font-medium text-sky-300'
                            : 'bg-blue-600 font-medium text-white'
                          : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {language.label}
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md pt-8">
          <div className={`rounded-2xl border p-6 shadow-[0_12px_40px_rgba(15,35,64,0.07)] sm:p-8 ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200/80 bg-white'
          }`}>
            <div className="mb-7">
              <h2 className={`font-serif text-2xl font-semibold sm:text-[28px] ${
                isDark ? 'text-white' : 'text-[#17283d]'
              }`}>
                {t('nav.login')}
              </h2>
              <p className={`mt-2 text-sm leading-5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {t('login.brandText')}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className={`mb-2 block text-xs font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {t('login.username')}
                </label>
                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={t('login.demoHint')}
                    aria-invalid={Boolean(error)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`mb-2 block text-xs font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {t('login.password')}
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    aria-invalid={Boolean(error)}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0c1d32] px-4 text-sm font-semibold text-white transition hover:bg-[#173657] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-700 dark:hover:bg-sky-600"
              >
                {loading ? `${t('login.submit')}...` : t('login.submit')}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <details className={`mt-6 border-t pt-4 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <summary className={`cursor-pointer list-none text-center text-xs ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}>
                {t('login.demo')}
              </summary>
              <div className="mt-3 space-y-2">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => fillCredentials(user)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition ${
                      isDark
                        ? 'border-slate-700 text-slate-200 hover:border-sky-700 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/60'
                    }`}
                  >
                    <span>
                      <span className="block font-medium">{user.name}</span>
                      <span className="mt-0.5 block text-slate-500">
                        @{user.username} · {user.roleName}
                      </span>
                    </span>
                    <span className="font-medium text-primary">{t('login.submit')}</span>
                  </button>
                ))}
              </div>
            </details>
          </div>

          <p className={`mt-6 text-center text-xs ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`}>
            © 2026 Origin Hotel
          </p>
        </div>
      </section>
    </main>
  );
}
