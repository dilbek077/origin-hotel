import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useTheme } from '@/theme';

export default function MainLayout() {
  const { isDark } = useTheme();

  return (
    <div
      className={
        isDark
          ? 'flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.18),_transparent_20%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] text-slate-100'
          : 'flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.18),_transparent_20%),linear-gradient(180deg,#edf7ff_0%,#e7f0ff_100%)] text-slate-900'
      }
    >
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className={isDark ? 'flex-1 overflow-y-auto bg-slate-950/40' : 'flex-1 overflow-y-auto bg-transparent'}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
