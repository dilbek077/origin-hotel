import { LoadingImage } from '@/components/ui/loading-image';
import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/HotelNavbar';
import ReservationBar from '@/components/layout/ReservationBar';
import HotelEvents from '@/components/layout/HotelEvents';
import HotelInformationDialog from '@/components/layout/HotelInformationDialog';
import type { HotelInfoKey } from '@/data/hotelInformation';
import { HOTEL_PHOTOS, HOTEL_ROOM_DETAIL_PHOTOS } from '@/data/hotelPhotos';
import qarshiClockTower from '@/assets/qarshi-hero/01-qarshi-soat-minorasi.webp';
import qarshiMosque from '@/assets/qarshi-hero/02-qarshi-masjid.webp';
import qarshiCenter from '@/assets/qarshi-hero/03-qarshi-markaz.webp';
import hotelHeroFacade from '@/assets/qarshi-hero/04-origin-hotel-facade.webp';
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
  exterior:   HOTEL_PHOTOS.exterior,
  lobby:      HOTEL_PHOTOS.galleryCorridor,
  standard:   HOTEL_PHOTOS.twinRoom,
  deluxe:     HOTEL_PHOTOS.doubleRoom,
  suite:      HOTEL_PHOTOS.singleRoom,
  family:     HOTEL_PHOTOS.twinRoom,
  presidential: HOTEL_PHOTOS.presidentialRoom,
  pool:       HOTEL_PHOTOS.mobilePool,
  spa:        HOTEL_PHOTOS.mobileSpa,
  restaurant: HOTEL_PHOTOS.diningMain,
  gym:        HOTEL_PHOTOS.mobileFitness,
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

// Hero photographs stay separate from the room and service image assignments.
const HERO_SLIDES = [
  { src: qarshiClockTower, alt: 'Qarshi shahri — soat minorasi va shahar manzarasi', position: '68% center' },
  { src: hotelHeroFacade, alt: 'Origin Hotel — ko‘k oynali fasad va mehmonxona kirishi', position: 'center 40%' },
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
    <L.section className="shilla-hero" aria-label="Origin Hotel va Qarshi manzaralari" aria-roledescription="slayder">
      {HERO_SLIDES.map((photo, index) => <LoadingImage key={photo.src} src={photo.src} alt={photo.alt} aria-hidden={index !== slide} className={index === slide ? 'is-active' : ''} style={{ objectPosition: photo.position }} fetchPriority={index === 0 ? 'high' : 'auto'} />)}
      <L.h1 className="sr-only">Origin Hotel — Har bir lahza unutilmas taassurot</L.h1>
      <L.div className="shilla-mobile-hero-copy"><L.h2>Qarshida unutilmas hordiq</L.h2><L.p>Origin Hotel’da shinam xonalar va samimiy xizmatdan bahramand bo‘ling.</L.p></L.div>
      <L.div className="shilla-mobile-hero-dots">{HERO_SLIDES.map((photo, index) => <L.button type="button" key={photo.src} aria-label={`${index + 1}-hero suratini ko‘rsatish`} aria-pressed={index === slide} onClick={() => setSlide(index)} />)}</L.div>
      <L.div className="shilla-slider-controls">
        <L.div className="shilla-slide-progress" aria-label={`${slide + 1} / ${HERO_SLIDES.length}`}><L.span style={{ width: `${((slide + 1) / HERO_SLIDES.length) * 100}%` }} /></L.div>
        <L.button type="button" aria-label={paused ? 'Slayderni davom ettirish' : 'Slayderni to‘xtatish'} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</L.button>
        <L.button type="button" aria-label="Oldingi surat" onClick={() => nextSlide(-1)}><ChevronLeft size={25} strokeWidth={1} /></L.button>
        <L.button type="button" aria-label="Keyingi surat" onClick={() => nextSlide(1)}><ChevronRight size={25} strokeWidth={1} /></L.button>
      </L.div>
    </L.section>
  );
}

/* ─── Ticker ─────────────────────────────────────────────── */
function Ticker() {
  return (
    <L.div className="hotel-ticker" role="region" aria-label="Origin Hotel — Toshkent. Qulaylik va nafosat. Unutilmas hordiq.">
      <L.div className="hotel-ticker-track" aria-hidden="true">
        {[0, 1].map((group) => (
          <L.div className="hotel-ticker-group" key={group}>
            {[0, 1].map((copy) => (
              <L.span key={copy}>
                ORIGIN HOTEL <L.i>✦</L.i> TOSHKENT <L.i>✦</L.i> QULAYLIK VA NAFOSAT{' '}
                <L.i>✦</L.i> UNUTILMAS HORDIQ <L.i>✦</L.i>
              </L.span>
            ))}
          </L.div>
        ))}
      </L.div>
    </L.div>
  );
}

/* ─── Rooms ──────────────────────────────────────────────── */
function RoomCard({ room, onBook }: { room: typeof ROOM_DATA[0]; onBook: (room: typeof ROOM_DATA[0]) => void }) {
  return (
    <L.article className="shilla-package-card">
      <L.button type="button" className="shilla-package-image" onClick={() => onBook(room)} aria-label={`${room.label} xonani ko‘rish`}>
        <LoadingImage src={room.image} alt={`${room.label} xona`} loading="lazy" decoding="async" />
      </L.button>
      <L.h3><L.button type="button" onClick={() => onBook(room)}>{room.label} Xona</L.button></L.h3>
      <L.p>{room.description}</L.p>
      <L.p className="shilla-package-features">{room.features.slice(0, 2).join(' · ')}</L.p>
      <L.p className="shilla-package-price">{formatPrice(room.price)} / tun · {room.size} · {room.capacity} kishi</L.p>
    </L.article>
  );
}

function RoomDetailModal({
  room,
  onClose,
}: {
  room: typeof ROOM_DATA[0];
  onClose: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(room.image);
  const photos = [room.image, ...(HOTEL_ROOM_DETAIL_PHOTOS[room.type] ?? [])];
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
    <L.div
      className="gallery-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <L.div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="room-detail-title" className="hotel-room-detail relative bg-[--page] rounded-3xl overflow-hidden max-w-lg w-full mx-4 shadow-2xl">
        <LoadingImage src={activePhoto} alt="Origin Hotel surati" className="hotel-room-main-photo h-52 w-full object-cover" />
        <L.div className="hotel-room-photo-thumbs" role="group" aria-label="Mehmonxonaning boshqa suratlari">{photos.filter((photo) => photo !== activePhoto).map((photo) => <L.button type="button" key={photo} aria-label={`${photos.indexOf(photo) + 1}-xona suratini ko‘rsatish`} onClick={() => setActivePhoto(photo)}><LoadingImage src={photo} alt="" loading="lazy" /></L.button>)}</L.div>
        <L.button
          ref={closeRef}
          type="button"
          aria-label="Xona tafsilotlarini yopish"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[--ink]/60 p-2 text-white hover:bg-[--ink] transition"
        >
          <X size={16} />
        </L.button>
        <L.div className="p-6">
          <L.p className="text-[10px] font-bold uppercase tracking-[.2em] text-[--champagne]">{room.label}</L.p>
          <L.h3 id="room-detail-title" className="font-display mt-1 text-2xl">{room.label} Xona</L.h3>
          <L.p className="mt-3 text-sm leading-6 text-muted-foreground">{room.description}</L.p>

          <L.div className="mt-4 grid grid-cols-2 gap-2">
            {room.features.map((f) => (
              <L.div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <L.span className="h-1.5 w-1.5 rounded-full bg-[--champagne]" />
                {f}
              </L.div>
            ))}
          </L.div>

          <L.div className="mt-5 flex items-center justify-between border-t border-[--line] pt-4">
            <L.div>
              <L.p className="text-[10px] text-muted-foreground">Tunlik narx</L.p>
              <L.p className="text-lg font-bold text-[--champagne]">{formatPrice(room.price)}</L.p>
            </L.div>
            <L.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="rounded-full bg-[--champagne] px-5 py-2.5 text-xs font-bold text-[--ink] hover:bg-white transition"
            >
              Bog'lanish
            </L.a>
          </L.div>
        </L.div>
      </L.div>
    </L.div>
  );
}

function Rooms({ searchSummary, selected, onSelect, onInfo }: {
  searchSummary: string;
  selected: typeof ROOM_DATA[0] | null;
  onSelect: (room: typeof ROOM_DATA[0] | null) => void;
  onInfo: (key: HotelInfoKey, triggerId: string) => void;
}) {
  const [mobileTab, setMobileTab] = useState<'rooms' | 'services'>('rooms');
  const services: { key: HotelInfoKey; title: string; image: string; imageAlt: string }[] = [
    { key: 'pool', title: 'Basseyn va hordiq', image: IMAGES.pool, imageAlt: 'Origin Hotel tashqi ko‘rinishi' },
    { key: 'spa', title: 'SPA', image: IMAGES.spa, imageAlt: 'Origin Hotel interyeridagi yoritgich' },
    { key: 'fitness', title: 'Fitnes zali', image: IMAGES.gym, imageAlt: 'Origin Hotel ichki yo‘lagi' },
  ];
  return (
    <L.section id="rooms" className="shilla-packages">
      <L.div className="shilla-packages-heading">
        <L.h2 tabIndex={-1}>XONALAR</L.h2>
        <L.p>Har bir sayohatga mos xona.</L.p>
        <L.a href="#experiences">Barcha suratlar <ChevronRight size={17} strokeWidth={1} /></L.a>
      </L.div>
      {searchSummary && <L.p role="status" className="shilla-search-summary">{searchSummary}</L.p>}
      <L.div className="shilla-mobile-offers">
        <L.div className="shilla-mobile-section-heading"><L.h2 tabIndex={-1}>TAKLIFLAR</L.h2><L.a href="#experiences" aria-label="Barcha suratlarni ko‘rish"><ChevronRight size={24} strokeWidth={1} /></L.a></L.div>
        <L.div className="shilla-mobile-offer-tabs" role="group" aria-label="Taklif turi"><L.button type="button" aria-pressed={mobileTab === 'rooms'} onClick={() => setMobileTab('rooms')}>XONALAR</L.button><L.button type="button" aria-pressed={mobileTab === 'services'} onClick={() => setMobileTab('services')}>XIZMATLAR</L.button></L.div>
        {mobileTab === 'rooms' ? <>
          <L.article className="shilla-mobile-featured-offer"><L.button type="button" onClick={() => onSelect(ROOM_DATA[0])} aria-label="Standart xonani ko‘rish"><LoadingImage src={ROOM_DATA[0].image} alt="Standart xona" loading="lazy" /><L.h3>Standart xona va nonushta</L.h3></L.button><L.p>{formatPrice(ROOM_DATA[0].price)} / tun <L.span>Origin Hotel</L.span></L.p></L.article>
          <L.div className="shilla-mobile-offer-track" tabIndex={0} role="region" aria-label="Boshqa xonalar, yon tomonga suring">{ROOM_DATA.slice(1).map((room) => <L.article key={room.type}><L.button type="button" onClick={() => onSelect(room)} aria-label={`${room.label} xonani ko‘rish`}><LoadingImage src={room.image} alt={`${room.label} xona`} loading="lazy" /><L.h3>{room.label} Xona</L.h3></L.button><L.p>{formatPrice(room.price)} / tun</L.p></L.article>)}</L.div>
        </> : <>
          <L.article className="shilla-mobile-featured-offer"><L.button id="mobile-offer-service-pool" type="button" onClick={() => onInfo('pool', 'mobile-offer-service-pool')}><LoadingImage src={IMAGES.pool} alt="Origin Hotel tashqi ko‘rinishi" loading="lazy" /><L.h3>Basseyn va hordiq</L.h3></L.button><L.p>Mehmonxona qulayliklari <L.span>Origin Hotel</L.span></L.p></L.article>
          <L.div className="shilla-mobile-offer-track" tabIndex={0} role="region" aria-label="Mehmonxona xizmatlari, yon tomonga suring">{services.slice(1).map((service) => <L.article key={service.key}><L.button id={`mobile-offer-service-${service.key}`} type="button" onClick={() => onInfo(service.key, `mobile-offer-service-${service.key}`)}><LoadingImage src={service.image} alt={service.imageAlt} loading="lazy" /><L.h3>{service.title}</L.h3></L.button><L.p>Origin Hotel</L.p></L.article>)}</L.div>
        </>}
      </L.div>
      <L.div className="shilla-packages-grid">{ROOM_DATA.map((room) => <RoomCard key={room.type} room={room} onBook={onSelect} />)}</L.div>
      {selected && <RoomDetailModal room={selected} onClose={() => onSelect(null)} />}
    </L.section>
  );
}

const DINING_CARDS = [
  {
    title: 'Restoran',
    description: 'Origin Hotel restorani va shinam muhit.',
    image: HOTEL_PHOTOS.diningFirst,
    alt: 'Origin Hotel restoran zali',
  },
  {
    title: 'Bepul nonushta',
    description: 'Standart xona qulayliklari qatorida bepul nonushta.',
    image: HOTEL_PHOTOS.diningBreakfast,
    alt: 'Origin Hotel restoranidagi stol va o‘rindiqlar',
  },
  {
    title: 'Shved stoli',
    description: 'Deluxe xona mehmonlari uchun shved stoli.',
    image: HOTEL_PHOTOS.diningBuffet,
    alt: 'Origin Hotel restoranining boshqa ko‘rinishi',
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
    <L.section id="dining" className="shilla-dining" aria-labelledby="dining-title">
      <L.div className="shilla-dining-intro">
        <L.h2 id="dining-title">RESTORAN</L.h2>
        <L.p>Origin Hotel restorani, nonushta va shved stoli bilan yoqimli dam oling.</L.p>
        <LoadingImage
          className="shilla-dining-main-image"
          src={IMAGES.restaurant}
          alt="Origin Hotel restoran zali"
          loading="lazy"
          decoding="async"
        />
      </L.div>
      <L.div className="shilla-dining-gallery">
        <L.div
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
            <L.article id={`dining-card-${index}`} key={card.title} className="shilla-dining-card">
              <L.a href="#contact" className="shilla-dining-image-link" aria-label={`${card.title}: bog‘lanish`}>
                <LoadingImage src={card.image} alt={card.alt} loading="lazy" decoding="async" />
              </L.a>
              <L.div className="shilla-dining-caption">
                <L.h3><L.a href="#contact">{card.title}</L.a></L.h3>
                <L.p>{card.description}</L.p>
              </L.div>
            </L.article>
          ))}
        </L.div>
        <L.div className="shilla-dining-controls">
          <L.span aria-live="polite">{String(activeCard + 1).padStart(2, '0')} / {String(DINING_CARDS.length).padStart(2, '0')}</L.span>
          <L.div>
            <L.button type="button" aria-label="Oldingi restoran kartochkasi" disabled={activeCard === 0} onClick={() => moveTo(activeCard - 1)}><ChevronLeft size={23} strokeWidth={1} /></L.button>
            <L.button type="button" aria-label="Keyingi restoran kartochkasi" disabled={activeCard === DINING_CARDS.length - 1} onClick={() => moveTo(activeCard + 1)}><ChevronRight size={23} strokeWidth={1} /></L.button>
          </L.div>
        </L.div>
      </L.div>
    </L.section>
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
    image: HOTEL_PHOTOS.galleryReception,
    alt: 'Origin Hotel qabulxonasi',
    title: 'Origin Hotel — samimiy kutib olish',
    description: 'Qabulxona kechayu kunduz ishlaydi. Tashrifingizni qulay rejalashtiring.',
  },
  {
    image: IMAGES.lobby,
    alt: 'Origin Hotel ichki yo‘lagi',
    title: 'Origin muhitini his qiling',
    description: 'Mehmonxonaning ichki muhiti va shinam yo‘laklari bilan tanishing.',
  },
];

function Experiences({ activeSlide, onSlideChange }: { activeSlide: number; onSlideChange: (index: number) => void }) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (direction: number) => onSlideChange((activeSlide + direction + EXPERIENCE_SLIDES.length) % EXPERIENCE_SLIDES.length);

  return (
    <L.section id="experiences" className="shilla-experiences" aria-labelledby="experiences-title">
      <L.div className="shilla-experiences-heading">
        <L.h2 id="experiences-title">TAASSUROTLAR</L.h2>
        <L.p>Origin Hotel’da har bir sayohatingizni unutilmas lahzalarga boyiting.</L.p>
      </L.div>
      <L.div
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
            <L.article key={slide.title} className={`shilla-experience-slide is-${position}`} aria-hidden={position !== 'active'}>
              <LoadingImage src={slide.image} alt={slide.alt} loading="lazy" decoding="async" draggable={false} />
              <L.div className="shilla-mobile-experience-copy"><L.h3>{slide.title}</L.h3><L.p>{slide.description}</L.p></L.div>
            </L.article>
          );
        })}
        <L.div className="shilla-experience-caption">
          <L.div className="shilla-experience-copy">
            <L.h2>{EXPERIENCE_SLIDES[activeSlide].title}</L.h2>
            <L.p>{EXPERIENCE_SLIDES[activeSlide].description}</L.p>
          </L.div>
          <L.div className="shilla-experience-arrows">
            <L.button type="button" aria-label="Oldingi taassurot" onClick={() => move(-1)}><ChevronLeft size={26} strokeWidth={1} /></L.button>
            <L.button type="button" aria-label="Keyingi taassurot" onClick={() => move(1)}><ChevronRight size={26} strokeWidth={1} /></L.button>
          </L.div>
        </L.div>
        <L.span className="sr-only" aria-live="polite">{activeSlide + 1} / {EXPERIENCE_SLIDES.length}: {EXPERIENCE_SLIDES[activeSlide].title}</L.span>
      </L.div>
      <L.div className="shilla-mobile-experience-progress">{EXPERIENCE_SLIDES.map((item, index) => <L.button type="button" key={item.title} aria-label={`${index + 1}-taassurotni ko‘rsatish`} aria-pressed={activeSlide === index} onClick={() => onSlideChange(index)} />)}</L.div>
    </L.section>
  );
}

/* ─── Contact ────────────────────────────────────────────── */
function Contact() {
  const address = 'Amir Temur shoh ko‘chasi 15, Toshkent 100000';
  const mapQuery = encodeURIComponent('Origin Hotel, Amir Temur shoh ko‘chasi 15, Toshkent');
  const googleMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const openStreetMap = 'https://www.openstreetmap.org/?mlat=41.3111&mlon=69.2797#map=15/41.3111/69.2797';

  return (
    <L.section id="contact" className="shilla-location" aria-labelledby="location-title">
      <L.h2 id="location-title">JOYLASHUV</L.h2>
      <L.div className="shilla-location-info">
        <L.p><L.strong>Manzil</L.strong><L.a href={googleMap} target="_blank" rel="noreferrer">{address}</L.a></L.p>
        <L.p><L.strong>Tel.</L.strong><L.a href="tel:+998712002020">+998 71 200 20 20</L.a></L.p>
        <L.nav className="shilla-map-links" aria-label="Xarita xizmatlari">
          <L.a href={googleMap} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-google" aria-hidden="true" />Google Maps</L.a>
          <L.a href={`https://yandex.com/maps/?text=${mapQuery}`} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-yandex" aria-hidden="true" />Yandex Maps</L.a>
          <L.a href={openStreetMap} target="_blank" rel="noreferrer"><MapPin size={23} className="shilla-map-osm" aria-hidden="true" />OpenStreetMap</L.a>
        </L.nav>
      </L.div>
      <L.details id="transport-details" className="shilla-location-directions">
        <L.summary>Yo‘l va transport ma’lumotlari<ChevronRight size={18} strokeWidth={1} /></L.summary>
        <L.div className="shilla-location-directions-content">
          <L.p>Amir Temur shoh ko‘chasi bo‘yida — aeroportga 20 daqiqa, metro va biznes markazlariga piyoda masofada.</L.p>
          <L.p>Qabulxona 24 soat, haftasiga 7 kun ishlaydi. Yo‘l bo‘yicha yordam uchun <L.a href="tel:+998712002020">+998 71 200 20 20</L.a> raqamiga murojaat qiling.</L.p>
          <L.a className="shilla-directions-link" href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noreferrer">Yo‘nalishni xaritada ochish<ArrowUpRight size={17} /></L.a>
        </L.div>
      </L.details>
      <L.div className="shilla-location-map">
        <L.iframe
          title="Origin Hotel xaritasi"
          src="https://www.openstreetmap.org/export/embed.html?bbox=69.26%2C41.29%2C69.30%2C41.33&layer=mapnik&marker=41.3111%2C69.2797"
          loading="lazy"
        />
        <L.a href={openStreetMap} target="_blank" rel="noreferrer" className="shilla-location-map-open">Xaritani kattalashtirish<ArrowUpRight size={17} /></L.a>
      </L.div>
      <L.div className="shilla-location-contact">
        <L.a href="mailto:reservations@originhotel.uz"><Mail size={16} />reservations@originhotel.uz</L.a>
        <L.span><Clock size={16} />Qabulxona: 24/7</L.span>
      </L.div>
    </L.section>
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
    <L.section id="benefits" className="shilla-benefits" aria-labelledby="benefits-title">
      <L.div className="shilla-benefits-intro">
        <L.h2 id="benefits-title">Origin Hotel</L.h2>
        <L.p>Keyingi tashrifingizni bugun rejalashtiring. Shinam xonalar, samimiy xizmat va barcha qulayliklar sizni kutmoqda.</L.p>
        <L.div className="shilla-benefits-actions">
          <L.a href="#rooms">Batafsil</L.a>
          <Link to="/login"><LocalizedText>Kirish</LocalizedText></Link>
        </L.div>
      </L.div>
      <L.div className="shilla-benefits-grid">
        {benefits.map(({ icon: Icon, title, description }) => (
          <L.article key={title} className="shilla-benefit-card">
            <L.div className="shilla-benefit-icon" aria-hidden="true"><Icon size={66} strokeWidth={.9} /></L.div>
            <L.h3>{title}</L.h3>
            <L.p>{description}</L.p>
          </L.article>
        ))}
      </L.div>
    </L.section>
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
    <L.footer className="shilla-footer">
      <L.nav className="shilla-footer-brands" aria-label="Origin Hotel xizmatlari">
        <Link to="/"><LocalizedText>ORIGIN HOTEL</LocalizedText></Link>
        <L.a href="#dining">RESTORAN & HORDIQ</L.a>
        <L.a href="#contact">24/7 QABULXONA</L.a>
      </L.nav>
      <L.div className="shilla-footer-main">
        <Link to="/" className="shilla-footer-wordmark" aria-label="Origin Hotel — bosh sahifa"><L.span>ORIGIN HOTEL</L.span><L.small>TOSHKENT</L.small></Link>
        <L.div className="shilla-footer-address">
          <L.p><L.strong>Origin Hotel</L.strong><L.span className="shilla-footer-divider" aria-hidden="true" /><L.span>Amir Temur shoh ko‘chasi 15, Toshkent 100000, O‘zbekiston</L.span></L.p>
          <L.p><L.a href="tel:+998712002020">TEL. +998 71 200 20 20</L.a><L.a href="mailto:reservations@originhotel.uz">reservations@originhotel.uz</L.a></L.p>
        </L.div>
        <L.nav className="shilla-footer-links" aria-label="Sayt bo‘limlari">
          <L.div className="shilla-footer-link-row">
            {links.map((link) => <L.a key={link.href} href={link.href}>{link.label}</L.a>)}
            <Link to="/login"><LocalizedText>Kirish</LocalizedText></Link>
          </L.div>
          <L.div className="shilla-footer-link-row shilla-footer-secondary">
            <Link to="/admin"><LocalizedText>Boshqaruv tizimi</LocalizedText></Link>
            <L.span className="shilla-footer-policy">Maxfiylik siyosati</L.span>
            <L.span>Foydalanish shartlari</L.span>
          </L.div>
        </L.nav>
        <L.div className="shilla-footer-bottom">
          <L.div className="shilla-footer-legal">
            <L.p>Origin Hotel · Amir Temur shoh ko‘chasi 15, Toshkent 100000 · Qabulxona: 24/7</L.p>
            <L.div className="shilla-footer-social-icons">
              <L.span role="img" aria-label="Instagram"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" /></svg></L.span>
              <L.span role="img" aria-label="Facebook" className="shilla-footer-facebook"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 22v-9h3l.5-3H14V8c0-1 .3-1.5 1.5-1.5H18V3h-3c-3 0-5 1.8-5 5v2H7v3h3v9z" /></svg></L.span>
            </L.div>
          </L.div>
          <L.div className="shilla-footer-feature">
            <L.span aria-hidden="true"><Hotel size={28} strokeWidth={1.2} /></L.span>
            <L.div><L.p>Origin Hotel — Toshkent</L.p><L.p>Shinam xonalar, restoran va dam olish qulayliklari.</L.p></L.div>
          </L.div>
          <L.p className="shilla-footer-copyright">© {year} Origin Hotel. Barcha huquqlar himoyalangan.</L.p>
        </L.div>
      </L.div>
    </L.footer>
  );
}

/* ─── Quick Dock ─────────────────────────────────────────── */
function QuickDock() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <L.nav aria-label="Tezkor amallar" className="hotel-quick-dock">
      <Link to="/admin" className="hotel-dock-account">
        <BedDouble size={15} />
        <L.span>Boshqaruv</L.span>
      </Link>
      <L.button type="button" onClick={scrollToTop} aria-label="Sahifa boshiga" title="Yuqoriga">
        <ChevronUp size={16} />
      </L.button>
    </L.nav>
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
    <L.div ref={pageRef} className="marketing-page hotel-marketing shilla-site">
      {/* Scroll progress bar */}
      <L.div className="marketing-progress" aria-hidden />

      <Navbar onRoomSelect={(type) => setSelectedRoom(ROOM_DATA.find((room) => room.type === type) ?? null)} onInfoSelect={(key, triggerId) => setSelectedInfo({ key, triggerId })} onExperienceSelect={setExperienceSlide} onDiningSelect={(index) => setDiningSelection((previous) => ({ index, request: (previous?.request ?? 0) + 1 }))} />

      <L.main>
        <ReservationBar onSearch={setSearchSummary} />
        <Hero />
        <Ticker />
        <Rooms searchSummary={searchSummary} selected={selectedRoom} onSelect={setSelectedRoom} onInfo={(key, triggerId) => setSelectedInfo({ key, triggerId })} />
        <HotelEvents />
        <Dining selection={diningSelection} />
        <Experiences activeSlide={experienceSlide} onSlideChange={setExperienceSlide} />
        <Contact />
        <CTA />
      </L.main>

      <Footer />
      <QuickDock />
      {selectedInfo && <HotelInformationDialog selection={selectedInfo} onClose={() => setSelectedInfo(null)} />}
    </L.div>
  );
}
