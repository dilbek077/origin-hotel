import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, useTranslation } from '@/i18n';
import {
  Hotel,
  MapPin,
  Mail,
  Star,
  Wifi,
  UtensilsCrossed,
  ArrowRight,
  Menu,
  X,
  Car,
  Dumbbell,
  Waves,
  Clock,
  ChevronUp,
  BedDouble,
  CalendarCheck,
  ArrowUpRight,
  Home,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  UsersRound,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../landing.css';
import '../shilla-layout.css';

/* ─── constants ──────────────────────────────────────────── */
const IMAGES = {
  exterior:   'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1800&q=82',
  lobby:      'https://images.unsplash.com/photo-1660557989695-14fac79c086d?auto=format&fit=crop&w=1200&q=80',
  standard:   'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  deluxe:     'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  suite:      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
  family:     'https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1200&q=80',
  presidential: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=80',
  pool:       'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  spa:        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  gym:        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
};

const ROOM_DATA = [
  {
    type: 'Standart',
    label: 'Standart',
    price: 480_000,
    capacity: 2,
    size: '28 m²',
    image: IMAGES.standard,
    features: ['Tezkor Wi-Fi', 'Smart TV', 'Konditsioner', 'Bepul nonushta'],
    description: 'Sayohat va qisqa muddatli tashriflar uchun barcha qulayliklarga ega shinam xona.',
  },
  {
    type: 'Deluxe',
    label: 'Deluxe',
    price: 780_000,
    capacity: 2,
    size: '42 m²',
    image: IMAGES.deluxe,
    features: ['Panoramik oyna', 'Katta balkon', 'Mini-bar', 'Shved stoli'],
    description: 'Keng maydon, shahar panoramasi va mini-bar bilan jihozlangan lyuks xona.',
  },
  {
    type: 'Suite',
    label: 'Suite',
    price: 1_350_000,
    capacity: 4,
    size: '68 m²',
    image: IMAGES.suite,
    features: ['2 ta xona', 'Jakuzi', 'Oshxona burchagi', 'VIP xizmat'],
    description: 'Oilaviy dam olish uchun alohida mehmonxona va yotoqxonaga ega keng suit.',
  },
  {
    type: 'Presidential',
    label: 'Presidential',
    price: 2_850_000,
    capacity: 4,
    size: '120 m²',
    image: IMAGES.presidential,
    features: ['Shaxsiy terras', 'Shaxsiy batler', 'Premium spa', 'Transfer bepul'],
    description: 'Eksklyuziv dizayn, yuqori xavfsizlik va shaxsiy xodim bilan xizmat.',
  },
];

const AMENITIES = [
  { icon: Wifi,           label: 'Bepul Wi-Fi',      key: 'wifi' },
  { icon: Waves,          label: 'Basseyn va SPA',   key: 'pool' },
  { icon: UtensilsCrossed,label: 'Restoran',          key: 'restaurant' },
  { icon: Car,            label: 'Bepul parking',    key: 'parking' },
  { icon: Dumbbell,       label: 'Fitnes zali',      key: 'gym' },
  { icon: Shield,         label: '24/7 xavfsizlik',  key: 'security' },
  { icon: CalendarCheck,  label: 'Aeroport transfer',key: 'transfer' },
  { icon: Clock,          label: '24/7 qabulxona',   key: 'reception' },
];

const GALLERY_PHOTOS = [
  { src: IMAGES.exterior,    wide: true,  alt: 'Origin Hotel tashqi ko\'rinish' },
  { src: IMAGES.lobby,       wide: false, alt: 'Qabulxona' },
  { src: IMAGES.pool,        wide: false, alt: 'Basseyn' },
  { src: IMAGES.suite,       wide: true,  alt: 'Suite xona' },
  { src: IMAGES.restaurant,  wide: false, alt: 'Restoran' },
  { src: IMAGES.spa,         wide: false, alt: 'SPA zona' },
  { src: IMAGES.gym,         wide: false, alt: 'Fitnes zali' },
  { src: IMAGES.presidential,wide: true,  alt: 'Presidential suite' },
];

const REVIEWS = [
  {
    name: 'Madina R.',
    origin: 'Toshkent',
    rating: 5,
    text: 'Xona juda tinch, nonushta boy. Xodimlar har bir so\'rovga darhol javob berdi.',
  },
  {
    name: 'Daniel M.',
    origin: 'London',
    rating: 5,
    text: 'Shahar markazida, ammo shovqin eshitilmaydi. Basseyn va spa kutganimdan yaxshi chiqdi.',
  },
  {
    name: 'Elena P.',
    origin: 'Moskva',
    rating: 4,
    text: 'Aeroportdan transfer oldindan kelib, kutishga to\'g\'ri kelmadi. Keyingi safar ham shu yerda qolaman.',
  },
];

const NAV_LINKS = [
  { href: '#about', label: 'Biz haqimizda' },
  { href: '#rooms', label: 'Takliflar' },
  { href: '#rooms', label: 'Xonalar' },
  { href: '#dining', label: 'Restoran' },
  { href: '#experiences', label: 'Qulayliklar' },
  { href: '#gallery', label: 'Galereya' },
  { href: '#reviews', label: 'Fikrlar' },
  { href: '#contact', label: 'Aloqa' },
];

function formatPrice(n: number) {
  return n.toLocaleString('uz-UZ') + ' so\'m';
}

/* ─── scroll-animate hook ─────────────────────────────────── */
function useScrollAnimate() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.anim-fade-up');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); }
      }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── scroll-progress hook ────────────────────────────────── */
function useScrollProgress() {
  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
      document.documentElement.style.setProperty('--scroll-progress', String(Math.min(1, p)));
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
}

/* Screenshot-matched header; existing account routes are retained. */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 160);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const { locale, setLocale } = useTranslation();

  return (
    <header className={`shilla-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shilla-header-top">
        <a href="#about" className="shilla-hotel-link"><Home size={21} strokeWidth={1.2} /><span>Mehmonxona haqida +</span></a>
        <Link to="/" className="shilla-wordmark" aria-label="Origin Hotel — bosh sahifa">
          <span>ORIGIN HOTEL</span><small>TOSHKENT</small>
        </Link>
        <div className="shilla-account-links">
          <Link to="/login">Kirish</Link>
          <Link to="/admin/bronlar">Bronlarim</Link>
          <Link to="/admin">Boshqaruv</Link>
          <a href="#contact">Bog‘lanish</a>
          <div className="shilla-language" onKeyDown={(event) => { if (event.key === 'Escape') setLanguageOpen(false); }}>
            <button type="button" aria-expanded={languageOpen} aria-label="Tilni tanlash" onClick={() => setLanguageOpen(!languageOpen)}><Globe size={15} strokeWidth={1.1} />{LANGUAGES.find((language) => language.code === locale)?.label}<ChevronDown size={13} /></button>
            {languageOpen && <div className="shilla-language-options">{LANGUAGES.map((language) => <button type="button" key={language.code} aria-pressed={language.code === locale} onClick={() => { setLocale(language.code); setLanguageOpen(false); }}>{language.label}</button>)}</div>}
          </div>
        </div>
        <button type="button" className="shilla-mobile-toggle" aria-label="Menyu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      <nav className={`shilla-primary-nav ${open ? 'is-open' : ''}`} aria-label="Asosiy menyu">
        {NAV_LINKS.map((link) => <a href={link.href} key={link.label} onClick={() => setOpen(false)}>{link.label}</a>)}
        <a href="#reservation" className="shilla-nav-reserve" onClick={() => setOpen(false)}>Bron qilish</a>
      </nav>
    </header>
  );
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function ReservationBar({ onSearch }: { onSearch: (summary: string) => void }) {
  const [mode, setMode] = useState<'room' | 'dining'>('room');
  const [checkIn, setCheckIn] = useState(() => localDate(new Date()));
  const [checkOut, setCheckOut] = useState(() => { const day = new Date(); day.setDate(day.getDate() + 1); return localDate(day); });
  const [adults, setAdults] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!guestsOpen) return;
    const close = (event: MouseEvent) => { if (!guestsRef.current?.contains(event.target as Node)) setGuestsOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [guestsOpen]);

  return (
    <form id="reservation" className="shilla-reservation" onSubmit={(event) => {
      event.preventDefault();
      setGuestsOpen(false);
      if (mode === 'dining') { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); return; }
      onSearch(`${checkIn} — ${checkOut} · ${roomCount} xona · ${adults} mehmon. Xonani tanlab, bronni tasdiqlash uchun biz bilan bog‘laning.`);
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
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
      <div ref={guestsRef} className="shilla-guest-field" onKeyDown={(event) => { if (event.key === 'Escape') setGuestsOpen(false); }}>
        <button type="button" aria-expanded={guestsOpen} onClick={() => setGuestsOpen(!guestsOpen)}><span>Xona {roomCount} · Mehmon {adults}</span><UsersRound size={23} strokeWidth={1.2} /></button>
        {guestsOpen && <div className="shilla-guest-popover">
          <label>Xonalar<input aria-label="Xonalar soni" type="number" min="1" max="8" value={roomCount} onChange={(event) => setRoomCount(Math.max(1, Math.min(8, Number(event.target.value))))} /></label>
          <label>Mehmonlar<input aria-label="Mehmonlar soni" type="number" min="1" max="24" value={adults} onChange={(event) => setAdults(Math.max(1, Math.min(24, Number(event.target.value))))} /></label>
          <button type="button" onClick={() => setGuestsOpen(false)}>Tayyor</button>
        </div>}
      </div>
      <button className="shilla-reservation-submit" type="submit">{mode === 'room' ? 'Bron qilish' : 'Bog‘lanish'}</button>
    </form>
  );
}

const HERO_SLIDES = [
  { src: IMAGES.pool, alt: 'Origin Hotel basseyn va dam olish hududi' },
  { src: IMAGES.exterior, alt: 'Origin Hotel tashqi ko‘rinishi' },
  { src: IMAGES.presidential, alt: 'Origin Hotel Presidential xonasi' },
];

function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((previous) => (previous + 1) % HERO_SLIDES.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const nextSlide = (direction: number) => setSlide((previous) => (previous + direction + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="shilla-hero" aria-label="Origin Hotel suratlari" aria-roledescription="slayder">
      {HERO_SLIDES.map((photo, index) => <img key={photo.src} src={photo.src} alt={photo.alt} aria-hidden={index !== slide} className={index === slide ? 'is-active' : ''} fetchPriority={index === 0 ? 'high' : 'auto'} />)}
      <h1 className="sr-only">Origin Hotel — Har bir lahza unutilmas taassurot</h1>
      <div className="shilla-slider-controls">
        <div className="shilla-slide-progress" aria-label={`${slide + 1} / ${HERO_SLIDES.length}`}><span style={{ width: `${((slide + 1) / HERO_SLIDES.length) * 100}%` }} /></div>
        <button type="button" aria-label={paused ? 'Slayderni davom ettirish' : 'Slayderni to‘xtatish'} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
        <button type="button" aria-label="Oldingi surat" onClick={() => nextSlide(-1)}><ChevronLeft size={25} strokeWidth={1} /></button>
        <button type="button" aria-label="Keyingi surat" onClick={() => nextSlide(1)}><ChevronRight size={25} strokeWidth={1} /></button>
      </div>
    </section>
  );
}

/* ─── Ticker ─────────────────────────────────────────────── */
function Ticker() {
  return (
    <div className="hotel-ticker" role="region" aria-label="Origin Hotel — Toshkent. Qulaylik va nafosat. Unutilmas hordiq.">
      <div className="hotel-ticker-track" aria-hidden="true">
        {[0, 1].map((group) => (
          <div className="hotel-ticker-group" key={group}>
            {[0, 1].map((copy) => (
              <span key={copy}>
                ORIGIN HOTEL <i>✦</i> TOSHKENT <i>✦</i> QULAYLIK VA NAFOSAT{' '}
                <i>✦</i> UNUTILMAS HORDIQ <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Rooms ──────────────────────────────────────────────── */
function RoomCard({ room, onBook }: { room: typeof ROOM_DATA[0]; onBook: (room: typeof ROOM_DATA[0]) => void }) {
  return (
    <article className="shilla-package-card">
      <button type="button" className="shilla-package-image" onClick={() => onBook(room)} aria-label={`${room.label} xonani ko‘rish`}>
        <img src={room.image} alt={`${room.label} xona`} loading="lazy" decoding="async" />
      </button>
      <h3><button type="button" onClick={() => onBook(room)}>{room.label} Xona</button></h3>
      <p>{room.description}</p>
      <p className="shilla-package-features">{room.features.slice(0, 2).join(' · ')}</p>
      <p className="shilla-package-price">{formatPrice(room.price)} / tun · {room.size} · {room.capacity} kishi</p>
    </article>
  );
}

function RoomDetailModal({
  room,
  onClose,
}: {
  room: typeof ROOM_DATA[0];
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="gallery-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-[--page] rounded-3xl overflow-hidden max-w-lg w-full mx-4 shadow-2xl">
        <img src={room.image} alt={room.label} className="h-52 w-full object-cover" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[--ink]/60 p-2 text-white hover:bg-[--ink] transition"
        >
          <X size={16} />
        </button>
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">{room.label}</p>
          <h3 className="font-display mt-1 text-2xl">{room.label} Xona</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{room.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {room.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[--champagne]" />
                {f}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[--line] pt-4">
            <div>
              <p className="text-[10px] text-muted-foreground">Tunlik narx</p>
              <p className="text-lg font-bold text-[--champagne]">{formatPrice(room.price)}</p>
            </div>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="rounded-full bg-[--champagne] px-5 py-2.5 text-xs font-bold text-[--ink] hover:bg-white transition"
            >
              Bog'lanish
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Rooms({ searchSummary }: { searchSummary: string }) {
  const [selected, setSelected] = useState<typeof ROOM_DATA[0] | null>(null);
  return (
    <section id="rooms" className="shilla-packages">
      <div className="shilla-packages-heading">
        <h2>XONALAR</h2>
        <p>Har bir sayohatga mos xona.</p>
        <a href="#gallery">Barcha suratlar <ChevronRight size={17} strokeWidth={1} /></a>
      </div>
      {searchSummary && <p role="status" className="shilla-search-summary">{searchSummary}</p>}
      <div className="shilla-packages-grid">{ROOM_DATA.map((room) => <RoomCard key={room.type} room={room} onBook={setSelected} />)}</div>
      {selected && <RoomDetailModal room={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

const DINING_CARDS = [
  {
    title: 'Restoran',
    description: 'Origin Hotel restorani va shinam muhit.',
    image: IMAGES.restaurant,
    alt: 'Restoran zali',
  },
  {
    title: 'Bepul nonushta',
    description: 'Standart xona qulayliklari qatorida bepul nonushta.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85',
    alt: 'Restorandagi dasturxon',
  },
  {
    title: 'Shved stoli',
    description: 'Deluxe xona mehmonlari uchun shved stoli.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85',
    alt: 'Restoran interyeri',
  },
];

function Dining() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const moveTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(DINING_CARDS.length - 1, index));
    const card = track.children[next] as HTMLElement | undefined;
    const first = track.children[0] as HTMLElement | undefined;
    if (!card || !first) return;
    track.scrollTo({
      left: card.offsetLeft - first.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <section id="dining" className="shilla-dining" aria-labelledby="dining-title">
      <div className="shilla-dining-intro">
        <h2 id="dining-title">RESTORAN</h2>
        <p>Origin Hotel restorani, nonushta va shved stoli bilan yoqimli dam oling.</p>
        <img
          className="shilla-dining-main-image"
          src={IMAGES.restaurant}
          alt="Origin Hotel restoran bo‘limi"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="shilla-dining-gallery">
        <div
          ref={trackRef}
          className="shilla-dining-track"
          tabIndex={0}
          role="region"
          aria-label="Restoran xizmatlari, yon tomonga suring"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              moveTo(activeCard + (event.key === 'ArrowRight' ? 1 : -1));
            }
          }}
          onScroll={() => {
            const track = trackRef.current;
            const first = track?.children[0] as HTMLElement | undefined;
            const second = track?.children[1] as HTMLElement | undefined;
            if (!track || !first || !second) return;
            const step = second.offsetLeft - first.offsetLeft;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
            setActiveCard(atEnd ? DINING_CARDS.length - 1 : Math.min(DINING_CARDS.length - 1, Math.round(track.scrollLeft / step)));
          }}
        >
          {DINING_CARDS.map((card) => (
            <article key={card.title} className="shilla-dining-card">
              <a href="#contact" className="shilla-dining-image-link" aria-label={`${card.title}: bog‘lanish`}>
                <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
              </a>
              <div className="shilla-dining-caption">
                <h3><a href="#contact">{card.title}</a></h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="shilla-dining-controls">
          <span aria-live="polite">{String(activeCard + 1).padStart(2, '0')} / {String(DINING_CARDS.length).padStart(2, '0')}</span>
          <div>
            <button type="button" aria-label="Oldingi restoran kartochkasi" disabled={activeCard === 0} onClick={() => moveTo(activeCard - 1)}><ChevronLeft size={23} strokeWidth={1} /></button>
            <button type="button" aria-label="Keyingi restoran kartochkasi" disabled={activeCard === DINING_CARDS.length - 1} onClick={() => moveTo(activeCard + 1)}><ChevronRight size={23} strokeWidth={1} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE_SLIDES = [
  {
    image: IMAGES.exterior,
    alt: 'Origin Hotel tashqi ko‘rinishi',
    title: 'Origin Hotel — unutilmas taassurotlar',
    description: 'Shinam xonalar, samimiy xizmat va o‘zingizni uyda his qiladigan muhitdan bahramand bo‘ling.',
  },
  {
    image: IMAGES.pool,
    alt: 'Basseyn va dam olish hududi',
    title: 'Basseyn va SPA — xotirjam hordiq',
    description: 'Basseyn, SPA va fitnes zali — bir tom ostida barcha qulayliklar.',
  },
  {
    image: IMAGES.lobby,
    alt: 'Origin Hotel qabulxonasi',
    title: 'Origin muhitini his qiling',
    description: 'Qabulxona kechayu kunduz ishlaydi. Amir Temur shoh ko‘chasi 15, Toshkent.',
  },
];

function Experiences() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (direction: number) => setActiveSlide((previous) =>
    (previous + direction + EXPERIENCE_SLIDES.length) % EXPERIENCE_SLIDES.length
  );

  return (
    <section id="experiences" className="shilla-experiences" aria-labelledby="experiences-title">
      <div className="shilla-experiences-heading">
        <h2 id="experiences-title">TAASSUROTLAR</h2>
        <p>Origin Hotel’da har bir sayohatingizni unutilmas lahzalarga boyiting.</p>
      </div>
      <div
        className="shilla-experiences-stage"
        role="region"
        aria-roledescription="slayder"
        aria-label="Mehmonxona suratlari va taassurotlar"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
        onTouchStart={(event) => {
          const touch = event.changedTouches[0];
          if (!touch) return;
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          if (!touch) return;
          const distanceX = touch.clientX - start.x;
          const distanceY = touch.clientY - start.y;
          if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) move(distanceX < 0 ? 1 : -1);
        }}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        {EXPERIENCE_SLIDES.map((slide, index) => {
          const offset = (index - activeSlide + EXPERIENCE_SLIDES.length) % EXPERIENCE_SLIDES.length;
          const position = offset === 0 ? 'active' : offset === 1 ? 'next' : 'previous';
          return (
            <article key={slide.title} className={`shilla-experience-slide is-${position}`} aria-hidden={position !== 'active'}>
              <img src={slide.image} alt={slide.alt} loading="lazy" decoding="async" draggable={false} />
            </article>
          );
        })}
        <div className="shilla-experience-caption">
          <div className="shilla-experience-copy">
            <h2>{EXPERIENCE_SLIDES[activeSlide].title}</h2>
            <p>{EXPERIENCE_SLIDES[activeSlide].description}</p>
          </div>
          <div className="shilla-experience-arrows">
            <button type="button" aria-label="Oldingi taassurot" onClick={() => move(-1)}><ChevronLeft size={26} strokeWidth={1} /></button>
            <button type="button" aria-label="Keyingi taassurot" onClick={() => move(1)}><ChevronRight size={26} strokeWidth={1} /></button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">{activeSlide + 1} / {EXPERIENCE_SLIDES.length}: {EXPERIENCE_SLIDES[activeSlide].title}</span>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="border-y border-[--line] bg-[--surface]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">

        {/* Images */}
        <div className="relative anim-fade-up">
          <img
            src={IMAGES.lobby}
            alt="Origin Hotel qabulxonasi"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
          <img
            src={IMAGES.standard}
            alt="Origin Hotel xona"
            loading="lazy"
            decoding="async"
            className="absolute -bottom-8 right-4 hidden h-40 w-40 rounded-3xl border-4 border-[--surface] object-cover sm:block lg:h-48 lg:w-48 shadow-lift"
          />
        </div>

        {/* Text */}
        <div className="anim-fade-up">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[--champagne]">
            Biz haqimizda
          </p>
          <h2 className="font-display mt-3 text-4xl lg:text-5xl">Bir tom ostida barcha qulayliklar</h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Origin Hotel besh qavatda 40 ta xonani birlashtiradi: basseyn va
            spa, restoran, fitnes zali, bepul parking va aeroportdan transfer.
            Qabulxona kechayu kunduz ishlaydi.
          </p>

          {/* Amenity grid */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[--line] bg-[--page] px-4 py-3.5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[--champagne]/15 text-[--champagne]">
                  <Icon size={18} />
                </span>
                <span className="text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[--line] pt-6 text-[11px] text-muted-foreground">
            <span>Amir Temur shoh ko'chasi 15, Toshkent</span>
            <span className="text-[--champagne]">Qabulxona: 24/7</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery ────────────────────────────────────────────── */
function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null);
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [lightbox]);

  return (
    <section id="gallery" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4 anim-fade-up">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[--champagne]">Galereya</p>
          <h2 className="font-display mt-3 text-4xl lg:text-5xl">Origin muhitini his qiling</h2>
        </div>
        <p className="text-[11px] uppercase tracking-[.14em] text-muted-foreground">
          Suratni kattalashtirish uchun bosing
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GALLERY_PHOTOS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(p.src)}
            className={`group relative h-44 overflow-hidden rounded-2xl border border-[--line] sm:h-52 ${
              p.wide ? 'col-span-2' : ''
            } anim-fade-up`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[--ink]/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/10 p-1.5 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <ArrowUpRight size={13} className="text-white" />
            </span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="gallery-overlay" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Origin Hotel" />
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Reviews ────────────────────────────────────────────── */
function Reviews() {
  return (
    <section id="reviews" className="border-y border-[--line] bg-[--surface]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 anim-fade-up">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[--champagne]">
              Mehmonlarimiz fikrlari
            </p>
            <h2 className="font-display mt-3 text-4xl lg:text-5xl">Mehmonlar fikri</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              So'nggi 12 oyda 1 200 dan ortiq mehmon sharh qoldirdi. O'rtacha baho — 4.9.
            </p>
          </div>
          <div className="rounded-2xl border border-[--champagne]/40 bg-[--champagne]/10 px-5 py-4 text-center">
            <p className="font-display text-4xl text-foreground">4.9</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[--champagne]" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" />)}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-muted-foreground">Mehmon reytingi</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure
              key={r.name}
              className="surface flex h-full flex-col rounded-3xl border border-[--line] p-6 anim-fade-up"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Star size={22} className="text-[--champagne]" fill="currentColor" />
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-foreground">{r.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[--line] pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[--ink] text-[11px] font-bold text-[--champagne]">
                  {r.name[0]}{r.name.split(' ')[1]?.[0]}
                </span>
                <span>
                  <span className="block text-xs font-semibold">{r.name}</span>
                  <span className="block text-[10px] text-muted-foreground">{r.origin}</span>
                </span>
                <span className="ml-auto flex gap-0.5 text-[--champagne]">
                  {Array.from({ length: r.rating }, (_, j) => (
                    <Star key={j} size={11} fill="currentColor" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────── */
function Contact() {
  const address = 'Amir Temur shoh ko‘chasi 15, Toshkent 100000';
  const mapQuery = encodeURIComponent('Origin Hotel, Amir Temur shoh ko‘chasi 15, Toshkent');
  const googleMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const openStreetMap = 'https://www.openstreetmap.org/?mlat=41.3111&mlon=69.2797#map=15/41.3111/69.2797';

  return (
    <section id="contact" className="shilla-location" aria-labelledby="location-title">
      <h2 id="location-title">JOYLASHUV</h2>
      <div className="shilla-location-info">
        <p><strong>Manzil</strong><a href={googleMap} target="_blank" rel="noreferrer">{address}</a></p>
        <p><strong>Tel.</strong><a href="tel:+998712002020">+998 71 200 20 20</a></p>
        <nav className="shilla-map-links" aria-label="Xarita xizmatlari">
          <a href={googleMap} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-google" aria-hidden="true" />Google Maps</a>
          <a href={`https://yandex.com/maps/?text=${mapQuery}`} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-yandex" aria-hidden="true" />Yandex Maps</a>
          <a href={openStreetMap} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-osm" aria-hidden="true" />OpenStreetMap</a>
        </nav>
      </div>
      <details className="shilla-location-directions">
        <summary>Yo‘l va transport ma’lumotlari<ChevronRight size={18} strokeWidth={1} /></summary>
        <div className="shilla-location-directions-content">
          <p>Amir Temur shoh ko‘chasi bo‘yida — aeroportga 20 daqiqa, metro va biznes markazlariga piyoda masofada.</p>
          <p>Qabulxona 24 soat, haftasiga 7 kun ishlaydi. Yo‘l bo‘yicha yordam uchun <a href="tel:+998712002020">+998 71 200 20 20</a> raqamiga murojaat qiling.</p>
          <a className="shilla-directions-link" href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noreferrer">Yo‘nalishni xaritada ochish<ArrowUpRight size={17} /></a>
        </div>
      </details>
      <div className="shilla-location-map">
        <iframe
          title="Origin Hotel xaritasi"
          src="https://www.openstreetmap.org/export/embed.html?bbox=69.26%2C41.29%2C69.30%2C41.33&layer=mapnik&marker=41.3111%2C69.2797"
          loading="lazy"
        />
        <a href={openStreetMap} target="_blank" rel="noreferrer" className="shilla-location-map-open">Xaritani kattalashtirish<ArrowUpRight size={17} /></a>
      </div>
      <div className="shilla-location-contact">
        <a href="mailto:reservations@originhotel.uz"><Mail size={16} />reservations@originhotel.uz</a>
        <span><Clock size={16} />Qabulxona: 24/7</span>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────── */
function CTA() {
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative isolate overflow-hidden bg-[--ink] text-white">
      <img
        src={IMAGES.presidential}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[--ink] via-[#0e1417cc] to-[#0e141788]" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
        <div className="max-w-2xl anim-fade-up">
          <h2 className="font-display text-3xl leading-tight lg:text-4xl">
            Keyingi tashrifingizni bugun rejalashtiring
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            Sanalar band bo'lib qolmasidan oldin xonangizni band qiling —
            tasdiqlash odatda 30 daqiqa ichida keladi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 anim-fade-up">
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 rounded-full bg-[--champagne] px-6 py-3.5 text-xs font-bold text-[--ink] transition hover:bg-white"
          >
            Bog'lanish
            <ArrowRight size={14} />
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-xs font-bold text-white transition hover:border-[--champagne] hover:text-[--champagne]"
          >
            Boshqaruv tizimi
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { href: '#rooms',   label: 'Xonalar' },
    { href: '#about',   label: 'Biz haqimizda' },
    { href: '#gallery', label: 'Galereya' },
    { href: '#reviews', label: 'Fikrlar' },
    { href: '#contact', label: 'Aloqa' },
  ];

  return (
    <footer className="border-t border-[--line] bg-[--surface]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--champagne]">
              <Hotel size={16} className="text-[--ink]" />
            </div>
            <span className="font-bold">Origin Hotel</span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-6 text-muted-foreground">
            Toshkent markazidagi 5 yulduzli mehmonxona. Haqiqiy mehmondo'stlik
            va zamonaviy qulaylik maskani.
          </p>
          <p className="font-display mt-5 text-3xl text-foreground">
            4.9
            <span className="ml-2 text-xs font-normal text-muted-foreground">Mehmon reytingi</span>
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Sayt bo'limlari">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">Bo'limlar</p>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-xs text-muted-foreground transition hover:text-[--champagne]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact info */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">Aloqa</p>
          <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
            <li>Amir Temur shoh ko'chasi 15</li>
            <li>Toshkent 100000, O'zbekiston</li>
            <li className="pt-1">
              <a href="tel:+998712002020" className="hover:text-[--champagne] transition-colors">
                +998 71 200 20 20
              </a>
            </li>
            <li>
              <a href="mailto:reservations@originhotel.uz" className="hover:text-[--champagne] transition-colors">
                reservations@originhotel.uz
              </a>
            </li>
          </ul>
        </div>

        {/* Admin CTA */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">Boshqaruv</p>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Mehmonxona xodimlari va administratorlar uchun boshqaruv paneli.
          </p>
          <Link
            to="/admin"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[--line] bg-[--page] px-4 py-2.5 text-xs font-semibold transition hover:border-[--champagne] hover:text-[--champagne]"
          >
            Boshqaruv tizimiga kirish
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[--line] px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>© {year} Origin Hotel. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4">
            <span className="cursor-default hover:text-[--champagne] transition-colors">Maxfiylik siyosati</span>
            <span className="cursor-default hover:text-[--champagne] transition-colors">Foydalanish shartlari</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Quick Dock ─────────────────────────────────────────── */
function QuickDock() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <nav aria-label="Tezkor amallar" className="hotel-quick-dock">
      <Link to="/admin" className="hotel-dock-account">
        <BedDouble size={15} />
        <span>Boshqaruv</span>
      </Link>
      <button type="button" onClick={scrollToTop} aria-label="Sahifa boshiga" title="Yuqoriga">
        <ChevronUp size={16} />
      </button>
    </nav>
  );
}

/* ─── LandingPage (root) ─────────────────────────────────── */
export default function LandingPage() {
  const [searchSummary, setSearchSummary] = useState('');

  useScrollProgress();
  useScrollAnimate();

  return (
    <div className="marketing-page hotel-marketing shilla-site">
      {/* Scroll progress bar */}
      <div className="marketing-progress" aria-hidden />

      <Navbar />

      <main>
        <ReservationBar onSearch={setSearchSummary} />
        <Hero />
        <Ticker />
        <Rooms searchSummary={searchSummary} />
        <Dining />
        <Experiences />
        <Contact />
        <About />
        <Gallery />
        <Reviews />
        <CTA />
      </main>

      <Footer />
      <QuickDock />
    </div>
  );
}
