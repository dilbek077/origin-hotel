import { useEffect, useRef, useState } from 'react';
import { MapPin, Minus, Plus, UsersRound, X } from 'lucide-react';

type GuestRoom = { id: number; adults: number; children: number; infants: number };
type GuestKind = 'adults' | 'children' | 'infants';
const GUEST_TYPES = [
  { key: 'adults', label: 'Kattalar', min: 1, max: 4 },
  { key: 'children', label: 'Bolalar', min: 0, max: 3 },
  { key: 'infants', label: 'Chaqaloqlar', min: 0, max: 2 },
] as const;
const MAX_ROOMS = 8;

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReservationBar({ onSearch }: { onSearch: (summary: string) => void }) {
  const [mode, setMode] = useState<'room' | 'dining'>('room');
  const [checkIn, setCheckIn] = useState(() => localDate(new Date()));
  const [checkOut, setCheckOut] = useState(() => { const day = new Date(); day.setDate(day.getDate() + 1); return localDate(day); });
  const [rooms, setRooms] = useState<GuestRoom[]>([{ id: 1, adults: 2, children: 0, infants: 0 }]);
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
    <form id="reservation" className="shilla-reservation" onSubmit={(event) => {
      event.preventDefault();
      setGuestsOpen(false);
      if (mode === 'dining') { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); return; }
      const breakdown = rooms.map((room, index) => `${index + 1}-xona: ${room.adults} katta, ${room.children} bola, ${room.infants} chaqaloq`).join('; ');
      onSearch(`${checkIn} — ${checkOut} · ${rooms.length} xona · ${totals.adults} katta, ${totals.children} bola, ${totals.infants} chaqaloq. ${breakdown}. Xonani tanlab, bronni tasdiqlash uchun biz bilan bog‘laning.`);
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
      // The focused panel is removed on submit; move focus to the results.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('#rooms h2')?.focus({ preventScroll: true }));
    }}>
      <div className="shilla-booking-mode" aria-label="Bron turi">
        <button type="button" className={mode === 'room' ? 'active' : ''} aria-pressed={mode === 'room'} onClick={() => setMode('room')}>Xona</button>
        <button type="button" className={mode === 'dining' ? 'active' : ''} aria-pressed={mode === 'dining'} onClick={() => setMode('dining')}>Restoran</button>
      </div>
      <div className="shilla-hotel-field"><span>Origin Hotel · Toshkent</span><MapPin size={23} strokeWidth={1.3} /></div>
      <div className="shilla-date-field">
        <label><span className="sr-only">Kelish sanasi</span><input aria-label="Kelish sanasi" type="date" required value={checkIn} min={localDate(new Date())} onChange={(event) => {
          const value = event.target.value; setCheckIn(value);
          if (value && checkOut <= value) { const next = new Date(`${value}T12:00:00`); next.setDate(next.getDate() + 1); setCheckOut(localDate(next)); }
        }} /></label>
        <span aria-hidden>–</span>
        <label><span className="sr-only">Ketish sanasi</span><input aria-label="Ketish sanasi" type="date" required value={checkOut} min={(() => { const day = new Date(`${checkIn || localDate(new Date())}T12:00:00`); day.setDate(day.getDate() + 1); return localDate(day); })()} onChange={(event) => setCheckOut(event.target.value)} /></label>
      </div>
      <div className="shilla-guest-field">
        <button ref={triggerRef} type="button" aria-label="Xonalar va mehmonlarni tanlash" aria-haspopup="dialog" aria-expanded={guestsOpen} aria-controls="reservation-guests" onClick={() => setGuestsOpen(!guestsOpen)}><span>Xona {rooms.length} · Katta {totals.adults} <span className="shilla-guest-extra">Bola {totals.children} Chaqaloq {totals.infants}</span></span><UsersRound size={23} strokeWidth={1.2} /></button>
      </div>
      <button className="shilla-reservation-submit" type="submit">{mode === 'room' ? 'Bron qilish' : 'Bog‘lanish'}</button>
      {guestsOpen && <div ref={panelRef} id="reservation-guests" className="shilla-guest-panel" role="dialog" aria-labelledby="reservation-guests-title" aria-describedby="reservation-guests-note" tabIndex={-1}>
        <h2 id="reservation-guests-title" className="sr-only">Xonalar va mehmonlar</h2>
        <button type="button" className="shilla-guest-close" aria-label="Mehmonlar panelini yopish" onClick={closeGuests}><X size={21} strokeWidth={1} /></button>
        <div className="shilla-guest-rows">
          {rooms.map((room, index) => <div className="shilla-guest-room" key={room.id}>
            <div className="shilla-guest-room-heading"><h3 id={`guest-room-${room.id}`} tabIndex={-1}>Xona {index + 1}</h3>{rooms.length > 1 && <button type="button" className="shilla-guest-remove" aria-label={`${index + 1}-xonani olib tashlash`} onClick={() => { setRooms((current) => current.filter((item) => item.id !== room.id)); addRef.current?.focus(); }}><X size={15} />Olib tashlash</button>}</div>
            {GUEST_TYPES.map((kind) => <div className="shilla-guest-counter" role="group" aria-label={`${index + 1}-xona: ${kind.label}`} key={kind.key}>
              <span>{kind.label}</span>
              <button type="button" aria-label={`${index + 1}-xona: ${kind.label} sonini kamaytirish`} disabled={room[kind.key] <= kind.min} onClick={() => updateGuest(room.id, kind.key, -1)}><Minus size={18} strokeWidth={1} /></button>
              <output aria-live="polite" aria-label={`${index + 1}-xona: ${kind.label} soni`}>{room[kind.key]}</output>
              <button type="button" aria-label={`${index + 1}-xona: ${kind.label} sonini oshirish`} disabled={room[kind.key] >= kind.max} onClick={() => updateGuest(room.id, kind.key, 1)}><Plus size={18} strokeWidth={1} /></button>
            </div>)}
          </div>)}
        </div>
        <div className="shilla-guest-panel-note">
          <p id="reservation-guests-note">※ Bolalar: 37 oylikdan 12 yoshgacha. Chaqaloqlar: 36 oylikkacha.<small>Har xonada: 1–4 katta, 0–3 bola, 0–2 chaqaloq. Ko‘pi bilan {MAX_ROOMS} xona.</small></p>
          <button ref={addRef} type="button" className="shilla-guest-add" disabled={rooms.length >= MAX_ROOMS} onClick={addRoom}>Xona qo‘shish<Plus size={20} strokeWidth={1} /></button>
        </div>
        <div className="shilla-guest-actions"><button type="button" onClick={closeGuests}>Orqaga</button><button type="submit">{mode === 'room' ? 'Qidirish' : 'Bog‘lanish'}</button></div>
      </div>}
    </form>
  );
}
