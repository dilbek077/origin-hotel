import { useLocation } from 'react-router-dom';
import { Bell, MoonStar, SunMedium } from 'lucide-react';
import { LANGUAGES, useTranslation, type LanguageCode } from '@/i18n';
import { useTheme } from '@/theme';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'nav.dashboard',
  '/admin/xonalar': 'nav.rooms',
  '/admin/mehmonlar': 'nav.guests',
  '/admin/bronlar': 'nav.bookings',
  '/admin/moliya': 'nav.finance',
  '/admin/hisobotlar': 'nav.reports',
  '/admin/sozlamalar': 'nav.settings',
  '/staff': 'nav.dashboard',
  '/staff/xonalar': 'nav.rooms',
  '/staff/mehmonlar': 'nav.guests',
  '/staff/bronlar': 'nav.bookings',
};

export default function Header() {
  const { pathname } = useLocation();
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const username = localStorage.getItem('username') ?? t('common.user');
  const firstLetter = username.charAt(0).toUpperCase();

  const pageTitleKey =
    PAGE_TITLES[pathname] ??
    PAGE_TITLES[Object.keys(PAGE_TITLES).find((key) => pathname.startsWith(key)) ?? ''] ??
    'nav.home';

  return (
    <header
      className={
        isDark
          ? 'flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/80 shadow-[0_6px_20px_rgba(2,6,23,0.32)] transition-colors'
          : 'flex items-center justify-between px-6 py-3.5 bg-white/80 backdrop-blur-sm border-b border-sky-100 shadow-[0_6px_20px_rgba(16,42,77,0.06)] transition-colors'
      }
    >
      <h1 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-800'}>
        {t(pageTitleKey)}
      </h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className={
            isDark
              ? 'p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors cursor-pointer'
              : 'p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer'
          }
          aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
          title={isDark ? t('common.lightMode') : t('common.darkMode')}
        >
          {isDark ? <SunMedium size={20} /> : <MoonStar size={20} />}
        </button>

        <button
          className={
            isDark
              ? 'relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors cursor-pointer'
              : 'relative p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer'
          }
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <label className="sr-only" htmlFor="header-language">
          {t('common.language')}
        </label>
        <select
          id="header-language"
          value={locale}
          onChange={(event) => setLocale(event.target.value as LanguageCode)}
          className={
            isDark
              ? 'rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer'
              : 'rounded-lg border border-sky-100 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer'
          }
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code} className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>
              {language.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[linear-gradient(135deg,#2d7fe8,#5bb6ff)] text-white text-sm font-semibold select-none shadow-sm">
            {firstLetter}
          </div>
          <div className="flex flex-col leading-tight">
            <span className={isDark ? 'text-sm font-medium text-slate-100' : 'text-sm font-medium text-slate-800'}>{username}</span>
            <span className={isDark ? 'text-xs text-slate-400 capitalize' : 'text-xs text-slate-500 capitalize'}>
              {(localStorage.getItem('role') ?? 'Staff').toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
