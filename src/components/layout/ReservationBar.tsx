import { L } from '@/localization/elements';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Minus, Plus, Search, UsersRound, X } from 'lucide-react';
import ReservationDatePicker from './ReservationDatePicker';
import { hotelToday, nextDate } from '@/data/reservationDates';

type GuestRoom = { id: number; adults: number; children: number; infants: number };
type GuestKind = 'adults' | 'children' | 'infants';
const GUEST_TYPES = [
  { key: 'adults', label: 'Kattalar', min: 1, max: 4 },
  { key: 'children', label: 'Bolalar', min: 0, max: 3 },
  { key: 'infants', label: 'Chaqaloqlar', min: 0, max: 2 },
] as const;
const MAX_ROOMS = 8;

export default function ReservationBar({ onSearch }: { onSearch: (summary: string) => void }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  useEffect(() => {
    const show = () => setMobileExpanded(true);
    window.addEventListener('origin-open-mobile-reservation', show);
    return () => window.removeEventListener('origin-open-mobile-reservation', show);
  }, []);
  const [mode, setMode] = useState<'room' | 'dining'>('room');
  const [checkIn, setCheckIn] = useState(hotelToday);
  const [checkOut, setCheckOut] = useState(() => nextDate(hotelToday()));
  const [rooms, setRooms] = useState<GuestRoom[]>([{ id: 1, adults: 2, children: 0, infants: 0 }]);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const nextRoomId = useRef(2);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const focusRoomId = useRef<number | null>(null);
  const totals = rooms.reduce((sum, room) => ({ adults: sum.adults + room.adults, children: sum.children + room.children, infants: sum.infants + room.infants }), { adults: 0, children: 0, infants: 0 });

  function closeGuests() {
    setGuestsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!guestsOpen) return;
    panelRef.current?.focus({ preventScroll: true });
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) setGuestsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setGuestsOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [guestsOpen]);

  useEffect(() => {
    if (focusRoomId.current === null) return;
    document.getElementById(`guest-room-${focusRoomId.current}`)?.focus({ preventScroll: true });
    focusRoomId.current = null;
  }, [rooms.length]);

  function updateGuest(roomId: number, kind: GuestKind, change: number) {
    const limits = GUEST_TYPES.find((item) => item.key === kind)!;
    setRooms((current) => current.map((room) => room.id === roomId ? { ...room, [kind]: Math.max(limits.min, Math.min(limits.max, room[kind] + change)) } : room));
  }

  function addRoom() {
    if (rooms.length >= MAX_ROOMS) return;
    const id = nextRoomId.current++;
    focusRoomId.current = id;
    setRooms((current) => [...current, { id, adults: 2, children: 0, infants: 0 }]);
  }

  return (
    <L.form id="reservation" className={`shilla-reservation ${mobileExpanded ? 'is-mobile-expanded' : ''}`} onSubmit={(event) => {
      event.preventDefault();
      setGuestsOpen(false);
      if (checkIn < hotelToday() || checkOut <= checkIn) { setDatesOpen(true); return; }
      setDatesOpen(false);
      if (mode === 'dining') { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); return; }
      const breakdown = rooms.map((room, index) => `${index + 1}-xona: ${room.adults} katta, ${room.children} bola, ${room.infants} chaqaloq`).join('; ');
      onSearch(`${checkIn} — ${checkOut} · ${rooms.length} xona · ${totals.adults} katta, ${totals.children} bola, ${totals.infants} chaqaloq. ${breakdown}. Xonani tanlab, bronni tasdiqlash uchun biz bilan bog‘laning.`);
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
      // The focused panel is removed on submit; move focus to the results.
      requestAnimationFrame(() => [...document.querySelectorAll<HTMLElement>('#rooms h2')].find((heading) => heading.offsetParent !== null)?.focus({ preventScroll: true }));
    }}>
      <L.button type="button" className="shilla-mobile-hotel-search" aria-expanded={mobileExpanded} aria-label="Bron sanalari va mehmonlarni tanlash" onClick={() => { setMobileExpanded(!mobileExpanded); setDatesOpen(false); setGuestsOpen(false); }}><L.span>Origin Hotel · Qarshi — bron qilish</L.span>{mobileExpanded ? <X size={23} strokeWidth={1.2} /> : <Search size={23} strokeWidth={1.2} />}</L.button>
      <L.div className="shilla-booking-mode" aria-label="Bron turi">
        <L.button type="button" className={mode === 'room' ? 'active' : ''} aria-pressed={mode === 'room'} onClick={() => setMode('room')}>Xona</L.button>
        <L.button type="button" className={mode === 'dining' ? 'active' : ''} aria-pressed={mode === 'dining'} onClick={() => setMode('dining')}>Restoran</L.button>
      </L.div>
      <L.div className="shilla-hotel-field"><L.span>Origin Hotel · Toshkent</L.span><MapPin size={23} strokeWidth={1.3} /></L.div>
      <ReservationDatePicker checkIn={checkIn} checkOut={checkOut} open={datesOpen} onOpenChange={(open) => { setDatesOpen(open); if (open) setGuestsOpen(false); }} onChange={(arrival, departure) => { setCheckIn(arrival); setCheckOut(departure); }} />
      <L.div className="shilla-guest-field">
        <L.button ref={triggerRef} type="button" aria-label="Xonalar va mehmonlarni tanlash" aria-haspopup="dialog" aria-expanded={guestsOpen} aria-controls="reservation-guests" onClick={() => { setDatesOpen(false); setGuestsOpen(!guestsOpen); }}><L.span>Xona {rooms.length} · Katta {totals.adults} <L.span className="shilla-guest-extra">Bola {totals.children} Chaqaloq {totals.infants}</L.span></L.span><UsersRound size={23} strokeWidth={1.2} /></L.button>
      </L.div>
      <L.button className="shilla-reservation-submit" type="submit">{mode === 'room' ? 'Bron qilish' : 'Bog‘lanish'}</L.button>
      {guestsOpen && <L.div ref={panelRef} id="reservation-guests" className="shilla-guest-panel" role="dialog" aria-labelledby="reservation-guests-title" aria-describedby="reservation-guests-note" tabIndex={-1}>
        <L.h2 id="reservation-guests-title" className="sr-only">Xonalar va mehmonlar</L.h2>
        <L.button type="button" className="shilla-guest-close" aria-label="Mehmonlar panelini yopish" onClick={closeGuests}><X size={21} strokeWidth={1} /></L.button>
        <L.div className="shilla-guest-rows">
          {rooms.map((room, index) => <L.div className="shilla-guest-room" key={room.id}>
            <L.div className="shilla-guest-room-heading"><L.h3 id={`guest-room-${room.id}`} tabIndex={-1}>Xona {index + 1}</L.h3>{rooms.length > 1 && <L.button type="button" className="shilla-guest-remove" aria-label={`${index + 1}-xonani olib tashlash`} onClick={() => { setRooms((current) => current.filter((item) => item.id !== room.id)); addRef.current?.focus(); }}><X size={15} />Olib tashlash</L.button>}</L.div>
            {GUEST_TYPES.map((kind) => <L.div className="shilla-guest-counter" role="group" aria-label={`${index + 1}-xona: ${kind.label}`} key={kind.key}>
              <L.span>{kind.label}</L.span>
              <L.button type="button" aria-label={`${index + 1}-xona: ${kind.label} sonini kamaytirish`} disabled={room[kind.key] <= kind.min} onClick={() => updateGuest(room.id, kind.key, -1)}><Minus size={18} strokeWidth={1} /></L.button>
              <L.output aria-live="polite" aria-label={`${index + 1}-xona: ${kind.label} soni`}>{room[kind.key]}</L.output>
              <L.button type="button" aria-label={`${index + 1}-xona: ${kind.label} sonini oshirish`} disabled={room[kind.key] >= kind.max} onClick={() => updateGuest(room.id, kind.key, 1)}><Plus size={18} strokeWidth={1} /></L.button>
            </L.div>)}
          </L.div>)}
        </L.div>
        <L.div className="shilla-guest-panel-note">
          <L.p id="reservation-guests-note">※ Bolalar: 37 oylikdan 12 yoshgacha. Chaqaloqlar: 36 oylikkacha.<L.small>Har xonada: 1–4 katta, 0–3 bola, 0–2 chaqaloq. Ko‘pi bilan {MAX_ROOMS} xona.</L.small></L.p>
          <L.button ref={addRef} type="button" className="shilla-guest-add" disabled={rooms.length >= MAX_ROOMS} onClick={addRoom}>Xona qo‘shish<Plus size={20} strokeWidth={1} /></L.button>
        </L.div>
        <L.div className="shilla-guest-actions"><L.button type="button" onClick={closeGuests}>Orqaga</L.button><L.button type="submit">{mode === 'room' ? 'Qidirish' : 'Bog‘lanish'}</L.button></L.div>
      </L.div>}
    </L.form>
  );
}
