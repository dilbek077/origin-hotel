import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <L.div className="hotel-workspace flex h-screen w-full overflow-hidden bg-background text-foreground">
      <L.div className="hotel-desktop-navigation"><Sidebar /></L.div>

      <L.div className="relative flex h-full min-h-0 flex-1 min-w-0 flex-col">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="hotel-mobile-menu" aria-label="Boshqaruv menyusi">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="hotel-workspace hotel-mobile-navigation" aria-describedby={undefined}>
            <SheetTitle className="sr-only"><LocalizedText>Boshqaruv menyusi</LocalizedText></SheetTitle>
            <L.div className="h-full min-h-0" onClick={(event) => {
              if ((event.target as HTMLElement).closest('a')) setMenuOpen(false);
            }}>
              <Sidebar />
            </L.div>
          </SheetContent>
        </Sheet>
        <Header />

        <L.main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20">
          <Outlet />
        </L.main>
      </L.div>
    </L.div>
  );
}
