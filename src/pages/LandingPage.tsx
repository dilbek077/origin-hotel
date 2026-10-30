import { useEffect, useRef, useState, useCallback } from 'react';
import { StorageService } from '@/services/storage';
import { useTheme } from '@/theme';
import {
  Hotel,
  MapPin,
  Phone,
  Mail,
  Star,
  Wifi,
  UtensilsCrossed,
  ArrowRight,
  Menu,
  X,
  Car,
  Moon,
  Sun,
  Dumbbell,
  Waves,
  Clock,
  ChevronUp,
  BedDouble,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
  Shield,
  Camera,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Room as StorageRoom } from '@/types/room';
import '../landing.css';

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
  { href: '#rooms',   label: 'Xonalar' },
  { href: '#about',   label: 'Biz haqimizda' },
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

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const onNav = useCallback((href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const headerClass = [
    'marketing-header w-full',
    scrolled ? 'scrolled' : 'at-top',
  ].join(' ');

  const linkClass = scrolled
    ? 'text-sm font-medium text-foreground hover:text-[--champagne] transition-colors'
    : 'text-sm font-medium text-white/85 hover:text-[--champagne] transition-colors';

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'var(--champagne)', color: 'var(--ink)' }}
          >
            <Hotel size={18} strokeWidth={2.2} />
          </div>
          <span
            className={`font-bold text-base tracking-tight ${scrolled ? 'text-foreground' : 'text-white'}`}
          >
            Origin Hotel
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <button key={l.href} onClick={() => onNav(l.href)} className={linkClass}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTheme()}
            className={[
              'rounded-full border p-2.5 transition',
              scrolled
                ? 'border-border text-foreground hover:border-[--champagne] hover:text-[--champagne]'
                : 'border-white/30 text-white hover:border-[--champagne] hover:text-[--champagne]',
            ].join(' ')}
            aria-label="Mavzu almashtirish"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            to="/admin"
            className={[
              'hidden sm:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition',
              scrolled
                ? 'border-border text-foreground hover:border-[--champagne] hover:text-[--champagne]'
                : 'border-white/30 text-white hover:border-[--champagne] hover:text-[--champagne]',
            ].join(' ')}
          >
            Kirish
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menyu"
          >
            {open ? (
              <X size={20} className={scrolled ? 'text-foreground' : 'text-white'} />
            ) : (
              <Menu size={20} className={scrolled ? 'text-foreground' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-[--page] border-[--line] px-5 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => onNav(l.href)}
              className="text-left text-sm font-medium py-2 border-b border-[--line] last:border-0 hover:text-[--champagne] transition-colors"
            >
              {l.label}
            </button>
          ))}
          <Link to="/admin" className="text-sm font-semibold text-[--champagne] pt-1">
            Boshqaruv tizimi →
          </Link>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero({ rooms }: { rooms: StorageRoom[] }) {
  const scrollToRooms = () =>
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-[--ink] text-white">
      {/* Background */}
      <img
        src={IMAGES.exterior}
        alt="Origin Hotel"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      {/* Overlays */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[--ink] via-[#0e141799] to-[#0e141733]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0e1417cc] via-transparent to-[#0e141766]" />

      {/* Orbit decorations */}
      <div aria-hidden className="hero-orbit hero-orbit-one" />
      <div aria-hidden className="hero-orbit hero-orbit-two" />

      {/* Content */}
      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10 lg:py-32">
        <div
          className="max-w-2xl"
          style={{ animation: 'slide-up 0.8s ease both' }}
        >
          {/* Badge */}
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/85">
            <Sparkles size={12} className="text-[--champagne]" />
            Shahar markazidagi 5 yulduzli mehmonxona
          </p>

          {/* Headline */}
          <h1 className="font-display mt-6 text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-[4rem]">
            Har bir lahza —{' '}
            <span className="text-[--champagne]">unutilmas</span>{' '}
            taassurot
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Shinam xonalar, samimiy xizmat va o'zingizni uyda his qiladigan
            muhitdan bahramand bo'ling.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={scrollToRooms}
              className="inline-flex items-center gap-2 rounded-full bg-[--champagne] px-6 py-3.5 text-xs font-bold text-[--ink] transition hover:bg-white"
            >
              Xonani bron qilish
              <BedDouble size={14} />
            </button>
            <a
              href="#rooms"
              onClick={(e) => { e.preventDefault(); scrollToRooms(); }}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-xs font-bold text-white transition hover:border-[--champagne] hover:text-[--champagne]"
            >
              Xonalarni ko'rish
            </a>
          </div>

          {/* Mini stats */}
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/15 pt-7">
            <div className="flex items-center gap-3">
              <BedDouble size={18} className="text-[--champagne]" />
              <div>
                <dt className="text-[10px] uppercase tracking-[.16em] text-white/55">Xonalar</dt>
                <dd className="text-sm font-semibold">{rooms.length || 40} ta</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star size={18} className="text-[--champagne]" />
              <div>
                <dt className="text-[10px] uppercase tracking-[.16em] text-white/55">Mehmon reytingi</dt>
                <dd className="text-sm font-semibold">4.9 / 5</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[--champagne]" />
              <div>
                <dt className="text-[10px] uppercase tracking-[.16em] text-white/55">Mehmonlar xizmati</dt>
                <dd className="text-sm font-semibold">+998 71 200 20 20</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Right panel – live availability badge */}
        <div
          className="relative lg:justify-self-end w-full max-w-sm lg:max-w-none"
          style={{ animation: 'slide-up 0.9s 0.2s ease both', opacity: 0, animationFillMode: 'both' }}
        >
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-white/80">
            <span className="hotel-live-dot" />
            Hozir bron qilish mumkin
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm" style={{ background: '#ffffff10' }}>
            <p className="text-xs text-white/60 mb-4">Tezkor bron</p>
            <div className="space-y-3">
              {ROOM_DATA.slice(0, 3).map((r) => (
                <div
                  key={r.type}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:border-[--champagne]/40 transition-colors cursor-pointer"
                  onClick={scrollToRooms}
                >
                  <div>
                    <p className="font-semibold text-xs">{r.label}</p>
                    <p className="text-white/50 text-[11px]">{r.size} · {r.capacity} kishi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[--champagne] font-bold text-xs">{formatPrice(r.price)}</p>
                    <p className="text-white/40 text-[10px]">/ tun</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={scrollToContact}
              className="mt-4 w-full rounded-2xl bg-[--champagne] py-3 text-xs font-bold text-[--ink] transition hover:bg-white"
            >
              Bog'lanish
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-white/50">
            Tasdiqlash odatda 30 daqiqa ichida keladi
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Ticker ─────────────────────────────────────────────── */
function Ticker() {
  const items = [0, 1, 2, 3];
  return (
    <div className="hotel-ticker" aria-label="Mehmonxona qulayliklari" aria-hidden>
      <div className="hotel-ticker-track">
        {items.map((i) => (
          <span key={i}>
            ORIGIN HOTEL <i>✦</i> TOSHKENT <i>✦</i> QULAYLIK VA NAFOSAT{' '}
            <i>✦</i> UNUTILMAS HORDIQ <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Stats ──────────────────────────────────────────────── */
function StatCard({ value, label, suffix = '' }: { value: number | string; label: string; suffix?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const numVal = typeof value === 'number' ? value : parseFloat(String(value));

  useEffect(() => {
    if (!ref.current || isNaN(numVal)) return;
    const duration = 1200;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const cur = +(progress * numVal).toFixed(1);
      if (ref.current) ref.current.textContent = cur + suffix;
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        requestAnimationFrame((t) => step(t, t));
        io.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [numVal, suffix]);

  return (
    <div className="flex flex-col gap-1 p-4">
      <p ref={ref} className="font-display text-3xl font-semibold text-foreground">
        {numVal}{suffix}
      </p>
      <p className="text-[11px] uppercase tracking-[.14em] text-muted-foreground">{label}</p>
    </div>
  );
}

function Stats({ rooms }: { rooms: StorageRoom[] }) {
  const floors = rooms.reduce((m, r) => Math.max(m, r.floor ?? 0), 0) || 5;
  return (
    <section className="border-b border-[--line] bg-[--surface]">
      <div className="mx-auto grid max-w-[1440px] gap-2 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-12 divide-y sm:divide-y-0 sm:divide-x divide-[--line]">
        <StatCard value={rooms.length || 40} label="Xonalar soni" />
        <StatCard value={floors} label="Qavatlar" />
        <StatCard value={4.9} label="Mehmon reytingi" suffix="/5" />
        <StatCard value={98} label="Mamnun mehmonlar" suffix="%" />
      </div>
    </section>
  );
}

/* ─── Rooms ──────────────────────────────────────────────── */
function RoomCard({
  room,
  index,
  onBook,
}: {
  room: typeof ROOM_DATA[0];
  index: number;
  onBook: (r: typeof ROOM_DATA[0]) => void;
}) {
  return (
    <article
      className={`room-showcase-card surface group flex flex-col overflow-hidden rounded-3xl border border-[--line] anim-fade-up`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={room.image}
          alt={room.label}
          loading="lazy"
          decoding="async"
          className="h-full w-full bg-[--line] object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[--ink] dark:bg-[--ink]/80 dark:text-white">
          {room.size}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">
          {room.label}
        </p>
        <h3 className="font-display mt-2 text-xl">{room.label} Xona</h3>
        <p className="mt-2 text-xs leading-6 text-muted-foreground flex-1">{room.description}</p>

        {/* Features */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {room.features.slice(0, 3).map((f) => (
            <li
              key={f}
              className="rounded-full border border-[--line] px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[--line] pt-4">
          <div>
            <p className="text-[10px] text-muted-foreground">Tunlik narx</p>
            <p className="mt-0.5 text-base font-bold text-[--champagne]">{formatPrice(room.price)}</p>
          </div>
          <button
            onClick={() => onBook(room)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[--ink] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[--ink-soft] dark:bg-[--champagne] dark:text-[--ink] dark:hover:bg-white"
          >
            Batafsil
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
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

function Rooms() {
  const [selected, setSelected] = useState<typeof ROOM_DATA[0] | null>(null);

  return (
    <section id="rooms" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
      <div className="max-w-2xl anim-fade-up">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[--champagne]">
          Bizning xonalarimiz
        </p>
        <h2 className="font-display mt-3 text-4xl lg:text-5xl">Har bir sayohatga mos xona</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Standart xonadan Prezident lyuksigacha — barchasi shahar manzarasi,
          tezkor Wi-Fi va kundalik xizmat bilan jihozlangan.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ROOM_DATA.map((r, i) => (
          <RoomCard key={r.type} room={r} index={i} onBook={setSelected} />
        ))}
      </div>

      {selected && <RoomDetailModal room={selected} onClose={() => setSelected(null)} />}
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
  const contactItems = [
    { icon: MapPin, label: 'Manzil', value: 'Amir Temur shoh ko\'chasi 15, Toshkent 100000', href: 'https://maps.google.com/?q=Origin+Hotel+Tashkent' },
    { icon: Phone, label: 'Telefon', value: '+998 71 200 20 20', href: 'tel:+998712002020' },
    { icon: Mail, label: 'Email', value: 'reservations@originhotel.uz', href: 'mailto:reservations@originhotel.uz' },
    { icon: Clock, label: 'Qabulxona', value: '24 soat, 7 kun', href: undefined },
  ];

  return (
    <section id="contact" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">

        {/* Left */}
        <div className="anim-fade-up">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[--champagne]">Aloqa</p>
          <h2 className="font-display mt-3 text-4xl lg:text-5xl">
            Toshkent markazida, hamma joyga yaqin
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Amir Temur shoh ko'chasi bo'yida — aeroportga 20 daqiqa, metro va
            biznes markazlariga piyoda masofada.
          </p>

          <ul className="mt-9 space-y-4 text-sm">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[--champagne]/15 text-[--champagne]">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">
                    {label}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="mt-0.5 block font-medium hover:text-[--champagne] transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="mt-0.5 block font-medium">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Social */}
          <div className="mt-8 flex gap-3">
            {[
              { icon: Send,         href: '#', label: 'Telegram' },
              { icon: Camera,       href: '#', label: 'Instagram' },
              { icon: ExternalLink, href: '#', label: 'Facebook' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[--line] text-muted-foreground hover:border-[--champagne] hover:text-[--champagne] transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Right – map placeholder */}
        <div className="anim-fade-up relative overflow-hidden rounded-3xl border border-[--line] aspect-[4/3] bg-[--surface]">
          <iframe
            title="Origin Hotel xarita"
            src="https://www.openstreetmap.org/export/embed.html?bbox=69.26%2C41.29%2C69.30%2C41.33&layer=mapnik&marker=41.3111%2C69.2797"
            className="h-full w-full border-0"
            loading="lazy"
          />
          <a
            href="https://www.openstreetmap.org/?mlat=41.3111&mlon=69.2797#map=15/41.3111/69.2797"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[--ink] px-4 py-2 text-xs font-semibold text-white hover:bg-[--ink-soft] transition"
          >
            Xaritani ochish
            <ArrowUpRight size={12} />
          </a>
        </div>
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
  const rooms = StorageService.getRooms();

  useScrollProgress();
  useScrollAnimate();

  return (
    <div className="marketing-page">
      {/* Scroll progress bar */}
      <div className="marketing-progress" aria-hidden />

      <Navbar />

      <main>
        <Hero rooms={rooms} />
        <Ticker />
        <Stats rooms={rooms} />
        <Rooms />
        <About />
        <Gallery />
        <Reviews />
        <Contact />
        <CTA />
      </main>

      <Footer />
      <QuickDock />
    </div>
  );
}
