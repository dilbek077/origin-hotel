import { NavLink } from 'react-router-dom';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Wallet,
  BarChart3,
  Settings,
  ArrowLeftRight,
} from 'lucide-react';
import { useTranslation } from '@/i18n';

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/admin', icon: <LayoutDashboard size={17} /> },
];

const hotelNavItems: NavItem[] = [
  { labelKey: 'nav.rooms', path: '/admin/xonalar', icon: <BedDouble size={17} /> },
  { labelKey: 'nav.guests', path: '/admin/mehmonlar', icon: <Users size={17} /> },
  { labelKey: 'nav.bookings', path: '/admin/bronlar', icon: <CalendarCheck size={17} /> },
  { labelKey: 'nav.checkInOut', path: '/admin/bronlar/kelish-ketish', icon: <ArrowLeftRight size={17} /> },
];

const financeNavItems: NavItem[] = [
  { labelKey: 'nav.finance', path: '/admin/moliya', icon: <Wallet size={17} /> },
  { labelKey: 'nav.reports', path: '/admin/hisobotlar', icon: <BarChart3 size={17} /> },
];

const staffNavItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/staff', icon: <LayoutDashboard size={17} /> },
  { labelKey: 'nav.rooms', path: '/staff/xonalar', icon: <BedDouble size={17} /> },
  { labelKey: 'nav.guests', path: '/staff/mehmonlar', icon: <Users size={17} /> },
  { labelKey: 'nav.bookings', path: '/staff/bronlar', icon: <CalendarCheck size={17} /> },
  { labelKey: 'nav.checkInOut', path: '/staff/bronlar/kelish-ketish', icon: <ArrowLeftRight size={17} /> },
];

export default function Sidebar() {
  const role = localStorage.getItem('role') ?? 'STAFF';
  const { t } = useTranslation();
  const isAdmin = role === 'ADMIN';

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 py-1">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {title}
        </span>
      </div>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={
            item.path === '/admin' ||
            item.path === '/staff' ||
            item.labelKey === 'nav.bookings'
          }
          className={({ isActive }) =>
            [
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors',
              isActive
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')
          }
        >
          {item.icon}
          <span className="truncate">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside className="flex h-full min-h-0 w-60 shrink-0 flex-col border-r border-border bg-card text-card-foreground select-none transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground text-background shrink-0">
            <Hotel size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold tracking-tight text-foreground block truncate">
              Origin Hotel
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              Admin & PMS
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {isAdmin ? (
          <>
            {renderNavGroup('Asosiy', mainNavItems)}
            {renderNavGroup('Mehmonxona', hotelNavItems)}
            {renderNavGroup('Moliya & Tahlil', financeNavItems)}

            {/* System / Settings */}
            <div className="space-y-1 pt-1">
              <div className="px-3 py-1">
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {t('nav.system')}
                </span>
              </div>
              <NavLink
                to="/admin/sozlamalar"
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ].join(' ')
                }
              >
                <Settings size={17} />
                <span>{t('nav.settings')}</span>
              </NavLink>
            </div>
          </>
        ) : (
          renderNavGroup('Xodimlar paneli', staffNavItems)
        )}
      </div>
    </aside>
  );
}
