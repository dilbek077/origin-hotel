import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed-width sidebar */}
      <Sidebar />

      {/* Main area: header + page content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
