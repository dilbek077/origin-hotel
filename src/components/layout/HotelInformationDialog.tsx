import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HOTEL_INFORMATION, type HotelInfoKey } from '@/data/hotelInformation';

type Props = {
  selection: { key: HotelInfoKey; triggerId: string };
  onClose: () => void;
};

export default function HotelInformationDialog({ selection, onClose }: Props) {
  const info = HOTEL_INFORMATION[selection.key];
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="hotel-information-dialog"
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const target = window.matchMedia('(max-width: 767px)').matches
            ? document.querySelector<HTMLElement>('.shilla-mobile-toggle')
            : document.getElementById(selection.triggerId);
          target?.focus({ preventScroll: true });
        }}
      >
        <DialogClose asChild><L.button type="button" className="hotel-information-close" aria-label="Ma’lumot oynasini yopish"><X size={20} /></L.button></DialogClose>
        <LocalizedText>{info.image && <L.img className="hotel-information-image" src={info.image} alt={info.imageAlt ?? 'Origin Hotel'} />}</LocalizedText>
        <DialogHeader>
          <DialogTitle className="hotel-information-title"><LocalizedText>{info.title}</LocalizedText></DialogTitle>
          <DialogDescription className="hotel-information-description"><LocalizedText>{info.description}</LocalizedText></DialogDescription>
        </DialogHeader>
        <L.ul className="hotel-information-list">{info.items.map((item) => <L.li key={item}>{item}</L.li>)}</L.ul>
        <L.div className="hotel-information-actions">
          <L.a href="tel:+998712002020">Qo‘ng‘iroq qilish</L.a>
          <L.a href="#contact" onClick={onClose}>Manzil va aloqa</L.a>
        </L.div>
      </DialogContent>
    </Dialog>
  );
}
