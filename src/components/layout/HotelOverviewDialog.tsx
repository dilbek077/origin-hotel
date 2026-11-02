import { X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n';
import { hotelNavigationText } from '@/data/hotelNavigationTranslations';
import type { HotelInfoKey } from '@/data/hotelInformation';

export type HotelOverviewAction = {
  label: string;
  href: string;
  roomType?: string;
  infoKey?: HotelInfoKey;
  experienceSlide?: number;
  openDirections?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (action: HotelOverviewAction) => void;
  onRestoreFocus: () => void;
};

const BRAND_ROWS: { title: string; links: HotelOverviewAction[] }[] = [
  { title: 'Origin Hotel', links: [
    { label: 'Biz haqimizda', href: '#benefits' },
    { label: 'Joylashuv', href: '#contact' },
    { label: 'Galereya', href: '#experiences', experienceSlide: 0 },
  ] },
  { title: 'Xonalar', links: ['Standart', 'Deluxe', 'Suite', 'Presidential'].map((roomType) => ({ label: roomType, href: '#rooms', roomType })) },
  { title: 'Mehmonxona xizmatlari', links: [
    { label: 'Restoran', href: '#dining' },
    { label: 'Basseyn', href: '#benefits', infoKey: 'pool' },
    { label: 'SPA', href: '#benefits', infoKey: 'spa' },
    { label: 'Fitnes zali', href: '#benefits', infoKey: 'fitness' },
    { label: 'Bepul Wi-Fi', href: '#benefits', infoKey: 'wifi' },
    { label: 'Bepul parking', href: '#benefits', infoKey: 'parking' },
    { label: 'Aeroport transferi', href: '#benefits', infoKey: 'transfer' },
    { label: 'Qabulxona: 24/7', href: '#benefits', infoKey: 'reception' },
  ] },
];

export default function HotelOverviewDialog({ open, onOpenChange, onSelect, onRestoreFocus }: Props) {
  const { locale } = useTranslation();
  const text = (caption: string) => hotelNavigationText(caption, locale);
  const link = (action: HotelOverviewAction) => action.infoKey || action.roomType
    ? <button type="button" aria-haspopup="dialog" onClick={() => onSelect(action)}>{text(action.label)}</button>
    : <a href={action.href} onClick={() => onSelect(action)}>{text(action.label)}</a>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="hotel-overview-panel"
        className="hotel-overview-dialog"
        showCloseButton={false}
        onCloseAutoFocus={(event) => { event.preventDefault(); onRestoreFocus(); }}
      >
        <DialogTitle className="sr-only">{text('Mehmonxona haqida')}</DialogTitle>
        <DialogDescription className="sr-only">Origin Hotel · Toshkent</DialogDescription>
        <Tabs defaultValue="brand" orientation="vertical" className="hotel-overview-tabs">
          <TabsList className="hotel-overview-tab-list" aria-label={text('Mehmonxona haqida')}>
            <TabsTrigger value="brand" className="hotel-overview-tab">{text('Brend')}</TabsTrigger>
            <TabsTrigger value="region" className="hotel-overview-tab">{text('Hudud')}</TabsTrigger>
          </TabsList>
          <TabsContent value="brand" className="hotel-overview-content">
            {BRAND_ROWS.map((row) => (
              <div className="hotel-overview-row" key={row.title}>
                <h3>{text(row.title)}</h3>
                <div className="hotel-overview-links">{row.links.map((action) => <span key={action.label}>{link(action)}</span>)}</div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="region" className="hotel-overview-content">
            <div className="hotel-overview-row">
              <h3>Toshkent</h3>
              <div className="hotel-overview-links">
                <span>{link({ label: 'Origin Hotel', href: '#contact' })}</span>
                <span>{link({ label: 'Manzil va xarita', href: '#contact' })}</span>
                <span>{link({ label: 'Yo‘l ma’lumotlari', href: '#transport-details', openDirections: true })}</span>
              </div>
            </div>
            <div className="hotel-overview-row">
              <h3>{text('Aloqa')}</h3>
              <div className="hotel-overview-links">
                <span>{link({ label: '+998 71 200 20 20', href: 'tel:+998712002020' })}</span>
                <span>{link({ label: 'Email yuborish', href: 'mailto:reservations@originhotel.uz' })}</span>
                <span>{link({ label: 'Qabulxona: 24/7', href: '#benefits', infoKey: 'reception' })}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogClose asChild><button type="button" className="hotel-overview-close" aria-label={text('Oynani yopish')}><X size={29} strokeWidth={1.2} /></button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
