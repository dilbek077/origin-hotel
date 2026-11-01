import { HOTEL_PHOTOS } from '@/data/hotelPhotos';
import { useRef, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const EVENTS = [
  {
    title: 'Restoranda yoqimli uchrashuv',
    description: 'Origin Hotel restorani — yaqinlaringiz bilan birga vaqt o‘tkazish uchun shinam muhit.',
    detail: 'Restoran muhiti, nonushta va shved stoli haqida ma’lumot oling. Tashrif va buyurtma tafsilotlarini mehmonxona bilan kelishishingiz mumkin.',
    note: 'Tashrif tafsilotlarini qabulxona bilan kelishing.',
    image: HOTEL_PHOTOS.eventRestaurant,
    alt: 'Origin Hotel tashqi ko‘rinishi',
    href: '#dining',
    action: 'Restoranni ko‘rish',
  },
  {
    title: 'Xotirjam hordiq',
    description: 'Basseyn, SPA va fitnes — Origin Hotel’da dam olish qulayliklari.',
    detail: 'Basseyn, SPA va fitnes zali haqida ma’lumot oling. Xizmatlardan foydalanish tafsilotlarini qabulxona bilan kelishing; suratlar galereyasida mehmonxona muhitini ko‘ring.',
    note: 'Basseyn · SPA · Fitnes',
    image: HOTEL_PHOTOS.eventRelax,
    alt: 'Origin Hotel zinapoyasi',
    href: '#experiences',
    action: 'Qulayliklarni ko‘rish',
  },
  {
    title: 'Oilaviy hordiq',
    description: 'Suite xonasi — oila bilan dam olish uchun keng va qulay tanlov.',
    detail: 'Suite xonasi 68 m² maydon va 4 kishigacha sig‘imga ega. Xona tafsilotlari, qulayliklari va narxini xonalar bo‘limida ko‘ring.',
    note: 'Suite · 68 m² · 4 kishigacha',
    image: HOTEL_PHOTOS.eventFamily,
    alt: 'Origin Hotel xonasidagi stol va kreslolar',
    href: '#rooms',
    action: 'Xonalarni ko‘rish',
  },
];

export default function HotelEvents() {
  const [selection, setSelection] = useState<number | 'all' | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const selected = typeof selection === 'number' ? EVENTS[selection] : null;

  return <section id="events" className="shilla-events" aria-labelledby="hotel-events-title">
    <div className="shilla-events-heading">
      <h2 id="hotel-events-title">TADBIRLAR</h2>
      <p>Restoran, sayohat va hordiq uchun Origin Hotel bilan tanishing.</p>
      <button type="button" aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setSelection('all'); }}>Barcha tadbirlar<ChevronRight size={17} strokeWidth={1} /></button>
    </div>
    <div className="shilla-events-grid">
      {EVENTS.map((item, index) => <article className="shilla-event-card" key={item.title}>
        <button type="button" className="shilla-event-image" aria-label={`${item.title}: batafsil`} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setSelection(index); }}><img src={item.image} alt={item.alt} loading="lazy" decoding="async" /></button>
        <h3><button type="button" aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setSelection(index); }}>{item.title}</button></h3>
        <p>{item.description}</p>
        <p className="shilla-event-note">{item.note}</p>
      </article>)}
    </div>
    <Dialog open={selection !== null} onOpenChange={(open) => { if (!open) setSelection(null); }}>
      <DialogContent className="shilla-event-dialog" showCloseButton={false} onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}>
        <DialogClose asChild><button type="button" className="shilla-event-close" aria-label="Tadbirlar oynasini yopish"><X size={22} strokeWidth={1.2} /></button></DialogClose>
        <DialogHeader><DialogTitle>{selected?.title ?? 'Barcha tadbirlar'}</DialogTitle><DialogDescription>{selected?.description ?? 'Origin Hotel’da restoran, shahar manzaralari va oilaviy hordiq haqida ma’lumotlar.'}</DialogDescription></DialogHeader>
        {selected ? <>
          <img className="shilla-event-detail-image" src={selected.image} alt={selected.alt} />
          <p className="shilla-event-detail-copy">{selected.detail}</p>
          <div className="shilla-event-actions"><a href={selected.href} onClick={() => setSelection(null)}>{selected.action}<ChevronRight size={17} /></a><a href="tel:+998712002020">Qo‘ng‘iroq qilish</a></div>
        </> : <div className="shilla-event-catalog">{EVENTS.map((item, index) => <button type="button" key={item.title} onClick={() => setSelection(index)}><img src={item.image} alt={item.alt} loading="lazy" /><span><strong>{item.title}</strong><small>{item.description}</small></span><ChevronRight size={20} strokeWidth={1} /></button>)}</div>}
      </DialogContent>
    </Dialog>
  </section>;
}
