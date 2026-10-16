import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Hotel,
  ArrowLeft,
  Users,
  Maximize2,
  Bed,
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
  Image as ImageIcon,
} from 'lucide-react';
import { ROOMS } from '@/data/roomsData';
import type { Room } from '@/data/roomsData';

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

  // Selected space / photo tab
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState<number>(0);
  const [activePhotoUrl, setActivePhotoUrl] = useState<string>('');

  // Booking form state
  const [checkIn, setCheckIn] = useState<string>('2026-10-16');
  const [checkOut, setCheckOut] = useState<string>('2026-10-18');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Sync active photo with room change
  useEffect(() => {
    if (room) {
      setActivePhotoUrl(room.spaces[0]?.image || room.image);
      setSelectedSpaceIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [room?.id]);

  useEffect(() => {
    localStorage.setItem('origin-hotel-booked-rooms', JSON.stringify(bookedRoomIds));
  }, [bookedRoomIds]);

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Hotel size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Xona topilmadi</h1>
        <p className="text-gray-500 text-sm max-w-md mb-6">
          Siz qidirayotgan xona mavjud emas yoki olib tashlangan bo‘lishi mumkin.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md shadow-blue-500/20"
        >
          <ArrowLeft size={18} />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    );
  }

  const isBooked = bookedRoomIds.includes(room.id);

  // Calculate nights
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
  const totalPrice = room.price * nights;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || isBooked) return;

    setBookedRoomIds((prev) => Array.from(new Set([...prev, room.id])));
    setBookingSuccess(true);
  };

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setGuestPhone(digits ? `+${digits}` : '');
  };

  const otherRooms = ROOMS.filter((r) => r.id !== room.id);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-blue-500 selection:text-white">
      {/* ─── Top Navigation Bar ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200/70 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Orqaga qaytish</span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                Origin Hotel
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-gray-400 font-medium">1 kecha uchun</p>
              <p className="text-base font-black text-gray-900">
                {room.price.toLocaleString('uz-UZ')} so‘m
              </p>
            </div>
            <a
              href="#booking-card"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <Calendar size={15} />
              <span>Band qilish</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition">Bosh sahifa</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to="/#rooms-section" className="hover:text-blue-600 transition">Xonalar</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-blue-600 font-semibold">{room.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs">
                  {room.categoryLabel}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Layers size={13} />
                  <span>{room.roomCountLabel}</span>
                </span>
                {isBooked ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                    Band qilingan
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Check size={13} />
                    <span>Hozirda bo‘sh</span>
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {room.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star size={24} className="fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                  <span>5.0</span>
                  <span className="text-gray-400 text-xs font-normal">• 128 ta sharh</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold">100% haqiqiy mehmonlar bahosi</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Room Core Specs Banner (Metr kvadrat, xonalar soni, sig'imi) ──── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Xonalar soni */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Layers size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Tarkib</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Xonalar soni</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">
                {room.roomCount} ta xona
              </p>
            </div>
          </div>

          {/* 2. Maydoni */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Maximize2 size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Kvadratura</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Maydoni</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">
                {room.size}
              </p>
            </div>
          </div>

          {/* 3. Sig'imi */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Users size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Mehmonlar</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Sig‘imi</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">
                {room.capacity}
              </p>
            </div>
          </div>

          {/* 4. Karavot turi */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Bed size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Yotoq</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Karavot turi</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5 line-clamp-1" title={room.bedType}>
                {room.bedType}
              </p>
            </div>
          </div>

          {/* 5. Qavat */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Hotel size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Joylashuv</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Qavat</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">
                {room.floor}-qavat
              </p>
            </div>
          </div>

          {/* 6. Manzara */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <MapPin size={20} />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">Panoramasi</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Manzara</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5 line-clamp-1" title={room.view}>
                {room.view}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid: Left Details & Right Booking Form ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-10">
            {/* ─── PHOTO SHOWCASE & SUB-ROOMS GALLERY ───────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                      Xonaning barcha qismlari va rasmlari
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Bu xonadon jami <strong>{room.roomCount} ta alohida xona</strong> va <strong>{room.spaces.length} ta yashash hududi</strong>dan iborat. Har bir qismning rasmini ko‘rish uchun quyidagi tugmalarni bosing:
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto">
                  <ImageIcon size={14} />
                  <span>{room.spaces.length} ta hudud</span>
                </div>
              </div>

              {/* Sub-room Space Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {room.spaces.map((space, idx) => {
                  const isActive = selectedSpaceIndex === idx;
                  return (
                    <button
                      key={space.id}
                      onClick={() => {
                        setSelectedSpaceIndex(idx);
                        setActivePhotoUrl(space.image);
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                        isActive ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{space.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-blue-700/60 text-blue-100' : 'bg-gray-200/80 text-gray-500'
                      }`}>
                        {space.size}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Featured Active Photo Display */}
              <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[460px] bg-gray-900 shadow-md group">
                <img
                  src={activePhotoUrl || room.image}
                  alt={room.spaces[selectedSpaceIndex]?.name || room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Badge top-left */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    {room.spaces[selectedSpaceIndex]?.typeLabel}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                    {room.spaces[selectedSpaceIndex]?.size}
                  </span>
                </div>

                {/* Details bottom */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-xl sm:text-2xl font-black mb-1.5 drop-shadow-md">
                    {room.spaces[selectedSpaceIndex]?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl drop-shadow">
                    {room.spaces[selectedSpaceIndex]?.description}
                  </p>
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {room.spaces.map((space, idx) => {
                  const isActive = selectedSpaceIndex === idx;
                  return (
                    <div
                      key={space.id}
                      onClick={() => {
                        setSelectedSpaceIndex(idx);
                        setActivePhotoUrl(space.image);
                      }}
                      className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isActive
                          ? 'border-blue-600 shadow-md scale-105 ring-2 ring-blue-400/40'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={space.image}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate drop-shadow">
                        {space.typeLabel}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Individual Detailed Cards of Each Room / Space */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Layers size={18} className="text-blue-600" />
                  <span>Xonadon tarkibidagi barcha xonalar tafsiloti ({room.spaces.length} ta)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.spaces.map((space, idx) => (
                    <div
                      key={space.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        selectedSpaceIndex === idx
                          ? 'border-blue-300 bg-blue-50/40 shadow-xs ring-1 ring-blue-300'
                          : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-0.5 rounded-lg">
                            {idx + 1}-qism • {space.typeLabel}
                          </span>
                          <span className="text-xs font-black text-gray-800">
                            {space.size}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">
                          {space.name}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-3">
                          {space.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-gray-200/60">
                        {space.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-gray-700">
                            <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─── ROOM DESCRIPTION & EXPERIENCE ─────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Xona haqida to‘liq ma’lumot
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {room.fullDescription}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Har bir xonadonda mehmonlarning yuqori darajada shaxsiy xavfsizligi va qulayligi kafolatlanadi. Kundalik tozalash xizmati, yangi choyshablar va xalatlar, yuqori sifatli gigiyena vositalari doimiy taqdim etiladi.
              </p>
            </section>

            {/* ─── ALL CATEGORIZED AMENITIES ─────────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  Qulayliklar va xizmatlar to‘plami
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Xonadonda dam olishingiz va ishlashingiz uchun barcha sharoitlar yaratilgan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Qulaylik va dam olish */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Sparkles size={17} className="text-blue-600" />
                    <span>Qulaylik va shinamlik</span>
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

                {/* Vanna va SPA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <CheckCircle2 size={17} className="text-blue-600" />
                    <span>Hammom, Vanna va SPA</span>
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

                {/* Texnologiya va Internet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Wifi size={17} className="text-blue-600" />
                    <span>Texnologiya va OAV</span>
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

                {/* Mehmonxona bepul xizmatlari */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Coffee size={17} className="text-blue-600" />
                    <span>Qo‘shimcha xizmatlar</span>
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

            {/* ─── HOTEL POLICIES & RULES ────────────────────────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-blue-600" />
                <span>Mehmonxona tartib-qoidalari</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>Kirish va Chiqish</span>
                  </p>
                  <p>Check-in: 14:00 dan boshlab</p>
                  <p>Check-out: 12:00 gacha</p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Bekor qilish siyosati</span>
                  </p>
                  <p>Tashrifdan 24 soat oldin bepul bekor qilish imkoni mavjud.</p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <Car size={14} className="text-blue-600" />
                    <span>Avtoturargoh</span>
                  </p>
                  <p>Mehmonlar uchun 24/7 bepul qo‘riqlanadigan avtoturargoh.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (1 Col on lg) - Sticky Booking Form Card */}
          <div className="space-y-6">
            <div id="booking-card" className="sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xl space-y-5">
              {/* Price Top */}
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-5">
                <div>
                  <span className="text-[11px] text-gray-400 font-medium">1 kecha uchun</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      {room.price.toLocaleString('uz-UZ')}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">so‘m</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                  {room.categoryLabel}
                </span>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Xona muvaffaqiyatli band qilindi!
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Hurmatli <strong>{guestName}</strong>, buyurtmangiz qabul qilindi. Tez orada <strong>{guestPhone}</strong> raqamingizga qo‘ng‘iroq qilib ma’lumotlarni tasdiqlaymiz.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 text-left space-y-1">
                    <p>• Xona: <strong>{room.name}</strong></p>
                    <p>• Muddat: <strong>{checkIn}</strong> dan <strong>{checkOut}</strong> gacha ({nights} kecha)</p>
                    <p>• Jami to‘lov: <strong>{totalPrice.toLocaleString('uz-UZ')} so‘m</strong></p>
                  </div>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="w-full py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                  >
                    Yana boshqa xona tanlash
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {isBooked && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5 text-red-600" />
                      <span>Bu xona hozirda band qilingan. Quyidagi formani to‘ldirish orqali boshqa sanaga yoki navbatga buyurtma qoldirishingiz mumkin.</span>
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

                  {/* Name */}
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

                  {/* Phone */}
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

                  {/* Calculation summary */}
                  <div className="pt-3 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span>{room.price.toLocaleString('uz-UZ')} so‘m × {nights} kecha</span>
                      <span className="font-semibold text-gray-900">{totalPrice.toLocaleString('uz-UZ')} so‘m</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Shved stoli nonushtasi</span>
                      <span className="font-bold">Bepul</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Xizmat haqi va soliqlar</span>
                      <span className="font-bold">Kiritilgan</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-gray-900">
                      <span>Jami to‘lov:</span>
                      <span className="text-blue-600">{totalPrice.toLocaleString('uz-UZ')} so‘m</span>
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

              {/* Reception contact */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Savollar bormi? Qo‘ng‘iroq qiling</p>
                  <p className="text-xs font-bold text-gray-900 font-mono">+998 (71) 200-00-00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Other Recommended Rooms ──────────────────────────────────────── */}
        <section className="pt-10 border-t border-gray-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Boshqa takliflar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Mehmonxonamizning boshqa xonalari
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
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={oRoom.image}
                    alt={oRoom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
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
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
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

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white mt-20 pt-12 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Hotel size={18} />
            </div>
            <span className="text-lg font-black text-white">Origin Hotel Tashkent</span>
          </div>
          <p>© 2026 Origin Hotel. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
