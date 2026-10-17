import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Hotel,
  ArrowLeft,
  Users,
  Maximize2,
  BedDouble,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Car,
  Wifi,
  Coffee,
  Check,
  Share2,
  Heart,
  X,
  ChevronLeft,
  Printer,
  ChevronDown,
  Award,
  Tv,
  Bath,
  Utensils,
  Camera,
} from 'lucide-react';
import { ROOMS } from '@/data/roomsData';
import type { Room } from '@/data/roomsData';
import { StorageService } from '@/services/storage';

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find room by id
  const room: Room | undefined = ROOMS.find((r) => r.id === Number(id));

  // Local storage booked rooms
  const [bookedRoomIds, setBookedRoomIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('origin-hotel-booked-rooms');
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  // Selected space / zone tab
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState<number>(0);

  // Fullscreen Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);

  // Interactive booking form state
  const [checkIn, setCheckIn] = useState<string>('2026-10-18');
  const [checkOut, setCheckOut] = useState<string>('2026-10-20');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);

  // Extra VIP services add-ons
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: boolean }>({
    transfer: false,
    spa: false,
    champagne: false,
    crib: false,
  });

  // Promo code
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');

  // UI interaction states
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string>('');

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Reset view on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedSpaceIndex(0);
    setBookingSuccess(false);
  }, [id]);

  useEffect(() => {
    localStorage.setItem('origin-hotel-booked-rooms', JSON.stringify(bookedRoomIds));
  }, [bookedRoomIds]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Hotel size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Xona topilmadi</h1>
        <p className="text-gray-500 text-sm max-w-md mb-6 leading-relaxed">
          Kechirasiz, siz qidirayotgan xona mavjud emas yoki nomi o‘zgargan bo‘lishi mumkin.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/25"
        >
          <ArrowLeft size={18} />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    );
  }

  const isBooked = bookedRoomIds.includes(room.id);

  // Gallery list (all spaces images + hero + gallery)
  const fullGallery: { url: string; title: string; spaceName: string }[] = [
    { url: room.image, title: room.name, spaceName: 'Umumiy ko‘rinish' },
    ...room.spaces.map((s) => ({ url: s.image, title: s.name, spaceName: s.typeLabel })),
    ...room.gallery.map((url, i) => ({ url, title: `${room.name} — Galereya ${i + 1}`, spaceName: 'Interyer' })),
  ];
  // Deduplicate gallery by URL
  const uniqueGallery = fullGallery.filter(
    (item, index, self) => index === self.findIndex((t) => t.url === item.url)
  );

  // Nights calculation
  const calculateNights = (): number => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();
  const baseRoomTotal = room.price * nights;

  // Add-on prices
  const ADDON_PRICES = {
    transfer: 250000,
    spa: 400000,
    champagne: 180000,
    crib: 0,
  };

  const addonsTotal =
    (selectedAddons.transfer ? ADDON_PRICES.transfer : 0) +
    (selectedAddons.spa ? ADDON_PRICES.spa : 0) +
    (selectedAddons.champagne ? ADDON_PRICES.champagne : 0);

  const subtotal = baseRoomTotal + addonsTotal;
  const discountAmount = Math.round(subtotal * promoDiscount);
  const finalTotalPrice = subtotal - discountAmount;

  // Handle Promo code apply
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'ORIGIN10' || code === 'VIP10') {
      setPromoDiscount(0.1);
      setPromoSuccess('«ORIGIN10» maxsus promokodi faollashtirildi! 10% chegirma taqdim etildi.');
      setToastMessage('10% chegirma muvaffaqiyatli qo‘llanildi!');
    } else if (code === 'WELCOME15') {
      setPromoDiscount(0.15);
      setPromoSuccess('«WELCOME15» promokodi faollashtirildi! 15% chegirma berildi.');
      setToastMessage('15% chegirma muvaffaqiyatli qo‘llanildi!');
    } else {
      setPromoError('Ushbu promokod yaroqsiz yoki muddati o‘tgan.');
    }
  };

  // Handle Share button
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Sahifa havolasi nusxalandi!');
    }
  };

  // Handle Phone input
  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setGuestPhone(digits ? `+${digits}` : '');
  };

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || isBooked) return;

    const refNum = `ORG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingReference(refNum);
    setBookedRoomIds((prev) => Array.from(new Set([...prev, room.id])));
    setBookingSuccess(true);

    try {
      const guest = StorageService.addGuest({
        fullName: guestName,
        phone: guestPhone,
        passport: 'AA 0000000',
        notes: `Veb-sayt orqali bron qilindi • Ref: ${refNum}`,
      });

      StorageService.addBooking({
        guestId: guest.id,
        guest: guest.fullName,
        roomId: room.id,
        room: `#${room.id}01 — ${room.name}`,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nights,
        price: finalTotalPrice,
        status: 'Kutilmoqda',
        notes: `Mehmonlar soni: ${guestCount} nafar • Tanlangan qo‘shimchalar: ${
          Object.keys(selectedAddons)
            .filter((k) => selectedAddons[k])
            .join(', ') || 'Yo‘q'
        }`,
      });
    } catch {
      // ignore
    }
  };

  const otherRooms = ROOMS.filter((r) => r.id !== room.id);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-gray-700">
          <Sparkles size={18} className="text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ─── Luxury Sticky Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Back & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-blue-600 px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200/80 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Bosh sahifaga qaytish</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Hotel size={20} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-black tracking-tight text-gray-900 leading-none">
                  Origin Hotel
                </p>
                <p className="text-[9px] uppercase tracking-widest font-semibold text-blue-600 mt-0.5">
                  Luxury Collection
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Actions & Sticky Price */}
          <div className="flex items-center gap-3">
            {/* Share & Favorite buttons */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition border border-gray-200/70 cursor-pointer"
              title="Havolani nusxalash"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => {
                setIsFavorited(!isFavorited);
                setToastMessage(
                  !isFavorited
                    ? 'Xona saralanganlar ro‘yxatiga qo‘shildi!'
                    : 'Saralanganlar ro‘yxatidan olib tashlandi'
                );
              }}
              className={`p-2.5 rounded-xl transition border cursor-pointer ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200/70'
              }`}
              title="Saralanganlarga saqlash"
            >
              <Heart size={16} className={isFavorited ? 'fill-rose-500 text-rose-500' : ''} />
            </button>

            {/* Quick Price on Header */}
            <div className="text-right hidden sm:block pl-2 border-l border-gray-200">
              <span className="text-[10px] text-gray-400 font-medium block">Bir kecha uchun</span>
              <span className="text-base font-black text-gray-900">
                {room.price.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-gray-500">so‘m</span>
              </span>
            </div>

            {/* CTA Button */}
            <a
              href="#booking-card"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={15} />
              <span>Xonani band qilish</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* ─── Room Header & Badges ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition">Bosh sahifa</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link to="/#rooms-section" className="hover:text-blue-600 transition">Xonalar katalogi</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-blue-600 font-bold">{room.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              {/* Badges line */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-xs">
                  {room.categoryLabel}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <Layers size={13} />
                  <span>{room.roomCountLabel}</span>
                </span>
                {isBooked ? (
                  <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold">
                    Band qilingan
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Hozirda bo‘sh (Mavjud)</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-bold flex items-center gap-1">
                  <Award size={13} className="text-amber-600" />
                  <span>Mehmonlar tanlovi 2026</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                {room.name}
              </h1>

              {/* Location & View tag */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-blue-600 shrink-0" />
                  <span>Toshkent markazi • {room.floor}-qavat</span>
                </span>
                <span>•</span>
                <span className="text-gray-700 font-semibold">{room.view}</span>
              </div>
            </div>

            {/* Overall Rating card */}
            <div className="flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-xs self-start lg:self-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Star size={24} className="fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-gray-900 text-base">
                  <span>5.0</span>
                  <span className="text-xs font-normal text-gray-400">/ 5.0</span>
                  <span className="text-xs font-semibold text-emerald-600 ml-1.5 bg-emerald-50 px-2 py-0.5 rounded">
                    Mukammal
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">142 ta tasdiqlangan haqiqiy sharh</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Luxury Bento Mosaic Photo Gallery ─────────────────────────────────── */}
        <section className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            {/* Big Main Hero Photo (Takes 2 cols & full height) */}
            <div
              onClick={() => {
                setLightboxPhotoIndex(0);
                setLightboxOpen(true);
              }}
              className="md:col-span-2 relative h-full overflow-hidden group cursor-pointer"
            >
              <img
                src={uniqueGallery[0]?.url || room.image}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                  Asosiy ko‘rinish
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs text-gray-300 font-medium">{room.categoryLabel} Toifasi</p>
                <h3 className="text-lg sm:text-xl font-bold">{room.name}</h3>
              </div>
            </div>

            {/* 4 Secondary Photo Tiles in 2x2 grid */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
              {uniqueGallery.slice(1, 5).map((photo, idx) => {
                const isLast = idx === 3;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxPhotoIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                    className="relative h-full overflow-hidden group cursor-pointer rounded-2xl"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[11px] font-bold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {photo.spaceName}
                      </span>
                    </div>

                    {/* View All Photos trigger on the 4th tile */}
                    {isLast && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-3 hover:bg-black/70 transition">
                        <Camera size={26} className="mb-2 text-blue-400" />
                        <span className="text-sm font-black">Barcha rasmlar</span>
                        <span className="text-[11px] text-gray-300 mt-0.5">
                          +{uniqueGallery.length} ta fotosurat
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 px-2">
            <span>Fotosuratlarni to‘liq ekranda ko‘rish uchun istalgan rasm ustiga bosing</span>
            <button
              onClick={() => {
                setLightboxPhotoIndex(0);
                setLightboxOpen(true);
              }}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera size={14} />
              <span>Galereyani ochish ({uniqueGallery.length})</span>
            </button>
          </div>
        </section>

        {/* ─── 6 Luxury Metric Badges ───────────────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Layers size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Xonalar</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Tarkibi</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">{room.roomCount} ta xona</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Maximize2 size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Maydoni</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Kvadratura</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">{room.size}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Users size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Mehmonlar</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Sig‘imi</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">{room.capacity}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <BedDouble size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">To‘shak</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Karavot</p>
            <p className="text-xs font-bold text-gray-900 mt-1 line-clamp-1" title={room.bedType}>
              {room.bedType}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Hotel size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Joylashuv</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Qavat</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">{room.floor}-qavat</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Sparkles size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Manzara</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Ko‘rinish</p>
            <p className="text-xs font-bold text-gray-900 mt-1 line-clamp-1" title={room.view}>
              {room.view}
            </p>
          </div>
        </section>

        {/* ─── Main Content Columns: Left Details & Right Booking Sidebar ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* ─── Interactive Room Spaces / Zones Walkthrough ───────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Xonadon tarkibidagi barcha xonalar va zonalari
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Ushbu {room.categoryLabel} jami <strong>{room.roomCount} ta alohida xona</strong> va <strong>{room.spaces.length} ta yashash hududi</strong>ga ega. Har bir joyning fotosuratlari va jihozlari bilan tanishing:
                </p>
              </div>

              {/* Zone Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {room.spaces.map((space, idx) => {
                  const isActive = selectedSpaceIndex === idx;
                  return (
                    <button
                      key={space.id}
                      onClick={() => setSelectedSpaceIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                          isActive ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{space.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-blue-700/60 text-blue-100' : 'bg-gray-200/70 text-gray-500'
                        }`}
                      >
                        {space.size}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Space Hero Display */}
              {room.spaces[selectedSpaceIndex] && (
                <div className="space-y-4">
                  <div
                    onClick={() => {
                      const matchIdx = uniqueGallery.findIndex(
                        (g) => g.url === room.spaces[selectedSpaceIndex].image
                      );
                      setLightboxPhotoIndex(matchIdx >= 0 ? matchIdx : 0);
                      setLightboxOpen(true);
                    }}
                    className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[420px] bg-gray-900 shadow-md group cursor-pointer"
                  >
                    <img
                      src={room.spaces[selectedSpaceIndex].image}
                      alt={room.spaces[selectedSpaceIndex].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                        {room.spaces[selectedSpaceIndex].typeLabel}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                        Maydoni: {room.spaces[selectedSpaceIndex].size}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="text-xl sm:text-2xl font-black mb-1 drop-shadow-md">
                        {room.spaces[selectedSpaceIndex].name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl drop-shadow">
                        {room.spaces[selectedSpaceIndex].description}
                      </p>
                    </div>
                  </div>

                  {/* Specific Features for this Active Space */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                      Ushbu xonaning asosiy jihozlari:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {room.spaces[selectedSpaceIndex].features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100"
                        >
                          <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ─── Full Room Story & Details ─────────────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Xonaning to‘liq tavsifi va konsepsiyasi
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {room.fullDescription}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Origin Hotel xonalari xalqaro 5 yulduzli mehmondorchilik standartlariga muvofiq jihozlangan. Ovoz izolyatsiyasi to‘liq ta’minlangan bo‘lib, shahar markazidagi sokinlik va osoyishta uyquni kafolatlaydi.
              </p>
            </section>

            {/* ─── Categorized Amenities Grid ────────────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  Qulayliklar va jihozlar ro‘yxati
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Har bir detal mehmonlarimizning mukammal hordiq chiqarishi uchun puxta o‘ylangan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Yotoq & Shinamlik */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <BedDouble size={18} className="text-blue-600" />
                    <span>Yotoq va shinamlik</span>
                  </div>
                  <ul className="space-y-2">
                    {room.amenities.comfort.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Hammom va SPA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Bath size={18} className="text-blue-600" />
                    <span>Hammom va SPA</span>
                  </div>
                  <ul className="space-y-2">
                    {room.amenities.bathroom.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Texnologiya va TV */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Tv size={18} className="text-blue-600" />
                    <span>Texnologiya va multimedia</span>
                  </div>
                  <ul className="space-y-2">
                    {room.amenities.technology.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Oshxona va xizmatlar */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Utensils size={18} className="text-blue-600" />
                    <span>Oshxona va xizmatlar</span>
                  </div>
                  <ul className="space-y-2">
                    {room.amenities.services.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ─── Real Reviews & Rating Breakdown ─────────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Mehmonlarimizning fikr va sharhlari
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Ushbu xonada yashagan 142 nafar mehmonning bahosi asosida
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/60 text-amber-800 text-xs font-bold self-start sm:self-auto">
                  <Star size={16} className="fill-amber-400 text-amber-500" />
                  <span>5.0 / 5.0 (Ajoyib)</span>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Tozalik</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Qulaylik</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Joylashuv</span>
                    <span>4.9</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Xizmat ko‘rsatish</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        JO
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Jasurbek Oripov</p>
                        <p className="text-[10px] text-gray-400">Toshkent, O‘zbekiston • Oktyabr, 2026</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    «Ushbu xonada 3 kecha turdik. Ayniqsa, karavotning qulayligi, yoritish tizimi va nonushtasi juda yoqdi. Resepshn xodimlari juda xushmuomala. 10/10 tavsiya qilaman!»
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        DK
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Dilnoza Karimova</p>
                        <p className="text-[10px] text-gray-400">Samarqand, O‘zbekiston • Sentyabr, 2026</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    «Oila bilan dam olish uchun juda ideal tanlov bo‘ldi. Katta zali keng, bolalar xonasi alohida. Jakuzi vannasi ham ajoyib darajada toza edi. Rahmat!»
                  </p>
                </div>
              </div>
            </section>

            {/* Left Column Ends */}
          </div>

          {/* ─── Right Column: Interactive Luxury Booking Card & Essential Info ──── */}
          <div className="space-y-6">
            <div
              id="booking-card"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xl space-y-5 ring-1 ring-black/5"
            >
              {/* Header: Price */}
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-5">
                <div>
                  <span className="text-[11px] text-gray-400 font-medium">1 kecha narxi</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      {room.price.toLocaleString('uz-UZ')}
                    </span>
                    <span className="text-xs text-gray-500 font-normal">so‘m</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                    {room.categoryLabel}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ Bepul nonushta bilan
                  </span>
                </div>
              </div>

              {bookingSuccess ? (
                /* VIP Booking Confirmation Receipt */
                <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Muvaffaqiyatli
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-2">
                      Xona muvaffaqiyatli band qilindi!
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Hurmatli <strong>{guestName}</strong>, buyurtmangiz tasdiqlandi. Qabulxona xodimimiz tez orada <strong>{guestPhone}</strong> raqamingizga qo‘ng‘iroq qiladi.
                    </p>
                  </div>

                  {/* Receipt breakdown */}
                  <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs text-gray-700 text-left space-y-2">
                    <div className="flex justify-between border-b border-gray-200 pb-1.5 font-bold">
                      <span>Buyurtma kodi:</span>
                      <span className="font-mono text-blue-600">{bookingReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Xona:</span>
                      <span className="font-bold">{room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Muddat:</span>
                      <span>
                        {checkIn} — {checkOut} ({nights} kecha)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mehmonlar:</span>
                      <span>{guestCount} nafar</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-200 text-sm font-black text-gray-900">
                      <span>Jami to‘lov:</span>
                      <span className="text-blue-600">{finalTotalPrice.toLocaleString('uz-UZ')} so‘m</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={14} />
                      <span>Chop etish</span>
                    </button>
                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Yangi buyurtma
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {isBooked && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5 text-rose-600" />
                      <span>Bu xona hozirda band. Boshqa sanalarga buyurtma qoldirishingiz mumkin.</span>
                    </div>
                  )}

                  {/* Dates Selection */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Kirish sanasi
                      </label>
                      <input
                        type="date"
                        required
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Chiqish sanasi
                      </label>
                      <input
                        type="date"
                        required
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Mehmonlar soni */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Mehmonlar soni
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                    >
                      {Array.from({ length: room.capacityCount || 4 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} nafar mehmon ({room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VIP Add-ons Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-700">Qo‘shimcha VIP xizmatlar:</p>

                    <label className="flex items-center justify-between p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-xs cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAddons.transfer}
                          onChange={(e) =>
                            setSelectedAddons({ ...selectedAddons, transfer: e.target.checked })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">VIP Transfer (Aeroport)</span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600">+250 000 so‘m</span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-xs cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAddons.spa}
                          onChange={(e) =>
                            setSelectedAddons({ ...selectedAddons, spa: e.target.checked })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Juftliklar SPA massaji</span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600">+400 000 so‘m</span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-xs cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAddons.champagne}
                          onChange={(e) =>
                            setSelectedAddons({ ...selectedAddons, champagne: e.target.checked })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Shampan & Meva savati</span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600">+180 000 so‘m</span>
                    </label>
                  </div>

                  {/* Promo code box */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Promokod bormi? (Masalan: ORIGIN10)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ORIGIN10"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Qo‘llash
                      </button>
                    </div>
                    {promoSuccess && (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ {promoSuccess}</p>
                    )}
                    {promoError && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-1">✗ {promoError}</p>
                    )}
                  </div>

                  {/* Guest Name & Phone */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Ism va familiyangiz
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jasur Aliyev"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Telefon raqamingiz
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 90 123 45 67"
                        value={guestPhone}
                        onChange={(e) => handlePhoneInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div className="pt-3 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span>{room.price.toLocaleString('uz-UZ')} so‘m × {nights} kecha</span>
                      <span className="font-semibold text-gray-900">{baseRoomTotal.toLocaleString('uz-UZ')} so‘m</span>
                    </div>

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Tanlangan qo‘shimcha xizmatlar:</span>
                        <span className="font-semibold">+{addonsTotal.toLocaleString('uz-UZ')} so‘m</span>
                      </div>
                    )}

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Maxsus chegirma ({promoDiscount * 100}%):</span>
                        <span>-{discountAmount.toLocaleString('uz-UZ')} so‘m</span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-600">
                      <span>Shved stoli nonushtasi:</span>
                      <span className="font-bold">Bepul</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                      <span>Jami to‘lov:</span>
                      <span className="text-blue-600 text-base">{finalTotalPrice.toLocaleString('uz-UZ')} so‘m</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isBooked}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBooked ? 'Bu xona allaqachon band qilingan' : 'Xonani hozir band qilish'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center pt-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Tezkor tasdiqlash • Oldindan to‘lov talab etilmaydi</span>
                  </div>
                </form>
              )}

              {/* Direct Hotel Reception Contact */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Savollar bormi? Resepshn bilan bog‘laning</p>
                  <p className="text-xs font-bold text-gray-900 font-mono">+998 (71) 200-00-00</p>
                </div>
              </div>
            </div>

            {/* ─── Origin VIP Eksklyuziv Imtiyozlar ────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Origin Eksklyuziv
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">
                  Har bir mehmon uchun kafolatlangan xizmatlar
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Coffee size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">VIP Shved Stoli Nonushtasi</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Restoranimizda yangi pishiriqlar, sara pishloqlar va xushbo‘y qahva har tong bepul.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Car size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Aeroportdan Qulay Transfer</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Islom Karimov nomidagi Toshkent aeroportidan premium avtomobilda kutib olish xizmati.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">24/7 Shaxsiy Xona Xizmati</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Kunning istalgan vaqtida taomlar yetkazish, kiyim parvarishi va konsyerj ko‘magi.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Wifi size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Ultra Tezkor Wi-Fi 6</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      500 Mb/s gacha shaxsiy shifrlangan optik tolali cheksiz internet aloqasi.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── Mehmonxona Qoidalari va Shartlari ──────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  Mehmonxona qoidalari
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kirish (Check-in)</p>
                  <p className="font-black text-gray-900 mt-0.5 text-base">14:00 dan</p>
                  <p className="text-[10px] text-gray-500 mt-1">24 soat resepshn faol</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chiqish (Check-out)</p>
                  <p className="font-black text-gray-900 mt-0.5 text-base">12:00 gacha</p>
                  <p className="text-[10px] text-gray-500 mt-1">Kechki chiqish imkoni</p>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Bepul bekor qilish:</strong> 24 soat oldin jarimasiz</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Users size={16} className="text-blue-600 shrink-0" />
                  <span><strong>Bolalar siyosati:</strong> 6 yoshgacha bepul joylashuv</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Car size={16} className="text-blue-600 shrink-0" />
                  <span><strong>Avtoturargoh:</strong> Mehmonlar uchun bepul qo‘riqlanadigan joy</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Sparkles size={16} className="text-amber-500 shrink-0" />
                  <span><strong>Tozalik xizmati:</strong> Har kuni to‘liq tozalash va almashtirish</span>
                </div>
              </div>
            </section>

            {/* ─── FAQ Accordion (Savollar va javoblar) ─────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-blue-600" />
                <span>Tez-tez so‘raladigan savollar</span>
              </h3>

              <div className="space-y-2 pt-1">
                {[
                  {
                    q: 'Kirish va chiqish vaqtlari qanday?',
                    a: 'Mehmonxonaga kirish 14:00 dan boshlab amalga oshiriladi. Chiqish vaqti 12:00 gacha. Erta kelish yoki kechroq chiqish bo‘yicha oldindan murojaat qilsangiz, imkoniyatga qarab bepul tashkillashtiramiz.',
                  },
                  {
                    q: 'Nonushta narxga kiritilganmi?',
                    a: 'Ha, Origin Hotelda barcha toifadagi xonalar uchun har tong soat 07:00 dan 10:30 gacha VIP Shved stoli nonushtasi to‘liq bepul taqdim etiladi.',
                  },
                  {
                    q: 'Buyurtmani bepul bekor qilish mumkinmi?',
                    a: 'Ha, belgilangan kirish sanasidan 24 soat oldin buyurtmangizni hech qanday jarimasiz bepul bekor qilishingiz mumkin.',
                  },
                  {
                    q: 'Bolalar bilan joylashish shartlari qanday?',
                    a: '6 yoshgacha bo‘lgan bolalar mavjud to‘shaklarda bepul joylashishi mumkin. Chaqaloqlar uchun qo‘shimcha krovat bepul yetkazib beriladi.',
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200/70 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-xs text-gray-900 hover:text-blue-600 flex items-center justify-between gap-3 bg-gray-50/60 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3.5 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ─── 24/7 Luxury Concierge & Assistance ───────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/80 flex items-center justify-center text-white shadow-md">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Savollaringiz bormi?</h4>
                  <p className="text-[11px] text-blue-200">24/7 Resepshn va Konsyerj xizmati</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Maxsus istaklar, individual transfer yoki boshqa savollar bo‘yicha istalgan vaqtda qo‘ng‘iroq qilishingiz mumkin.
              </p>

              <div className="pt-1">
                <a
                  href="tel:+998712000000"
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  <Phone size={14} />
                  <span>+998 (71) 200-00-00 ga qo‘ng‘iroq qilish</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Similar Rooms to Explore ────────────────────────────────────────── */}
        <section className="pt-10 border-t border-gray-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Boshqa takliflar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Mehmonxonamizning boshqa xonalarini o‘rganing
              </h2>
            </div>
            <Link
              to="/#rooms-section"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Barcha xonalarni ko‘rish</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherRooms.map((oRoom) => (
              <div
                key={oRoom.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={oRoom.image}
                    alt={oRoom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs">
                      {oRoom.categoryLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded-md text-[11px] font-medium">
                    {oRoom.roomCount} xona • {oRoom.size}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                      {oRoom.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {oRoom.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400">1 kecha</p>
                      <p className="text-sm font-black text-gray-900">
                        {oRoom.price.toLocaleString('uz-UZ')} so‘m
                      </p>
                    </div>
                    <Link
                      to={`/rooms/${oRoom.id}`}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ko‘rish</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Fullscreen Photo Lightbox Modal ────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-xs text-gray-400">{room.name} — Galereya</p>
              <h3 className="text-sm sm:text-base font-bold">
                {uniqueGallery[lightboxPhotoIndex]?.title} ({uniqueGallery[lightboxPhotoIndex]?.spaceName})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-mono">
                {lightboxPhotoIndex + 1} / {uniqueGallery.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Yopish"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Center: Image with Prev/Next buttons */}
          <div
            className="relative flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() =>
                setLightboxPhotoIndex((prev) =>
                  prev === 0 ? uniqueGallery.length - 1 : prev - 1
                )
              }
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer z-10"
              aria-label="Oldingi rasm"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={uniqueGallery[lightboxPhotoIndex]?.url}
              alt={uniqueGallery[lightboxPhotoIndex]?.title}
              className="max-h-[70vh] sm:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() =>
                setLightboxPhotoIndex((prev) =>
                  prev === uniqueGallery.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer z-10"
              aria-label="Keyingi rasm"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {uniqueGallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxPhotoIndex(idx)}
                className={`relative h-14 sm:h-16 w-20 sm:w-24 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                  lightboxPhotoIndex === idx
                    ? 'border-blue-500 scale-105 shadow-md ring-2 ring-blue-400/40'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white mt-20 pt-14 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Hotel size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Origin Hotel Tashkent</span>
          </div>
          <p className="max-w-md mx-auto text-gray-400">
            Toshkentning eng nufuzli manzilida joylashgan oliy toifadagi hashamatli mehmonxona.
          </p>
          <p className="pt-4 border-t border-gray-900 text-gray-600">
            © 2026 Origin Hotel. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
