import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex h-full min-h-0 flex-1 min-w-0 flex-col">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
