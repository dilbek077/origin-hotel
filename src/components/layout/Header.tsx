import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronDown, ChevronRight, Home, Sun, Moon, Globe, LogOut, UserRound, Menu } from 'lucide-react';
import { useTranslation, LANGUAGES } from '@/i18n';
import { useTheme } from '@/theme';
import {
  HOTEL_NOTIFICATIONS_CHANGED,
  markHotelNotificationsRead,
  readHotelNotifications,
  type HotelNotification,
} from '@/services/notificationSettings';
import { PROFILE_SETTINGS_CHANGED } from '@/services/profileSettings';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'nav.dashboard',
  '/admin/xonalar': 'nav.rooms',
  '/admin/mehmonlar': 'nav.guests',
  '/admin/bronlar': 'nav.bookings',
  '/admin/bronlar/kelish-ketish': 'nav.checkInOut',
  '/admin/moliya': 'nav.finance',
  '/admin/hisobotlar': 'nav.reports',
  '/admin/profil': 'nav.profile',
  '/admin/sozlamalar': 'nav.settings',
  '/admin/sozlamalar/profil': 'nav.profile',
  '/admin/sozlamalar/bildirishnomalar': 'nav.notifications',
  '/staff': 'nav.dashboard',
  '/staff/profil': 'nav.profile',
  '/staff/xonalar': 'nav.rooms',
  '/staff/mehmonlar': 'nav.guests',
  '/staff/bronlar': 'nav.bookings',
  '/staff/bronlar/kelish-ketish': 'nav.checkInOut',
};

interface HeaderProps {
  onOpenMenu: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState(() => localStorage.getItem('username') ?? t('common.user'));
  const firstLetter = username.charAt(0).toUpperCase();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageMenuClosing, setLanguageMenuClosing] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuTimer = useRef<number | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsClosing, setNotificationsClosing] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsTimer = useRef<number | null>(null);
  const [hotelNotifications, setHotelNotifications] = useState<HotelNotification[]>(readHotelNotifications);
  const profilePath = (localStorage.getItem('role') ?? 'STAFF') === 'ADMIN'
    ? '/admin/profil'
    : '/staff/profil';

  useEffect(() => {
    const refreshUsername = () => setUsername(localStorage.getItem('username') ?? t('common.user'));
    window.addEventListener(PROFILE_SETTINGS_CHANGED, refreshUsername);
    return () => window.removeEventListener(PROFILE_SETTINGS_CHANGED, refreshUsername);
  }, [t]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

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
    markHotelNotificationsRead();
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
    const refreshHotelNotifications = () => setHotelNotifications(readHotelNotifications());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'origin_hotel_notifications') refreshHotelNotifications();
    };
    window.addEventListener(HOTEL_NOTIFICATIONS_CHANGED, refreshHotelNotifications);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(HOTEL_NOTIFICATIONS_CHANGED, refreshHotelNotifications);
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
  const unreadNotifications = hotelNotifications.filter((item) => !item.read).length;

  const handleLogout = () => {
    ['token', 'role', 'username'].forEach((key) => localStorage.removeItem(key));
    navigate('/login', { replace: true });
  };

  return (
    <header className="relative z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-3 bg-card border-b border-border transition-colors sm:px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Menyuni ochish"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-foreground transition hover:bg-muted md:hidden"
        >
          <Menu size={18} />
        </button>
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
      </div>

      {/* Header controls */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
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
          className="relative flex items-center"
        >
          <button
            type="button"
            onClick={() => {
              if (notificationsOpen && !notificationsClosing) {
                closeNotifications();
              } else {
                openNotifications();
              }
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label={t('nav.notifications')}
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen && !notificationsClosing}
            aria-controls="header-notifications"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div
              className="absolute right-0 top-full z-50 pt-2"
            >
              <div
                id="header-notifications"
                role="dialog"
                aria-label={t('nav.notifications')}
                data-state={notificationsClosing ? 'closing' : 'open'}
                className="notification-menu w-[360px] max-w-[calc(100vw-32px)] rounded-xl border border-border bg-popover p-4 shadow-lg text-popover-foreground"
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">{t('nav.notifications')}</h2>
                </div>
                {hotelNotifications.length > 0 ? (
                  <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                    {hotelNotifications.map((item) => (
                      <li key={item.id} className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-semibold text-foreground">{item.title}</p>
                          <time className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                    Hozircha yangi bildirishnoma yo‘q
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div ref={profileMenuRef} className="relative border-l border-slate-200 pl-2 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            className="flex items-center gap-2.5 rounded-md text-left outline-none transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0284c7,#38bdf8)] text-sm font-semibold text-white shadow-sm">
              {firstLetter}
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-semibold text-foreground">{username}</span>
              <span className="text-[11px] text-muted-foreground capitalize">
                {(localStorage.getItem('role') ?? 'Staff').toLowerCase()}
              </span>
            </div>
          </button>
          {profileMenuOpen && (
            <div
              role="menu"
              aria-label="Profil menyusi"
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
            >
              <Link
                to={profilePath}
                role="menuitem"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <UserRound size={15} />
                <span>{t('nav.profile')}</span>
              </Link>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md bg-red-500/10 px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/15 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
              >
                <LogOut size={15} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
