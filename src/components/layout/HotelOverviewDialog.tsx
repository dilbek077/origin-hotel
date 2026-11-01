import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
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
    ? <L.button type="button" aria-haspopup="dialog" onClick={() => onSelect(action)}>{text(action.label)}</L.button>
    : <L.a href={action.href} onClick={() => onSelect(action)}>{text(action.label)}</L.a>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="hotel-overview-panel"
        className="hotel-overview-dialog"
        showCloseButton={false}
        onCloseAutoFocus={(event) => { event.preventDefault(); onRestoreFocus(); }}
      >
        <DialogTitle className="sr-only"><LocalizedText>{text('Mehmonxona haqida')}</LocalizedText></DialogTitle>
        <DialogDescription className="sr-only"><LocalizedText>Origin Hotel · Toshkent</LocalizedText></DialogDescription>
        <Tabs defaultValue="brand" orientation="vertical" className="hotel-overview-tabs">
          <TabsList className="hotel-overview-tab-list" aria-label={text('Mehmonxona haqida')}>
            <TabsTrigger value="brand" className="hotel-overview-tab"><LocalizedText>{text('Brend')}</LocalizedText></TabsTrigger>
            <TabsTrigger value="region" className="hotel-overview-tab"><LocalizedText>{text('Hudud')}</LocalizedText></TabsTrigger>
          </TabsList>
          <TabsContent value="brand" className="hotel-overview-content">
            <LocalizedText>{BRAND_ROWS.map((row) => (
              <L.div className="hotel-overview-row" key={row.title}>
                <L.h3>{text(row.title)}</L.h3>
                <L.div className="hotel-overview-links">{row.links.map((action) => <L.span key={action.label}>{link(action)}</L.span>)}</L.div>
              </L.div>
            ))}</LocalizedText>
          </TabsContent>
          <TabsContent value="region" className="hotel-overview-content">
            <L.div className="hotel-overview-row">
              <L.h3>Toshkent</L.h3>
              <L.div className="hotel-overview-links">
                <L.span>{link({ label: 'Origin Hotel', href: '#contact' })}</L.span>
                <L.span>{link({ label: 'Manzil va xarita', href: '#contact' })}</L.span>
                <L.span>{link({ label: 'Yo‘l ma’lumotlari', href: '#transport-details', openDirections: true })}</L.span>
              </L.div>
            </L.div>
            <L.div className="hotel-overview-row">
              <L.h3>{text('Aloqa')}</L.h3>
              <L.div className="hotel-overview-links">
                <L.span>{link({ label: '+998 71 200 20 20', href: 'tel:+998712002020' })}</L.span>
                <L.span>{link({ label: 'Email yuborish', href: 'mailto:reservations@originhotel.uz' })}</L.span>
                <L.span>{link({ label: 'Qabulxona: 24/7', href: '#benefits', infoKey: 'reception' })}</L.span>
              </L.div>
            </L.div>
          </TabsContent>
        </Tabs>
        <DialogClose asChild><L.button type="button" className="hotel-overview-close" aria-label={text('Oynani yopish')}><X size={29} strokeWidth={1.2} /></L.button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
