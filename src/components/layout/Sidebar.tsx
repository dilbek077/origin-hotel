import { NavLink, useNavigate } from 'react-router-dom';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useTranslation } from '@/i18n';

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { labelKey: 'nav.rooms', path: '/admin/xonalar', icon: <BedDouble size={18} /> },
  { labelKey: 'nav.guests', path: '/admin/mehmonlar', icon: <Users size={18} /> },
  { labelKey: 'nav.bookings', path: '/admin/bronlar', icon: <CalendarCheck size={18} /> },
  { labelKey: 'nav.finance', path: '/admin/moliya', icon: <Wallet size={18} /> },
  { labelKey: 'nav.reports', path: '/admin/hisobotlar', icon: <BarChart3 size={18} /> },
  { labelKey: 'nav.settings', path: '/admin/sozlamalar', icon: <Settings size={18} /> },
];

const staffNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/staff', icon: <LayoutDashboard size={18} /> },
  { labelKey: 'nav.rooms', path: '/staff/xonalar', icon: <BedDouble size={18} /> },
  { labelKey: 'nav.guests', path: '/staff/mehmonlar', icon: <Users size={18} /> },
  { labelKey: 'nav.bookings', path: '/staff/bronlar', icon: <CalendarCheck size={18} /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') ?? 'STAFF';
  const { t } = useTranslation();
  const navItems = role === 'ADMIN' ? adminNavItems : staffNavItems;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
        {navItems.map((item) => (
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
