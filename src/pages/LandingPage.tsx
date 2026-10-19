import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { StorageService } from '@/services/storage';
import { useTheme } from '@/theme';
import {
  Hotel,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Wifi,
  Coffee,
  UtensilsCrossed,
  ArrowRight,
  Menu,
  X,
  Clock,
  Car,
  ChevronRight,
  Eye,
} from 'lucide-react';

import { ROOMS } from '@/data/roomsData';
import type { Room } from '@/data/roomsData';

export default function LandingPage() {
  const { t, locale, translateRoomType } = useTranslation();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bookingModalRoom, setBookingModalRoom] = useState<Room | null>(null);
  const [viewModalRoom, setViewModalRoom] = useState<Room | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedRoomIds, setBookedRoomIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const saved = localStorage.getItem('origin-hotel-booked-rooms');
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  // Quick search form state
  const [searchCheckIn, setSearchCheckIn] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchCheckOut, setSearchCheckOut] = useState(() => new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);
  const [searchGuests, setSearchGuests] = useState('2');

  // Booking modal form state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    localStorage.setItem('origin-hotel-booked-rooms', JSON.stringify(bookedRoomIds));
  }, [bookedRoomIds]);

  const filteredRooms =
    activeCategory === 'all'
      ? ROOMS
      : ROOMS.filter((room) => room.category === activeCategory);

  const handleQuickBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const element = document.getElementById('rooms-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNameInput = (value: string) => {
    const sanitized = value.replace(/[^a-zA-Z\u00C0-\u024F\u0400-\u04FF\s'-]/g, '');
    setGuestName(sanitized);
  };

  const handlePhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    const formatted = digits ? `+${digits}` : '';
    setGuestPhone(formatted);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName || !guestPhone || !bookingModalRoom) return;

    setBookedRoomIds((prev) => Array.from(new Set([...prev, bookingModalRoom.id])));
    setBookingSuccess(true);

    try {
      const guest = StorageService.addGuest({
        fullName: guestName,
        phone: guestPhone,
        passport: '',
        notes: 'Veb-sayt orqali bron qilindi',
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextThreeDays = new Date();
      nextThreeDays.setDate(nextThreeDays.getDate() + 3);

      StorageService.addBooking({
        guestId: guest.id,
        guest: guest.fullName,
        roomId: bookingModalRoom.id,
        room: `#${bookingModalRoom.id}01 — ${bookingModalRoom.name}`,
        checkIn: tomorrow.toISOString().split('T')[0],
        checkOut: nextThreeDays.toISOString().split('T')[0],
        nights: 2,
        price: bookingModalRoom.price * 2,
        status: 'Kutilmoqda',
        notes: 'Sayt orqali yuborilgan yangi ariza',
      });
    } catch {
      // Ignore if mock storage has duplicate
    }

    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalRoom(null);
      setGuestName('');
      setGuestPhone('');
    }, 2500);
  };

  const ADVANTAGES = [
    {
      icon: MapPin,
      title: t('landing.adv.1.title'),
      desc: t('landing.adv.1.desc'),
    },
    {
      icon: Coffee,
      title: t('landing.adv.2.title'),
      desc: t('landing.adv.2.desc'),
    },
    {
      icon: Clock,
      title: t('landing.adv.3.title'),
      desc: t('landing.adv.3.desc'),
    },
    {
      icon: Wifi,
      title: t('landing.adv.4.title'),
      desc: t('landing.adv.4.desc'),
    },
    {
      icon: UtensilsCrossed,
      title: t('landing.adv.5.title'),
      desc: t('landing.adv.5.desc'),
    },
    {
      icon: Car,
      title: t('landing.adv.6.title'),
      desc: t('landing.adv.6.desc'),
    },
  ];

  const REVIEWS = [
    {
      name: 'Jasurbek Oripov',
      city: 'Qarshi',
      rating: 5,
      text:
        locale === 'uz'
          ? 'Origin Hotelda 3 kun turdik. Xonalar juda toza, xodimlar samimiy va nonushta ajoyib darajada mazali edi. Keyingi safar ham albatta shu yerni tanlaymiz!'
          : locale === 'ru'
          ? 'Провели 3 дня в Origin Hotel. Номера невероятно чистые, персонал очень приветлив, а завтрак потрясающе вкусный. В следующий раз обязательно сюда!'
          : locale === 'fr'
          ? 'Nous avons passé 3 jours à l’Origin Hotel. Chambres impeccables, personnel chaleureux et petit-déjeuner exquis. Nous reviendrons sans hésiter !'
          : locale === 'de'
          ? 'Wir haben 3 Tage im Origin Hotel verbracht. Zimmer sehr sauber, Personal herzlich und Frühstück köstlich. Wir kommen definitiv wieder!'
          : 'We stayed 3 days at Origin Hotel. The rooms were spotless, the staff very cordial, and breakfast delicious. We will certainly choose it next time!',
      date: 'Oktyabr, 2026',
    },
    {
      name: 'Dilnoza Karimova',
      city: 'Samarqand',
      rating: 5,
      text:
        locale === 'uz'
          ? "Biznes safar uchun eng ma'qul joy. Internet juda tez, xona tinch va qulay. Resepshn xodimlari barcha savollarimga darhol yordam berishdi."
          : locale === 'ru'
          ? 'Идеальное место для деловой поездки. Интернет скоростной, номер тихий и комфортный. Сотрудники ресепшн моментально помогали по любым вопросам.'
          : locale === 'fr'
          ? 'Lieu idéal pour les voyages d’affaires. Connexion très rapide, chambre calme et confortable. La réception a répondu à toutes mes demandes.'
          : locale === 'de'
          ? 'Perfekter Ort für Geschäftsreisen. Schnelles Internet, ruhiges und komfortables Zimmer. Rezeption war immer hilfsbereit.'
          : 'The best place for business travel. High-speed internet, quiet and cozy room. Front desk staff assisted promptly with everything.',
      date: 'Sentyabr, 2026',
    },
    {
      name: 'Alexey Morozov',
      city: 'Moskva',
      rating: 5,
      text:
        locale === 'uz'
          ? 'Qarshi markazidagi ajoyib mehmonxona! Xonalar yangi, zamonaviy, matraslar nihoyatda qulay. Nonushta barcha kutganlarimizdan a’lo bo‘ldi. Tavsiya qilaman!'
          : locale === 'ru'
          ? 'Отличный отель в центре Карши! Номера новые, стильные, матрасы невероятно удобные. Завтрак превзошел все ожидания. Рекомендую 10/10!'
          : locale === 'fr'
          ? 'Superbe hôtel au centre de Karchi ! Chambres modernes, literie extrêmement confortable. Petit-déjeuner au-delà de nos attentes. Recommandé 10/10 !'
          : locale === 'de'
          ? 'Tolles Hotel im Zentrum von Karschi! Neue, stilvolle Zimmer, bequeme Matratzen. Frühstück hat alle Erwartungen übertroffen. 10/10 Empfehlung!'
          : 'Excellent hotel in the center of Karshi! Rooms are brand new and stylish, mattresses incredibly comfortable. Breakfast exceeded all expectations. 10/10!',
      date: 'Oktyabr, 2026',
    },
  ];

  return (
    <div
      className={
        isDark
          ? 'min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors'
          : 'min-h-screen bg-white text-gray-800 font-sans transition-colors'
      }
    >
      {/* ─── Navigation Bar ────────────────────────────────────────────────────── */}
      <nav
        className={
          isDark
            ? 'sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md transition-colors'
            : 'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-colors'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className={isDark ? 'text-2xl font-black tracking-tight text-white group-hover:text-sky-400 transition-colors' : 'text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors'}>
                Origin Hotel
              </span>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-blue-600 dark:text-sky-400">
                {t('landing.tagline')}
              </p>
            </div>
          </Link>

          <div className={isDark ? 'hidden md:flex items-center gap-8 text-sm font-medium text-slate-300' : 'hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'}>
            <a href="#hero" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">{t('nav.home')}</a>
            <a href="#rooms-section" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">{t('nav.rooms')}</a>
            <a href="#advantages" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">{t('nav.advantages')}</a>
            <a href="#reviews" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">{t('nav.reviews')}</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">{t('nav.contact')}</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className={
                isDark
                  ? 'text-sm font-semibold text-slate-300 hover:text-sky-400 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition'
                  : 'text-sm font-semibold text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition'
              }
            >
              {t('nav.login')}
            </Link>
            <a
              href="#rooms-section"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg active:scale-95"
            >
              {t('landing.hero.viewRooms')}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={
              isDark
                ? 'md:hidden p-2 text-slate-300 rounded-lg hover:bg-slate-800'
                : 'md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100'
            }
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className={isDark ? 'md:hidden border-b border-slate-800 bg-slate-900 px-4 py-5 space-y-3' : 'md:hidden border-b border-gray-100 bg-white px-4 py-5 space-y-3'}>
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className={isDark ? 'block text-slate-200 py-2 font-medium' : 'block text-gray-700 py-2 font-medium'}
            >
              {t('nav.home')}
            </a>
            <a
              href="#rooms-section"
              onClick={() => setMobileMenuOpen(false)}
              className={isDark ? 'block text-slate-200 py-2 font-medium' : 'block text-gray-700 py-2 font-medium'}
            >
              {t('nav.rooms')}
            </a>
            <a
              href="#advantages"
              onClick={() => setMobileMenuOpen(false)}
              className={isDark ? 'block text-slate-200 py-2 font-medium' : 'block text-gray-700 py-2 font-medium'}
            >
              {t('nav.advantages')}
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className={isDark ? 'block text-slate-200 py-2 font-medium' : 'block text-gray-700 py-2 font-medium'}
            >
              {t('nav.reviews')}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className={isDark ? 'block text-slate-200 py-2 font-medium' : 'block text-gray-700 py-2 font-medium'}
            >
              {t('nav.contact')}
            </a>
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                className={
                  isDark
                    ? 'w-full text-center py-2.5 border border-slate-700 rounded-xl text-sm font-semibold text-slate-200'
                    : 'w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800'
                }
              >
                {t('nav.login')}
              </Link>
              <a
                href="#rooms-section"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md"
              >
                {t('landing.hero.viewRooms')}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className={
          isDark
            ? 'relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950'
            : 'relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Title */}
            <h1 className={isDark ? 'text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6' : 'text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6'}>
              {t('landing.hero.title')}
            </h1>

            {/* Description */}
            <p className={isDark ? 'text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto' : 'text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto'}>
              {t('landing.hero.subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <a
                href="#rooms-section"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
              >
                <span>{t('landing.hero.viewRooms')}</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="#advantages"
                className={
                  isDark
                    ? 'inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-7 py-3.5 rounded-xl font-bold text-base transition-all shadow-xs'
                    : 'inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-7 py-3.5 rounded-xl font-bold text-base transition-all shadow-xs'
                }
              >
                <span>{t('landing.hero.whyUs')}</span>
              </a>
            </div>
          </div>

          {/* Quick Booking Widget Card */}
          <div
            className={
              isDark
                ? 'bg-slate-900/95 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 max-w-5xl mx-auto'
                : 'bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/70 border border-gray-100 max-w-5xl mx-auto'
            }
          >
            <form onSubmit={handleQuickBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Check in */}
              <div>
                <label className={isDark ? 'block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5' : 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5'}>
                  <Calendar size={14} className="text-blue-500" />
                  {t('landing.quick.checkIn')}
                </label>
                <input
                  type="date"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className={
                    isDark
                      ? 'w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }
                />
              </div>

              {/* Check out */}
              <div>
                <label className={isDark ? 'block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5' : 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5'}>
                  <Calendar size={14} className="text-blue-500" />
                  {t('landing.quick.checkOut')}
                </label>
                <input
                  type="date"
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  className={
                    isDark
                      ? 'w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }
                />
              </div>

              {/* Guests count */}
              <div>
                <label className={isDark ? 'block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5' : 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5'}>
                  <Users size={14} className="text-blue-500" />
                  {t('landing.quick.guests')}
                </label>
                <select
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className={
                    isDark
                      ? 'w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }
                >
                  <option value="1" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>{t('landing.quick.guests1')}</option>
                  <option value="2" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>{t('landing.quick.guests2')}</option>
                  <option value="3" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>{t('landing.quick.guests3')}</option>
                  <option value="4" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>{t('landing.quick.guests4')}</option>
                </select>
              </div>

              {/* Submit button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 h-[42px] cursor-pointer"
                >
                  <span>{t('landing.quick.availableRooms')}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Quick stats counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto text-center">
            <div className={isDark ? 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800' : 'p-4 rounded-2xl bg-white border border-gray-100 shadow-xs'}>
              <p className="text-3xl font-black text-blue-500">120+</p>
              <p className={isDark ? 'text-xs font-medium text-slate-400 mt-1' : 'text-xs font-medium text-gray-500 mt-1'}>{t('landing.stats.rooms')}</p>
            </div>
            <div className={isDark ? 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800' : 'p-4 rounded-2xl bg-white border border-gray-100 shadow-xs'}>
              <p className="text-3xl font-black text-blue-500">15,000+</p>
              <p className={isDark ? 'text-xs font-medium text-slate-400 mt-1' : 'text-xs font-medium text-gray-500 mt-1'}>{t('landing.stats.guests')}</p>
            </div>
            <div className={isDark ? 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800' : 'p-4 rounded-2xl bg-white border border-gray-100 shadow-xs'}>
              <p className="text-3xl font-black text-blue-500">4.9 / 5</p>
              <p className={isDark ? 'text-xs font-medium text-slate-400 mt-1' : 'text-xs font-medium text-gray-500 mt-1'}>{t('landing.stats.rating')}</p>
            </div>
            <div className={isDark ? 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800' : 'p-4 rounded-2xl bg-white border border-gray-100 shadow-xs'}>
              <p className="text-3xl font-black text-blue-500">24 / 7</p>
              <p className={isDark ? 'text-xs font-medium text-slate-400 mt-1' : 'text-xs font-medium text-gray-500 mt-1'}>{t('landing.stats.security')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Rooms Section ─────────────────────────────────────────────────────── */}
      <section
        id="rooms-section"
        className={isDark ? 'py-20 bg-slate-950 transition-colors' : 'py-20 bg-gray-50 transition-colors'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                {t('landing.rooms.badge')}
              </span>
              <h2 className={isDark ? 'text-3xl sm:text-4xl font-black text-white mt-1' : 'text-3xl sm:text-4xl font-black text-gray-900 mt-1'}>
                {t('landing.rooms.title')}
              </h2>
              <p className={isDark ? 'text-slate-400 text-sm mt-2 max-w-xl' : 'text-gray-500 text-sm mt-2 max-w-xl'}>
                {t('landing.rooms.subtitle')}
              </p>
            </div>

            {/* Category filter tabs */}
            <div
              className={
                isDark
                  ? 'flex flex-wrap gap-2 mt-6 md:mt-0 bg-slate-900 p-1.5 rounded-2xl border border-slate-800'
                  : 'flex flex-wrap gap-2 mt-6 md:mt-0 bg-white p-1.5 rounded-2xl border border-gray-200'
              }
            >
              {[
                { id: 'all', label: t('common.all') },
                { id: 'standart', label: t('roomType.standart') },
                { id: 'deluxe', label: t('roomType.deluxe') },
                { id: 'suite', label: t('roomType.suite') },
                { id: 'president', label: t('roomType.president') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => {
              const isBooked = bookedRoomIds.includes(room.id);

              return (
                <div
                  key={room.id}
                  className={
                    isDark
                      ? 'bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-sm hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col group'
                      : 'bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group'
                  }
                >
                  {/* Room Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isBooked && (
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs">
                          {t('landing.rooms.booked')}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                      {room.size} • {room.capacity}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={isDark ? 'font-bold text-lg text-white group-hover:text-sky-400 transition-colors' : 'font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors'}>
                        {room.name}
                      </h3>
                      <p className={isDark ? 'text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed' : 'text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed'}>
                        {room.description}
                      </p>

                      {/* Features pill */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {room.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className={
                              isDark
                                ? 'px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[11px] font-medium'
                                : 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium'
                            }
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className={`pt-4 mt-4 border-t flex flex-col gap-3 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{t('common.perNight')}</p>
                          <p className={isDark ? 'text-base font-black text-white' : 'text-base font-black text-gray-900'}>
                            {room.price.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US')} <span className="text-xs font-normal text-gray-400">{t('common.currency')}</span>
                          </p>
                        </div>
                        <span className={isDark ? 'text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-sky-300 border border-slate-700' : 'text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-200/60'}>
                          {translateRoomType(room.categoryLabel)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setViewModalRoom(room)}
                          className={
                            isDark
                              ? 'w-full py-2.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center'
                              : 'w-full py-2.5 px-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer text-center'
                          }
                        >
                          <Eye size={15} className="shrink-0" />
                          <span className="truncate">{t('landing.rooms.view')}</span>
                        </button>

                        {isBooked ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-2 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold transition shadow-xs cursor-not-allowed flex items-center justify-center text-center"
                          >
                            {t('landing.rooms.booked')}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBookingModalRoom(room)}
                            className="w-full py-2.5 px-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 hover:shadow flex items-center justify-center text-center cursor-pointer"
                          >
                            {t('landing.rooms.book')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Advantages Section ────────────────────────────────────────────────── */}
      <section
        id="advantages"
        className={isDark ? 'py-20 bg-slate-900/50 transition-colors' : 'py-20 bg-white transition-colors'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={isDark ? 'text-3xl sm:text-4xl font-black text-white' : 'text-3xl sm:text-4xl font-black text-gray-900'}>
              {t('landing.adv.title')}
            </h2>
            <p className={isDark ? 'text-slate-400 text-sm mt-2' : 'text-gray-500 text-sm mt-2'}>
              {t('landing.adv.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={
                    isDark
                      ? 'p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:shadow-2xl transition-all duration-300 group'
                      : 'p-7 rounded-3xl bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 group'
                  }
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <h3 className={isDark ? 'font-bold text-lg text-white mb-2' : 'font-bold text-lg text-gray-900 mb-2'}>
                    {item.title}
                  </h3>
                  <p className={isDark ? 'text-slate-400 text-sm leading-relaxed' : 'text-gray-500 text-sm leading-relaxed'}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ───────────────────────────────────────────────────── */}
      <section
        id="reviews"
        className={isDark ? 'py-20 bg-slate-950 transition-colors' : 'py-20 bg-white transition-colors'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={isDark ? 'text-3xl sm:text-4xl font-black text-white' : 'text-3xl sm:text-4xl font-black text-gray-900'}>
              {t('landing.reviews.title')}
            </h2>
            <p className={isDark ? 'text-slate-400 text-sm mt-2' : 'text-gray-500 text-sm mt-2'}>
              {t('landing.reviews.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className={
                  isDark
                    ? 'p-7 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between'
                    : 'p-7 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between'
                }
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className={isDark ? 'text-slate-300 text-sm leading-relaxed italic' : 'text-gray-700 text-sm leading-relaxed italic'}>
                    "{review.text}"
                  </p>
                </div>

                <div className={`pt-6 mt-6 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-gray-200/60'}`}>
                  <div>
                    <h4 className={isDark ? 'font-bold text-sm text-white' : 'font-bold text-sm text-gray-900'}>{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.city}</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <a
            href="#rooms-section"
            className="inline-flex items-center gap-2 keep-white !bg-white !text-blue-600 hover:!bg-blue-50 font-black px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <span>{t('landing.cta.btn')}</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ─── Footer & Contact ──────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-950 text-gray-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* About */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Hotel size={22} />
                </div>
                <span className="text-2xl font-black text-white">Origin Hotel</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('landing.footer.about')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {t('landing.footer.quickLinks')}
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-white transition">{t('nav.home')}</a></li>
                <li><a href="#rooms-section" className="hover:text-white transition">{t('nav.rooms')}</a></li>
                <li><a href="#advantages" className="hover:text-white transition">{t('nav.advantages')}</a></li>
                <li><a href="#reviews" className="hover:text-white transition">{t('nav.reviews')}</a></li>
              </ul>
            </div>

            {/* Management login */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {t('landing.footer.management')}
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                {t('landing.footer.managementDesc')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                <span>{t('landing.footer.managementBtn')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {t('nav.contact')}
              </h4>
              <div className="space-y-2.5 text-xs text-gray-400">
                <p className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Amir Temur shoh ko‘chasi 15, Yunusobod tumani, Qarshi</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="font-mono text-gray-200">+998 (71) 200-00-00</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail size={16} className="text-blue-500 flex-shrink-0" />
                  <span>info@originhotel.uz</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Origin Hotel Qarshi. {t('login.footer')}</p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition">{t('landing.footer.privacy')}</a>
              <a href="#" className="hover:text-white transition">{t('landing.footer.terms')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Room Details Modal ────────────────────────────────────────────────── */}
      {viewModalRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={isDark ? 'bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative' : 'bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative'}>
            <button
              onClick={() => setViewModalRoom(null)}
              className={isDark ? 'absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer' : 'absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer'}
            >
              <X size={20} />
            </button>
            <img src={viewModalRoom.image} alt={viewModalRoom.name} className="w-full h-52 object-cover rounded-2xl mb-4" />
            <h3 className={isDark ? 'text-xl font-bold text-white' : 'text-xl font-bold text-gray-900'}>{viewModalRoom.name}</h3>
            <p className={isDark ? 'text-slate-400 text-xs mt-1' : 'text-gray-500 text-xs mt-1'}>{viewModalRoom.fullDescription || viewModalRoom.description}</p>
            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className={isDark ? 'p-2.5 rounded-xl bg-slate-800 text-slate-300' : 'p-2.5 rounded-xl bg-gray-50 text-gray-700'}>
                <strong>{t('common.floor')}:</strong> {viewModalRoom.floor}
              </div>
              <div className={isDark ? 'p-2.5 rounded-xl bg-slate-800 text-slate-300' : 'p-2.5 rounded-xl bg-gray-50 text-gray-700'}>
                <strong>{t('rooms.capacity')}:</strong> {viewModalRoom.capacity}
              </div>
              <div className={isDark ? 'p-2.5 rounded-xl bg-slate-800 text-slate-300' : 'p-2.5 rounded-xl bg-gray-50 text-gray-700'}>
                <strong>{t('common.perNight')}:</strong> {viewModalRoom.price.toLocaleString()} {t('common.currency')}
              </div>
              <div className={isDark ? 'p-2.5 rounded-xl bg-slate-800 text-slate-300' : 'p-2.5 rounded-xl bg-gray-50 text-gray-700'}>
                <strong>{t('common.category')}:</strong> {translateRoomType(viewModalRoom.categoryLabel)}
              </div>
            </div>
            <button
              onClick={() => {
                const target = viewModalRoom;
                setViewModalRoom(null);
                setBookingModalRoom(target);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition cursor-pointer"
            >
              {t('landing.rooms.book')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Room Booking Modal ─────────────────────────────────────────────────── */}
      {bookingModalRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={
              isDark
                ? 'bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-800 animate-in fade-in zoom-in-95 duration-200'
                : 'bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200'
            }
          >
            <button
              onClick={() => setBookingModalRoom(null)}
              className={
                isDark
                  ? 'absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer'
                  : 'absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer'
              }
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className={isDark ? 'text-xl font-black text-white mb-2' : 'text-xl font-black text-gray-900 mb-2'}>
                  {t('landing.modal.success')}
                </h3>
                <p className={isDark ? 'text-xs text-slate-400 leading-relaxed' : 'text-xs text-gray-500 leading-relaxed'}>
                  {t('landing.modal.successMsg')}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                  {t('landing.modal.bookTitle')}
                </span>
                <h3 className={isDark ? 'text-xl font-black text-white mt-1 mb-2' : 'text-xl font-black text-gray-900 mt-1 mb-2'}>
                  {bookingModalRoom.name}
                </h3>
                <p className={isDark ? 'text-xs text-slate-400 mb-2' : 'text-xs text-gray-500 mb-2'}>
                  {t('common.perNight')}: <strong className={isDark ? 'text-white' : 'text-gray-900'}>{bookingModalRoom.price.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US')} {t('common.currency')}</strong>
                </p>
                {bookedRoomIds.includes(bookingModalRoom.id) && (
                  <p className="text-xs text-red-500 font-semibold mb-4">
                    {t('landing.modal.alreadyBooked')}
                  </p>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className={isDark ? 'block text-xs font-semibold text-slate-300 mb-1' : 'block text-xs font-semibold text-gray-700 mb-1'}>
                      {t('landing.modal.name')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jasur Aliyev"
                      value={guestName}
                      onChange={(e) => handleNameInput(e.target.value)}
                      className={
                        isDark
                          ? 'w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                          : 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }
                      inputMode="text"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className={isDark ? 'block text-xs font-semibold text-slate-300 mb-1' : 'block text-xs font-semibold text-gray-700 mb-1'}>
                      {t('landing.modal.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998901234567"
                      value={guestPhone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      className={
                        isDark
                          ? 'w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                          : 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }
                      inputMode="numeric"
                      pattern="\+[0-9]*"
                      maxLength={14}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={isDark ? 'block text-xs font-semibold text-slate-300 mb-1' : 'block text-xs font-semibold text-gray-700 mb-1'}>
                        {t('landing.quick.checkIn')}
                      </label>
                      <input
                        type="date"
                        defaultValue={searchCheckIn}
                        className={
                          isDark
                            ? 'w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white'
                            : 'w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700'
                        }
                      />
                    </div>
                    <div>
                      <label className={isDark ? 'block text-xs font-semibold text-slate-300 mb-1' : 'block text-xs font-semibold text-gray-700 mb-1'}>
                        {t('landing.quick.checkOut')}
                      </label>
                      <input
                        type="date"
                        defaultValue={searchCheckOut}
                        className={
                          isDark
                            ? 'w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white'
                            : 'w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700'
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookedRoomIds.includes(bookingModalRoom.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {bookedRoomIds.includes(bookingModalRoom.id) ? t('landing.rooms.booked') : t('landing.modal.confirm')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
