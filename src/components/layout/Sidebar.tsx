import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Wallet,
  BarChart3,
  Settings,
  ChevronDown,
  UserCog,
  User,
  Palette,
  Bell,
  Monitor,
  LogOut,
} from 'lucide-react';
import { useTranslation } from '@/i18n';

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ReactNode;
}

interface SettingsSubItem {
  id: string;
  labelKey: string;
  path: string;
  icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { labelKey: 'nav.rooms', path: '/admin/xonalar', icon: <BedDouble size={18} /> },
  { labelKey: 'nav.guests', path: '/admin/mehmonlar', icon: <Users size={18} /> },
  { labelKey: 'nav.bookings', path: '/admin/bronlar', icon: <CalendarCheck size={18} /> },
  { labelKey: 'nav.finance', path: '/admin/moliya', icon: <Wallet size={18} /> },
  { labelKey: 'nav.reports', path: '/admin/hisobotlar', icon: <BarChart3 size={18} /> },
];

const settingsSubItems: SettingsSubItem[] = [
  { id: 'profil', labelKey: 'nav.profile', path: '/admin/sozlamalar/profil', icon: UserCog },
  { id: 'hisob', labelKey: 'nav.account', path: '/admin/sozlamalar/hisob', icon: User },
  { id: 'korinish', labelKey: 'nav.appearance', path: '/admin/sozlamalar/korinish', icon: Palette },
  { id: 'bildirishnomalar', labelKey: 'nav.notifications', path: '/admin/sozlamalar/bildirishnomalar', icon: Bell },
  { id: 'ekran', labelKey: 'nav.display', path: '/admin/sozlamalar/ekran', icon: Monitor },
];

const staffNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/staff', icon: <LayoutDashboard size={18} /> },
  { labelKey: 'nav.rooms', path: '/staff/xonalar', icon: <BedDouble size={18} /> },
  { labelKey: 'nav.guests', path: '/staff/mehmonlar', icon: <Users size={18} /> },
  { labelKey: 'nav.bookings', path: '/staff/bronlar', icon: <CalendarCheck size={18} /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') ?? 'STAFF';
  const { t } = useTranslation();

  const isSettingsActive = location.pathname.startsWith('/admin/sozlamalar');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen((prev) => !prev);
    if (!isSettingsActive) {
      navigate('/admin/sozlamalar/profil');
    }
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[linear-gradient(180deg,#0a192f_0%,#0f2b48_50%,#0c2138_100%)] border-r border-sky-400/10 shadow-[0_12px_30px_rgba(15,35,64,0.25)] select-none">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-400/20 text-sky-200 ring-1 ring-white/20">
          <Hotel size={20} />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Origin Hotel</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Asosiy navigatsiya elementlari */}
        {(role === 'ADMIN' ? adminNavItems : staffNavItems).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/staff'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-sky-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-sky-100/80 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
          >
            {item.icon}
            {t(item.labelKey)}
          </NavLink>
        ))}

        {/* Tizim / Sozlamalar bloki */}
        {role === 'ADMIN' && (
          <div className="pt-4">
            <div className="px-3 pb-2">
              <span className="text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
                {t('nav.system')}
              </span>
            </div>

            {/* Sozlamalar collapsible button */}
            <button
              type="button"
              onClick={handleSettingsToggle}
              className={[
                'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer',
                isSettingsActive && !isSettingsOpen
                  ? 'bg-sky-400/20 text-sky-200 font-semibold'
                  : 'text-sky-100/80 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span>{t('nav.settings')}</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isSettingsOpen ? 'rotate-180' : 'rotate-0'
                } text-sky-200/60`}
              />
            </button>

            {/* Sub-items (Profil, Hisob, Ko'rinish, Bildirishnomalar, Ekran) */}
            {isSettingsOpen && (
              <div className="relative pl-3.5 ml-4.5 my-1 space-y-1 border-l border-white/15">
                {settingsSubItems.map((sub) => {
                  const isSubActive =
                    location.pathname === sub.path ||
                    (sub.id === 'profil' && location.pathname === '/admin/sozlamalar');

                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={[
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                        isSubActive
                          ? 'bg-white/15 text-white font-semibold shadow-xs'
                          : 'text-sky-100/70 hover:bg-white/5 hover:text-white font-medium',
                      ].join(' ')}
                    >
                      <sub.icon
                        size={17}
                        className={isSubActive ? 'text-white' : 'text-sky-200/70'}
                      />
                      <span>{t(sub.labelKey)}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/15 transition-colors duration-150 cursor-pointer"
        >
          <LogOut size={18} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
