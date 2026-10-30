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
  Bell,
  LogOut,
  ArrowLeftRight,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Badge } from '@/components/ui/badge';

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

const settingsSubItems: SettingsSubItem[] = [
  { id: 'profil', labelKey: 'nav.profile', path: '/admin/sozlamalar/profil', icon: UserCog },
  { id: 'bildirishnomalar', labelKey: 'nav.notifications', path: '/admin/sozlamalar/bildirishnomalar', icon: Bell },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') ?? 'STAFF';
  const { t } = useTranslation();
  const isAdmin = role === 'ADMIN';

  const isSettingsActive = location.pathname.startsWith('/admin/sozlamalar');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen((prev) => !prev);
    if (!isSettingsActive) {
      navigate('/admin/sozlamalar/profil');
    }
  };

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
        <Badge variant="outline" className="text-[9px] uppercase font-semibold h-4.5 px-1.5 shrink-0">
          {role}
        </Badge>
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
              <button
                type="button"
                onClick={handleSettingsToggle}
                className={[
                  'flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  isSettingsActive && !isSettingsOpen
                    ? 'bg-muted text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <Settings size={17} />
                  <span>{t('nav.settings')}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isSettingsOpen ? 'rotate-180' : 'rotate-0'
                  } text-muted-foreground`}
                />
              </button>

              {isSettingsOpen && (
                <div className="relative pl-2.5 ml-3.5 my-1 space-y-1 border-l border-border">
                  {settingsSubItems.map((sub) => {
                    const isSubActive =
                      location.pathname === sub.path ||
                      (sub.id === 'profil' && location.pathname === '/admin/sozlamalar');

                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        className={[
                          'flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs transition-colors',
                          isSubActive
                            ? 'bg-muted font-semibold text-foreground'
                            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                        ].join(' ')}
                      >
                        <sub.icon size={14} />
                        <span>{t(sub.labelKey)}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          renderNavGroup('Xodimlar paneli', staffNavItems)
        )}
      </div>

      {/* Footer Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
