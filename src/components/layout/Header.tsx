import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronDown, ChevronRight, Home, Sun, Moon, Globe, Search } from 'lucide-react';
import { useTranslation, LANGUAGES } from '@/i18n';
import { useTheme } from '@/theme';
import { NOTIFICATION_SETTINGS_CHANGED, readNotificationSettings } from '@/services/notificationSettings';

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
  const navigate = useNavigate();
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const username = localStorage.getItem('username') ?? t('common.user');
  const firstLetter = username.charAt(0).toUpperCase();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageMenuClosing, setLanguageMenuClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuTimer = useRef<number | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsClosing, setNotificationsClosing] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsTimer = useRef<number | null>(null);
  const [notificationSettings, setNotificationSettings] = useState(readNotificationSettings);

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
    if (notificationsTimer.current !== null) window.clearTimeout(notificationsTimer.current);
  }, []);

  const closeNotifications = useCallback(() => {
    if (notificationsTimer.current !== null || !notificationsOpen) return;
    setNotificationsClosing(true);
    notificationsTimer.current = window.setTimeout(() => {
      setNotificationsOpen(false);
      setNotificationsClosing(false);
      notificationsTimer.current = null;
    }, 140);
  }, [notificationsOpen]);

  const openNotifications = () => {
    if (notificationsTimer.current !== null) {
      window.clearTimeout(notificationsTimer.current);
      notificationsTimer.current = null;
    }
    setNotificationsClosing(false);
    setNotificationsOpen(true);
  };

  useEffect(() => {
    if (!notificationsOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) closeNotifications();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNotifications();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen, closeNotifications]);

  useEffect(() => {
    const refreshNotificationSettings = () => setNotificationSettings(readNotificationSettings());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'origin_notifications') refreshNotificationSettings();
    };
    window.addEventListener(NOTIFICATION_SETTINGS_CHANGED, refreshNotificationSettings);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(NOTIFICATION_SETTINGS_CHANGED, refreshNotificationSettings);
      window.removeEventListener('storage', handleStorage);
    };
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
  const enabledNotifications = [
    notificationSettings.newBooking && 'notifications.newBooking',
    notificationSettings.bookingCancel && 'notifications.bookingCancel',
    notificationSettings.checkInOut && 'notifications.checkInOut',
    notificationSettings.roomStatus && 'notifications.roomStatus',
    notificationSettings.financeAlert && 'notifications.financeAlert',
  ].filter((key): key is string => Boolean(key));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`${dashboardPath}/bronlar`);
  };

  return (
    <header className="flex h-16 items-center justify-between px-6 bg-card border-b border-border transition-colors">
      {/* Left: Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-2 text-sm">
          {isDashboard ? (
            <li aria-current="page" className="flex items-center gap-2 font-medium text-foreground">
              <Home size={15} className="text-muted-foreground" />
              <span>{t(pageTitleKey)}</span>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to={dashboardPath}
                  aria-label={t('nav.dashboard')}
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
                    <ChevronRight size={14} className="shrink-0 text-muted-foreground/60" />
                    {isLast ? (
                      <span aria-current="page" className="truncate font-semibold text-foreground">
                        {t(labelKey)}
                      </span>
                    ) : (
                      <Link
                        to={href}
                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
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

      {/* Center/Right: Search and Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar - Shadcn Zinc Style */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Qidiruv... (xona, mehmon)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 w-48 lg:w-64 rounded-md border border-border bg-muted/40 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all focus:w-72"
          />
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-4.5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </form>

        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
          className="p-2 rounded-md text-foreground bg-muted/50 hover:bg-muted border border-border transition-all active:scale-95 cursor-pointer"
          title={isDark ? t('common.lightMode') : t('common.darkMode')}
          aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
          aria-pressed={isDark}
        >
          <span className="relative block h-4 w-4">
            <Moon
              size={16}
              className={`absolute inset-0 transition-all duration-300 ${
                isDark ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <Sun
              size={16}
              className={`absolute inset-0 transition-all duration-300 ${
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
            className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none transition hover:bg-muted"
          >
            <Globe size={14} className="text-muted-foreground" />
            <span>{locale.toUpperCase()}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${languageMenuOpen && !languageMenuClosing ? 'rotate-180' : ''}`} />
          </button>
          {languageMenuOpen && (
            <div
              role="listbox"
              aria-label={t('nav.language')}
              data-state={languageMenuClosing ? 'closing' : 'open'}
              className="language-menu absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground"
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
                    className={`flex w-full items-center justify-between rounded-sm px-2.5 py-2 text-left text-xs transition ${
                      isSelected
                        ? 'bg-accent font-semibold text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div
          ref={notificationsRef}
          className="relative"
          onMouseEnter={openNotifications}
          onMouseLeave={closeNotifications}
        >
          <button
            type="button"
            onClick={() => notificationsOpen && !notificationsClosing ? closeNotifications() : openNotifications()}
            onFocus={openNotifications}
            className={
              isDark
                ? 'relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors cursor-pointer border border-transparent hover:border-slate-700'
                : 'relative p-2 rounded-xl text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer border border-transparent hover:border-sky-100'
            }
            aria-label={t('nav.notifications')}
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen && !notificationsClosing}
            aria-controls="header-notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {notificationsOpen && (
            <div
              className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2"
            >
              <div
                id="header-notifications"
                role="dialog"
                aria-label={t('nav.notifications')}
                data-state={notificationsClosing ? 'closing' : 'open'}
                className={`notification-menu rounded-2xl border p-4 shadow-xl ${
                  isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-sky-100 bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} className={isDark ? 'text-sky-400' : 'text-blue-600'} />
                  <h2 className="text-sm font-semibold">{t('nav.notifications')}</h2>
                </div>
                <p className={isDark ? 'mt-2 text-xs leading-relaxed text-slate-400' : 'mt-2 text-xs leading-relaxed text-slate-500'}>
                  {enabledNotifications.length > 0
                    ? t('notifications.enabledDescription')
                    : t('notifications.noneEnabled')}
                </p>
                {enabledNotifications.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {enabledNotifications.map((key) => (
                      <li key={key} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                        isDark ? 'bg-slate-800/70 text-slate-300' : 'bg-sky-50 text-slate-700'
                      }`}>
                        <Check size={14} className="shrink-0 text-emerald-500" />
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[linear-gradient(135deg,#0284c7,#38bdf8)] text-white text-sm font-semibold select-none shadow-sm">
            {firstLetter}
          </div>
          <div className="hidden sm:flex flex-col leading-tight text-left">
            <span className="text-xs font-semibold text-foreground">{username}</span>
            <span className="text-[11px] text-muted-foreground capitalize">
              {(localStorage.getItem('role') ?? 'Staff').toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
