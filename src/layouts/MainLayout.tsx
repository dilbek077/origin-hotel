import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="hotel-workspace flex h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="hotel-desktop-navigation"><Sidebar /></div>

      <div className="relative flex h-full min-h-0 flex-1 min-w-0 flex-col">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="hotel-mobile-menu" aria-label="Boshqaruv menyusi">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="hotel-workspace hotel-mobile-navigation" aria-describedby={undefined}>
            <SheetTitle className="sr-only">Boshqaruv menyusi</SheetTitle>
            <div className="h-full min-h-0" onClick={(event) => {
              if ((event.target as HTMLElement).closest('a')) setMenuOpen(false);
            }}>
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
