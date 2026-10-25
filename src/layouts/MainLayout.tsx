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
          ? 'flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.18),_transparent_20%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] text-slate-100'
          : 'flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_20%),linear-gradient(180deg,#edf7ff_0%,#e0f2fe_100%)] text-slate-900'
      }
    >
      <Sidebar />

      <div className="flex h-full min-h-0 flex-1 min-w-0 flex-col">
        <Header />

        <main className={isDark ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-950/40' : 'min-h-0 flex-1 overflow-y-auto overscroll-contain bg-transparent'}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
