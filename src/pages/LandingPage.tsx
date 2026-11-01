import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/HotelNavbar';
import ReservationBar from '@/components/layout/ReservationBar';
import HotelInformationDialog from '@/components/layout/HotelInformationDialog';
import type { HotelInfoKey } from '@/data/hotelInformation';
import qarshiClockTower from '@/assets/qarshi-hero/01-qarshi-soat-minorasi.webp';
import qarshiMosque from '@/assets/qarshi-hero/02-qarshi-masjid.webp';
import qarshiCenter from '@/assets/qarshi-hero/03-qarshi-markaz.webp';
import {
  MapPin,
  Hotel,
  Mail,
  X,
  Clock,
  ChevronUp,
  BedDouble,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Tickets,
  Coffee,
  Gift,
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

function formatPrice(n: number) {
  return n.toLocaleString('uz-UZ') + ' so\'m';
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

// City photographs are used only here; room and service imagery stays separate.
const HERO_SLIDES = [
  { src: qarshiClockTower, alt: 'Qarshi shahri — soat minorasi va shahar manzarasi', position: '68% center' },
  { src: qarshiMosque, alt: 'Qarshi shahri — moviy gumbazli tarixiy bino va yashil xiyobon', position: 'center' },
  { src: qarshiCenter, alt: 'Qarshi shahri — markaziy maydon, favvora va keng ko‘chalar', position: '35% center' },
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
    <section className="shilla-hero" aria-label="Qarshi shahri manzaralari" aria-roledescription="slayder">
      {HERO_SLIDES.map((photo, index) => <img key={photo.src} src={photo.src} alt={photo.alt} aria-hidden={index !== slide} className={index === slide ? 'is-active' : ''} style={{ objectPosition: photo.position }} fetchPriority={index === 0 ? 'high' : 'auto'} />)}
      <h1 className="sr-only">Origin Hotel — Har bir lahza unutilmas taassurot</h1>
      <div className="shilla-mobile-hero-copy"><h2>Qarshida unutilmas hordiq</h2><p>Origin Hotel’da shinam xonalar va samimiy xizmatdan bahramand bo‘ling.</p></div>
      <div className="shilla-mobile-hero-dots">{HERO_SLIDES.map((photo, index) => <button type="button" key={photo.src} aria-label={`${index + 1}-hero suratini ko‘rsatish`} aria-pressed={index === slide} onClick={() => setSlide(index)} />)}</div>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    closeRef.current?.focus({ preventScroll: true });
    const fn = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', fn);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>(window.matchMedia('(max-width: 767px)').matches ? '.shilla-mobile-toggle' : '#hotel-nav-trigger-2')?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      className="gallery-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="room-detail-title" className="relative bg-[--page] rounded-3xl overflow-hidden max-w-lg w-full mx-4 shadow-2xl">
        <img src={room.image} alt={room.label} className="h-52 w-full object-cover" />
        <button
          ref={closeRef}
          type="button"
          aria-label="Xona tafsilotlarini yopish"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[--ink]/60 p-2 text-white hover:bg-[--ink] transition"
        >
          <X size={16} />
        </button>
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">{room.label}</p>
          <h3 id="room-detail-title" className="font-display mt-1 text-2xl">{room.label} Xona</h3>
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

function Rooms({ searchSummary, selected, onSelect, onInfo }: {
  searchSummary: string;
  selected: typeof ROOM_DATA[0] | null;
  onSelect: (room: typeof ROOM_DATA[0] | null) => void;
  onInfo: (key: HotelInfoKey, triggerId: string) => void;
}) {
  const [mobileTab, setMobileTab] = useState<'rooms' | 'services'>('rooms');
  const services: { key: HotelInfoKey; title: string; image: string }[] = [
    { key: 'pool', title: 'Basseyn va hordiq', image: IMAGES.pool },
    { key: 'spa', title: 'SPA', image: IMAGES.spa },
    { key: 'fitness', title: 'Fitnes zali', image: IMAGES.gym },
  ];
  return (
    <section id="rooms" className="shilla-packages">
      <div className="shilla-packages-heading">
        <h2 tabIndex={-1}>XONALAR</h2>
        <p>Har bir sayohatga mos xona.</p>
        <a href="#experiences">Barcha suratlar <ChevronRight size={17} strokeWidth={1} /></a>
      </div>
      {searchSummary && <p role="status" className="shilla-search-summary">{searchSummary}</p>}
      <div className="shilla-mobile-offers">
        <div className="shilla-mobile-section-heading"><h2 tabIndex={-1}>TAKLIFLAR</h2><a href="#experiences" aria-label="Barcha suratlarni ko‘rish"><ChevronRight size={24} strokeWidth={1} /></a></div>
        <div className="shilla-mobile-offer-tabs" role="group" aria-label="Taklif turi"><button type="button" aria-pressed={mobileTab === 'rooms'} onClick={() => setMobileTab('rooms')}>XONALAR</button><button type="button" aria-pressed={mobileTab === 'services'} onClick={() => setMobileTab('services')}>XIZMATLAR</button></div>
        {mobileTab === 'rooms' ? <>
          <article className="shilla-mobile-featured-offer"><button type="button" onClick={() => onSelect(ROOM_DATA[0])} aria-label="Standart xonani ko‘rish"><img src={ROOM_DATA[0].image} alt="Standart xona" loading="lazy" /><h3>Standart xona va nonushta</h3></button><p>{formatPrice(ROOM_DATA[0].price)} / tun <span>Origin Hotel</span></p></article>
          <div className="shilla-mobile-offer-track" tabIndex={0} role="region" aria-label="Boshqa xonalar, yon tomonga suring">{ROOM_DATA.slice(1).map((room) => <article key={room.type}><button type="button" onClick={() => onSelect(room)} aria-label={`${room.label} xonani ko‘rish`}><img src={room.image} alt={`${room.label} xona`} loading="lazy" /><h3>{room.label} Xona</h3></button><p>{formatPrice(room.price)} / tun</p></article>)}</div>
        </> : <>
          <article className="shilla-mobile-featured-offer"><button id="mobile-offer-service-pool" type="button" onClick={() => onInfo('pool', 'mobile-offer-service-pool')}><img src={IMAGES.pool} alt="Basseyn va dam olish hududi" loading="lazy" /><h3>Basseyn va hordiq</h3></button><p>Mehmonxona qulayliklari <span>Origin Hotel</span></p></article>
          <div className="shilla-mobile-offer-track" tabIndex={0} role="region" aria-label="Mehmonxona xizmatlari, yon tomonga suring">{services.slice(1).map((service) => <article key={service.key}><button id={`mobile-offer-service-${service.key}`} type="button" onClick={() => onInfo(service.key, `mobile-offer-service-${service.key}`)}><img src={service.image} alt={service.title} loading="lazy" /><h3>{service.title}</h3></button><p>Origin Hotel</p></article>)}</div>
        </>}
      </div>
      <div className="shilla-packages-grid">{ROOM_DATA.map((room) => <RoomCard key={room.type} room={room} onBook={onSelect} />)}</div>
      {selected && <RoomDetailModal room={selected} onClose={() => onSelect(null)} />}
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

function Dining({ selection }: { selection: { index: number; request: number } | null }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (!selection) return;
    const frame = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      const card = track?.children[selection.index] as HTMLElement | undefined;
      if (track && first && card) track.scrollTo({
        left: card.offsetLeft - first.offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selection]);

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
          {DINING_CARDS.map((card, index) => (
            <article id={`dining-card-${index}`} key={card.title} className="shilla-dining-card">
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

function Experiences({ activeSlide, onSlideChange }: { activeSlide: number; onSlideChange: (index: number) => void }) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (direction: number) => onSlideChange((activeSlide + direction + EXPERIENCE_SLIDES.length) % EXPERIENCE_SLIDES.length);

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
              <div className="shilla-mobile-experience-copy"><h3>{slide.title}</h3><p>{slide.description}</p></div>
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
      <div className="shilla-mobile-experience-progress">{EXPERIENCE_SLIDES.map((item, index) => <button type="button" key={item.title} aria-label={`${index + 1}-taassurotni ko‘rsatish`} aria-pressed={activeSlide === index} onClick={() => onSlideChange(index)} />)}</div>
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
      <details id="transport-details" className="shilla-location-directions">
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
  const benefits = [
    { icon: Tickets, title: 'Xonalar tanlovi', description: 'Standart, Deluxe, Suite va Presidential — sayohatingizga mos xona.' },
    { icon: Coffee, title: 'Nonushta va restoran', description: 'Xona turiga mos nonushta va shved stoli, mehmonxona restorani.' },
    { icon: Gift, title: 'Qulaylik va xizmat', description: 'Basseyn, SPA, fitnes zali va kechayu kunduz ishlaydigan qabulxona.' },
  ];

  return (
    <section id="benefits" className="shilla-benefits" aria-labelledby="benefits-title">
      <div className="shilla-benefits-intro">
        <h2 id="benefits-title">Origin Hotel</h2>
        <p>Keyingi tashrifingizni bugun rejalashtiring. Shinam xonalar, samimiy xizmat va barcha qulayliklar sizni kutmoqda.</p>
        <div className="shilla-benefits-actions">
          <a href="#rooms">Batafsil</a>
          <Link to="/login">Kirish</Link>
        </div>
      </div>
      <div className="shilla-benefits-grid">
        {benefits.map(({ icon: Icon, title, description }) => (
          <article key={title} className="shilla-benefit-card">
            <div className="shilla-benefit-icon" aria-hidden="true"><Icon size={66} strokeWidth={.9} /></div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { href: '#benefits', label: 'Biz haqimizda' },
    { href: '#contact', label: 'Joylashuv' },
    { href: '#rooms', label: 'Xonalar' },
    { href: '#dining', label: 'Restoran' },
    { href: '#experiences', label: 'Galereya' },
  ];

  return (
    <footer className="shilla-footer">
      <nav className="shilla-footer-brands" aria-label="Origin Hotel xizmatlari">
        <Link to="/">ORIGIN HOTEL</Link>
        <a href="#dining">RESTORAN & HORDIQ</a>
        <a href="#contact">24/7 QABULXONA</a>
      </nav>
      <div className="shilla-footer-main">
        <Link to="/" className="shilla-footer-wordmark" aria-label="Origin Hotel — bosh sahifa"><span>ORIGIN HOTEL</span><small>TOSHKENT</small></Link>
        <div className="shilla-footer-address">
          <p><strong>Origin Hotel</strong><span className="shilla-footer-divider" aria-hidden="true" /><span>Amir Temur shoh ko‘chasi 15, Toshkent 100000, O‘zbekiston</span></p>
          <p><a href="tel:+998712002020">TEL. +998 71 200 20 20</a><a href="mailto:reservations@originhotel.uz">reservations@originhotel.uz</a></p>
        </div>
        <nav className="shilla-footer-links" aria-label="Sayt bo‘limlari">
          <div className="shilla-footer-link-row">
            {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            <Link to="/login">Kirish</Link>
          </div>
          <div className="shilla-footer-link-row shilla-footer-secondary">
            <Link to="/admin">Boshqaruv tizimi</Link>
            <span className="shilla-footer-policy">Maxfiylik siyosati</span>
            <span>Foydalanish shartlari</span>
          </div>
        </nav>
        <div className="shilla-footer-bottom">
          <div className="shilla-footer-legal">
            <p>Origin Hotel · Amir Temur shoh ko‘chasi 15, Toshkent 100000 · Qabulxona: 24/7</p>
            <div className="shilla-footer-social-icons">
              <span role="img" aria-label="Instagram"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" /></svg></span>
              <span role="img" aria-label="Facebook" className="shilla-footer-facebook"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 22v-9h3l.5-3H14V8c0-1 .3-1.5 1.5-1.5H18V3h-3c-3 0-5 1.8-5 5v2H7v3h3v9z" /></svg></span>
            </div>
          </div>
          <div className="shilla-footer-feature">
            <span aria-hidden="true"><Hotel size={28} strokeWidth={1.2} /></span>
            <div><p>Origin Hotel — Toshkent</p><p>Shinam xonalar, restoran va dam olish qulayliklari.</p></div>
          </div>
          <p className="shilla-footer-copyright">© {year} Origin Hotel. Barcha huquqlar himoyalangan.</p>
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
  const pageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const parts = [
      ['.shilla-header', '--intro-header-height'],
      ['.shilla-reservation', '--intro-booking-height'],
      ['.hotel-ticker', '--intro-ticker-height'],
    ] as const;
    const measure = () => {
      for (const [selector, variable] of parts) {
        const element = page.querySelector(selector);
        if (element) page.style.setProperty(variable, `${element.getBoundingClientRect().height}px`);
      }
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    for (const [selector] of parts) {
      const element = page.querySelector(selector);
      if (element) observer?.observe(element);
    }
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const [searchSummary, setSearchSummary] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOM_DATA[0] | null>(null);
  const [experienceSlide, setExperienceSlide] = useState(0);
  const [selectedInfo, setSelectedInfo] = useState<{ key: HotelInfoKey; triggerId: string } | null>(null);
  const [diningSelection, setDiningSelection] = useState<{ index: number; request: number } | null>(null);

  useScrollProgress();

  return (
    <div ref={pageRef} className="marketing-page hotel-marketing shilla-site">
      {/* Scroll progress bar */}
      <div className="marketing-progress" aria-hidden />

      <Navbar onRoomSelect={(type) => setSelectedRoom(ROOM_DATA.find((room) => room.type === type) ?? null)} onInfoSelect={(key, triggerId) => setSelectedInfo({ key, triggerId })} onExperienceSelect={setExperienceSlide} onDiningSelect={(index) => setDiningSelection((previous) => ({ index, request: (previous?.request ?? 0) + 1 }))} />

      <main>
        <ReservationBar onSearch={setSearchSummary} />
        <Hero />
        <Ticker />
        <Rooms searchSummary={searchSummary} selected={selectedRoom} onSelect={setSelectedRoom} onInfo={(key, triggerId) => setSelectedInfo({ key, triggerId })} />
        <Dining selection={diningSelection} />
        <Experiences activeSlide={experienceSlide} onSlideChange={setExperienceSlide} />
        <Contact />
        <CTA />
      </main>

      <Footer />
      <QuickDock />
      {selectedInfo && <HotelInformationDialog selection={selectedInfo} onClose={() => setSelectedInfo(null)} />}
    </div>
  );
}
