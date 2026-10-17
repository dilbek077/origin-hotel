import { useLocation } from 'react-router-dom';
import { Bell, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation, LANGUAGES, type LanguageCode } from '@/i18n';
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

      <div className="flex items-center gap-3">
        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={
            isDark
              ? 'p-2 rounded-xl text-amber-400 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 border border-slate-700 transition cursor-pointer'
              : 'p-2 rounded-xl text-slate-600 bg-sky-50 hover:bg-sky-100 hover:text-slate-800 border border-sky-100 transition cursor-pointer'
          }
          title={isDark ? t('common.lightMode') : t('common.darkMode')}
          aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick Language Selector */}
        <div className="relative flex items-center">
          <Globe size={14} className={isDark ? 'absolute left-2.5 text-slate-400 pointer-events-none' : 'absolute left-2.5 text-slate-500 pointer-events-none'} />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as LanguageCode)}
            className={
              isDark
                ? 'pl-7 pr-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                : 'pl-7 pr-2.5 py-1.5 text-xs font-semibold rounded-xl border border-sky-100 bg-sky-50/70 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
            }
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>
                {lang.code.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <button
          className={
            isDark
              ? 'relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors cursor-pointer border border-transparent hover:border-slate-700'
              : 'relative p-2 rounded-xl text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer border border-transparent hover:border-sky-100'
          }
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[linear-gradient(135deg,#2d7fe8,#5bb6ff)] text-white text-sm font-semibold select-none shadow-sm">
            {firstLetter}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
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
