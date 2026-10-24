import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Check, ChevronDown, ChevronRight, Home, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation, LANGUAGES } from '@/i18n';
import { useTheme } from '@/theme';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'nav.dashboard',
  '/admin/xonalar': 'nav.rooms',
  '/admin/mehmonlar': 'nav.guests',
  '/admin/bronlar': 'nav.bookings',
  '/admin/bronlar/kelish-ketish': 'nav.checkInOut',
  '/admin/moliya': 'nav.finance',
  '/admin/hisobotlar': 'nav.reports',
  '/admin/sozlamalar': 'nav.settings',
  '/admin/sozlamalar/profil': 'nav.profile',
  '/admin/sozlamalar/bildirishnomalar': 'nav.notifications',
  '/staff': 'nav.dashboard',
  '/staff/xonalar': 'nav.rooms',
  '/staff/mehmonlar': 'nav.guests',
  '/staff/bronlar': 'nav.bookings',
  '/staff/bronlar/kelish-ketish': 'nav.checkInOut',
};

export default function Header() {
  const { pathname } = useLocation();
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const username = localStorage.getItem('username') ?? t('common.user');
  const firstLetter = username.charAt(0).toUpperCase();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageMenuClosing, setLanguageMenuClosing] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuTimer = useRef<number | null>(null);

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

  const pageTitleKey =
    PAGE_TITLES[pathname] ??
    PAGE_TITLES[
      Object.keys(PAGE_TITLES)
        .filter((key) => pathname.startsWith(`${key}/`))
        .sort((a, b) => b.length - a.length)[0] ?? ''
    ] ??
    'nav.home';
  const dashboardPath = pathname.startsWith('/staff') ? '/staff' : '/admin';
  const isDashboard = pathname === dashboardPath;
  const breadcrumbLabels =
    dashboardPath === '/admin' && pathname.startsWith('/admin/sozlamalar/')
      ? ['nav.settings', pageTitleKey]
      : [pageTitleKey];

  return (
    <header
      className={
        isDark
          ? 'flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/80 shadow-[0_6px_20px_rgba(2,6,23,0.32)] transition-colors'
          : 'flex items-center justify-between px-6 py-3.5 bg-white/80 backdrop-blur-sm border-b border-sky-100 shadow-[0_6px_20px_rgba(16,42,77,0.06)] transition-colors'
      }
    >
      <nav aria-label="Breadcrumb">
        <ol className="flex min-w-0 items-center gap-2 text-sm">
          {isDashboard ? (
            <li
              aria-current="page"
              className={isDark ? 'flex items-center gap-2 font-semibold text-slate-100' : 'flex items-center gap-2 font-semibold text-slate-800'}
            >
              <Home size={16} className="text-primary" />
              <span>{t(pageTitleKey)}</span>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to={dashboardPath}
                  aria-label={t('nav.dashboard')}
                  className={isDark ? 'flex items-center gap-1.5 text-slate-400 transition-colors hover:text-slate-100' : 'flex items-center gap-1.5 text-slate-500 transition-colors hover:text-slate-900'}
                >
                  <Home size={15} />
                  <span>{t('nav.dashboard')}</span>
                </Link>
              </li>
              {breadcrumbLabels.map((labelKey, index) => {
                const isLast = index === breadcrumbLabels.length - 1;
                const href =
                  labelKey === 'nav.settings'
                    ? '/admin/sozlamalar'
                    : pathname;

                return (
                  <li key={`${labelKey}-${index}`} className="flex min-w-0 items-center gap-2">
                    <ChevronRight size={15} className="shrink-0 text-muted-foreground/60" />
                    {isLast ? (
                      <span
                        aria-current="page"
                        className={isDark ? 'truncate font-semibold text-slate-100' : 'truncate font-semibold text-slate-800'}
                      >
                        {t(labelKey)}
                      </span>
                    ) : (
                      <Link
                        to={href}
                        className={isDark ? 'truncate text-slate-400 transition-colors hover:text-slate-100' : 'truncate text-slate-500 transition-colors hover:text-slate-900'}
                      >
                        {t(labelKey)}
                      </Link>
                    )}
                  </li>
                );
              })}
            </>
          )}
        </ol>
      </nav>

      <div className="flex items-center gap-3">
        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
          className={
            isDark
              ? 'p-2 rounded-xl text-white bg-black hover:bg-slate-900 border border-slate-700 transition-all duration-300 active:scale-90 cursor-pointer'
              : 'p-2 rounded-xl text-slate-600 bg-sky-50 hover:bg-sky-100 hover:text-slate-800 border border-sky-100 transition-all duration-300 active:scale-90 cursor-pointer'
          }
          title={isDark ? t('common.lightMode') : t('common.darkMode')}
          aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
          aria-pressed={isDark}
        >
          <span className="relative block h-[18px] w-[18px]">
            <Moon
              size={18}
              className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                isDark ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <Sun
              size={18}
              className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
              }`}
            />
          </span>
        </button>

        {/* Quick Language Selector */}
        <div ref={languageMenuRef} className="relative flex items-center">
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
            aria-label={t('nav.language')}
            aria-haspopup="listbox"
            aria-expanded={languageMenuOpen && !languageMenuClosing}
            className={
              isDark
                ? 'flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white outline-none transition hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500'
                : 'flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50/70 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-blue-500'
            }
          >
            <Globe size={14} className={isDark ? 'text-sky-400' : 'text-blue-600'} />
            <span>{locale.toUpperCase()}</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${languageMenuOpen && !languageMenuClosing ? 'rotate-180' : ''}`} />
          </button>
          {languageMenuOpen && (
            <div
              role="listbox"
              aria-label={t('nav.language')}
              data-state={languageMenuClosing ? 'closing' : 'open'}
              className={`language-menu absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border p-1.5 shadow-xl ${
                isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-sky-100 bg-white text-slate-800'
              }`}
            >
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === locale;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLocale(lang.code);
                      closeLanguageMenu();
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? isDark
                          ? 'bg-blue-500/15 font-semibold text-sky-300'
                          : 'bg-blue-50 font-semibold text-blue-700'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          )}
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
