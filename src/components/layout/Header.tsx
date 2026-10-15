import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin':                 'Dashboard',
  '/admin/xonalar':         'Xonalar',
  '/admin/mehmonlar':       'Mehmonlar',
  '/admin/bronlar':         'Bronlar',
  '/admin/moliya':          'Moliya',
  '/admin/hisobotlar':      'Hisobotlar',
  '/admin/sozlamalar':      'Sozlamalar',
  '/staff':                 'Dashboard',
  '/staff/xonalar':         'Xonalar',
  '/staff/mehmonlar':       'Mehmonlar',
  '/staff/bronlar':         'Bronlar',
};

export default function Header() {
  const { pathname } = useLocation();
  const username = localStorage.getItem('username') ?? 'Foydalanuvchi';
  const firstLetter = username.charAt(0).toUpperCase();

  // Match the most specific path first
  const pageTitle =
    PAGE_TITLES[pathname] ??
    PAGE_TITLES[Object.keys(PAGE_TITLES).find((key) => pathname.startsWith(key)) ?? ''] ??
    'Origin Hotel';

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm">
      {/* Page title */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white text-sm font-semibold select-none">
            {firstLetter}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">{username}</span>
            <span className="text-xs text-gray-400 capitalize">
              {(localStorage.getItem('role') ?? 'Staff').toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
