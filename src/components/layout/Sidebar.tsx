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

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard',   path: '/admin',              icon: <LayoutDashboard size={18} /> },
  { label: 'Xonalar',     path: '/admin/xonalar',      icon: <BedDouble size={18} /> },
  { label: 'Mehmonlar',   path: '/admin/mehmonlar',    icon: <Users size={18} /> },
  { label: 'Bronlar',     path: '/admin/bronlar',      icon: <CalendarCheck size={18} /> },
  { label: 'Moliya',      path: '/admin/moliya',       icon: <Wallet size={18} /> },
  { label: 'Hisobotlar',  path: '/admin/hisobotlar',   icon: <BarChart3 size={18} /> },
  { label: 'Sozlamalar',  path: '/admin/sozlamalar',   icon: <Settings size={18} /> },
];

const staffNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/staff',           icon: <LayoutDashboard size={18} /> },
  { label: 'Xonalar',   path: '/staff/xonalar',   icon: <BedDouble size={18} /> },
  { label: 'Mehmonlar', path: '/staff/mehmonlar', icon: <Users size={18} /> },
  { label: 'Bronlar',   path: '/staff/bronlar',   icon: <CalendarCheck size={18} /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') ?? 'STAFF';
  const navItems = role === 'ADMIN' ? adminNavItems : staffNavItems;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500 text-white">
          <Hotel size={20} />
        </div>
        <span className="text-lg font-bold text-gray-800 tracking-tight">Origin Hotel</span>
      </div>

      {/* Navigation */}
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
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600',
              ].join(' ')
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut size={18} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
