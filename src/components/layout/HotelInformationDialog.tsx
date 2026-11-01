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
        <DialogClose asChild><button type="button" className="hotel-information-close" aria-label="Ma’lumot oynasini yopish"><X size={20} /></button></DialogClose>
        {info.image && <img className="hotel-information-image" src={info.image} alt={info.title} />}
        <DialogHeader>
          <DialogTitle className="hotel-information-title">{info.title}</DialogTitle>
          <DialogDescription className="hotel-information-description">{info.description}</DialogDescription>
        </DialogHeader>
        <ul className="hotel-information-list">{info.items.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="hotel-information-actions">
          <a href="tel:+998712002020">Qo‘ng‘iroq qilish</a>
          <a href="#contact" onClick={onClose}>Manzil va aloqa</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
