import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Clock,
  Car,
  ChevronRight,
} from 'lucide-react';

interface Room {
  id: number;
  name: string;
  category: 'standart' | 'deluxe' | 'suite' | 'president';
  categoryLabel: string;
  price: number;
  capacity: string;
  size: string;
  description: string;
  features: string[];
  image: string;
  popular?: boolean;
}

const ROOMS: Room[] = [
  {
    id: 1,
    name: 'Standart Qulay Xona',
    category: 'standart',
    categoryLabel: 'Standart',
    price: 350000,
    capacity: '2 kishilik',
    size: '28 m²',
    description: "Sayohat va qisqa muddatli tashriflar uchun barcha qulayliklarga ega shinam xona.",
    features: ['Tezkor Wi-Fi', 'Smart TV', 'Konditsioner', 'Bepul nonushta'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Deluxe Shahar Manzarali',
    category: 'deluxe',
    categoryLabel: 'Deluxe',
    price: 550000,
    capacity: '2-3 kishilik',
    size: '38 m²',
    description: "Keng maydon, shahar panoramik manzarasi va mini-bar bilan jihozlangan lyuks xona.",
    features: ['Panoramik oyna', 'Katta balkon', 'Mini-bar', 'Shved stoli nonushtasi'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },
  {
    id: 3,
    name: 'Premium Oila Suite',
    category: 'suite',
    categoryLabel: 'Suite',
    price: 850000,
    capacity: '4 kishilik',
    size: '54 m²',
    description: "Oilaviy dam olish uchun alohida mehmonxona va yotoqxona qismlariga ega keng suit.",
    features: ['2 ta xona', 'Jakuzi vanna', 'Oshxona burchagi', 'VIP xizmat'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Prezident Apartamenti',
    category: 'president',
    categoryLabel: 'Prezident',
    price: 1500000,
    capacity: '4-6 kishilik',
    size: '85 m²',
    description: "Eksklyuziv dizayn, yuqori darajadagi xavfsizlik va shaxsiy xizmat ko'rsatuvchi xodim bilan ta'minlangan.",
    features: ['Shaxsiy terras', 'Shaxsiy batler', 'Premium spa zonasi', 'Transfer bepul'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  },
];

const ADVANTAGES = [
  {
    icon: MapPin,
    title: 'Markaziy joylashuv',
    desc: 'Toshkent markazida, metro, restoranlar va diqqatga sazovor joylarga bir necha qadam.',
  },
  {
    icon: Coffee,
    title: 'Shved stoli nonushtasi',
    desc: 'Har tong yangi pishiriqlar, issiq taomlar va xushbo‘y qahva bepul taqdim etiladi.',
  },
  {
    icon: Clock,
    title: '24/7 Xizmat ko‘rsatish',
    desc: 'Kunning istalgan vaqtida xonaga xizmat, tozalik va resepshn xizmatlari faol.',
  },
  {
    icon: Wifi,
    title: 'Tezkor bepul Wi-Fi',
    desc: 'Barcha xonalar va mehmonxona hududida cheksiz yuqori tezlikdagi internet.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restoran & Lounge',
    desc: 'Sharq va Yevropa oshxonasining sara milliy taomlari tajribali oshpazlarimizdan.',
  },
  {
    icon: Car,
    title: 'Bepul avtoturargoh & Transfer',
    desc: 'Xavfsiz avtoturargoh hamda aeroportdan qulay transfer xizmatlari.',
  },
];

const REVIEWS = [
  {
    name: 'Jasurbek Oripov',
    city: 'Toshkent',
    rating: 5,
    text: "Origin Hotelda 3 kun turdik. Xonalar juda toza, xodimlar samimiy va nonushta ajoyib darajada mazali edi. Keyingi safar ham albatta shu yerni tanlaymiz!",
    date: 'Oktyabr, 2026',
  },
  {
    name: 'Dilnoza Karimova',
    city: 'Samarqand',
    rating: 5,
    text: "Biznes safar uchun eng ma'qul joy. Internet juda tez, xona tinch va qulay. Resepshn xodimlari barcha savollarimga darhol yordam berishdi.",
    date: 'Sentyabr, 2026',
  },
  {
    name: 'Alexey Morozov',
    city: 'Moskva',
    rating: 5,
    text: "Отличный отель в центре Ташкента! Номера новые, стильные, матрасы невероятно удобные. Завтрак превзошел все ожидания. Рекомендую 10/10!",
    date: 'Oktyabr, 2026',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bookingModalRoom, setBookingModalRoom] = useState<Room | null>(null);
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
  const [searchCheckIn, setSearchCheckIn] = useState('2026-10-16');
  const [searchCheckOut, setSearchCheckOut] = useState('2026-10-18');
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
    const sanitized = value.replace(/[^a-zA-ZA-Za-z\u00C0-\u024F\u0400-\u04FF\s'-]/g, '');
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

    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalRoom(null);
      setGuestName('');
      setGuestPhone('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ─── Top announcement banner ────────────────────────────────────────────── */}
      <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-amber-300" />
        <span>Kuzgi chegirma: Sayt orqali bron qilganda <strong>15% chegirma</strong> va bepul nonushta!</span>
        <span className="hidden md:inline text-blue-200">|</span>
        <span className="hidden md:inline font-mono">Tel: +998 (71) 200-00-00</span>
      </div>

      {/* ─── Navbar ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                Origin Hotel
              </span>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-blue-600">
                Luxury & Comfort
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#hero" className="hover:text-blue-600 transition-colors">Bosh sahifa</a>
            <a href="#rooms-section" className="hover:text-blue-600 transition-colors">Xonalar</a>
            <a href="#advantages" className="hover:text-blue-600 transition-colors">Afzalliklar</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Xizmatlar</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">Sharhlar</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Bog‘lanish</a>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Tizimga kirish
            </Link>
            <a
              href="#rooms-section"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg active:scale-95"
            >
              Xona band qilish
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-100 bg-white px-4 py-5 space-y-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Bosh sahifa
            </a>
            <a
              href="#rooms-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Xonalar
            </a>
            <a
              href="#advantages"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Afzalliklar
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Xizmatlar
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Sharhlar
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 py-2 font-medium"
            >
              Bog‘lanish
            </a>
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
              >
                Tizimga kirish
              </Link>
              <a
                href="#rooms-section"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md"
              >
                Xona band qilish
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6">
              <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
              <span>Toshkentdagi 5 yulduzli qulaylik & hashamat</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
              Origin Hotel bilan betakror <span className="text-blue-600">qulaylik</span> va xotirjamlikni his eting
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Sizning maroqli hordig‘ingiz, yuqori darajadagi servis va unutilmas xotiralaringiz uchun zamonaviy sharoitlar yaratilgan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <a
                href="#rooms-section"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
              >
                <span>Xonalarni ko‘rish</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="#advantages"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-7 py-3.5 rounded-xl font-bold text-base transition-all shadow-xs"
              >
                <span>Nega aynan biz?</span>
              </a>
            </div>
          </div>

          {/* Quick Booking Widget Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/70 border border-gray-100 max-w-5xl mx-auto">
            <form onSubmit={handleQuickBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Check in */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  Kirish sanasi
                </label>
                <input
                  type="date"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Check out */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  Chiqish sanasi
                </label>
                <input
                  type="date"
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guests count */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users size={14} className="text-blue-600" />
                  Mehmonlar
                </label>
                <select
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 kishi</option>
                  <option value="2">2 kishi</option>
                  <option value="3">3 kishi</option>
                  <option value="4">4+ kishi (Oila)</option>
                </select>
              </div>

              {/* Submit button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 h-[42px]"
                >
                  <span>Mavjud xonalar</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Quick stats counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <p className="text-3xl font-black text-blue-600">120+</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Shinam xonalar</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <p className="text-3xl font-black text-blue-600">15,000+</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Mamnun mehmonlar</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <p className="text-3xl font-black text-blue-600">4.9 / 5</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Mijozlar bahosi</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <p className="text-3xl font-black text-blue-600">24 / 7</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Xizmat va xavfsizlik</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Rooms Section ─────────────────────────────────────────────────────── */}
      <section id="rooms-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Xonalar to‘plami
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
                Siz uchun tanlangan xonalarimiz
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Har bir xona o‘zgacha dizayn, shinam to‘shaklar va zamonaviy qulayliklar bilan jihozlangan.
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-white p-1.5 rounded-2xl border border-gray-200">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'standart', label: 'Standart' },
                { id: 'deluxe', label: 'Deluxe' },
                { id: 'suite', label: 'Suite' },
                { id: 'president', label: 'Prezident' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
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
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Room Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-800 shadow-xs">
                      {room.categoryLabel}
                    </span>
                    {room.popular && (
                      <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs">
                        Tavsiya
                      </span>
                    )}
                    {isBooked && (
                      <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs">
                        Band qilingan
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                    {room.size} • {room.capacity}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Features pill */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {room.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">1 kecha uchun</p>
                      <p className="text-base font-black text-gray-900">
                        {room.price.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-gray-500">so‘m</span>
                      </p>
                    </div>

                    {isBooked ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold transition shadow-sm cursor-not-allowed"
                      >
                        Band qilingan
                      </button>
                    ) : (
                      <button
                        onClick={() => setBookingModalRoom(room)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Band qilish
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Advantages Section ────────────────────────────────────────────────── */}
      <section id="advantages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Afzalliklarimiz
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
              Nega aynan Origin Hotelni tanlashadi?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Har bir tafsilot mehmondorchilikning eng oliy mezonlariga muvofiq loyihalashtirilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Services Showcase ─────────────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Premium Xizmatlar
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 mb-6 leading-tight">
                Faqat xona emas, balki to‘laqonli maroqli xizmatlar majmui
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-1">
                    <UtensilsCrossed size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Origin Gourmet Restorani</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Ertalabki to‘yimli shved stoli va kechki romantik kechki ovqatlar uchun maxsus menyu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-1">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Spa & Wellness markazi</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Issiq fin saunasi, yopiq suzish havzasi va professional massaj xizmatlari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-1">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Konferensiyalar & Biznes zallari</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Yuqori sifatli proyektor va audio-uskunalar bilan ta'minlangan biznes uchrashuv maydonlari.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                  alt="Hotel service"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-800">
                  "Toshkentdagi eng yoqimli va mehmondo‘st xizmat ko‘rsatuvchi maskan."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ───────────────────────────────────────────────────── */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Mijozlar fikrlari
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
              Mehmonlarimiz biz haqimizda nima deyishadi?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              15 000 dan ortiq mamnun mijozlarimizning samimiy baholari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{review.name}</h4>
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
            Unutilmas dam olish lahzalarini hoziroq rejalashtiring!
          </h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto mb-8">
            Onlayn xona band qiling va kafolatlangan qulay narxlar hamda bepul qo‘shimcha xizmatlardan bahramand bo‘ling.
          </p>
          <a
            href="#rooms-section"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-black px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <span>Xonani tanlash & Band qilish</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ─── Footer & Contact ──────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
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
                Toshkent markazidagi zamonaviy premium mehmonxona. Haqiqiy mehmondo‘stlik va 5 yulduzli qulaylik maskani.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tezkor havolalar</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-white transition">Bosh sahifa</a></li>
                <li><a href="#rooms-section" className="hover:text-white transition">Xonalar katalogi</a></li>
                <li><a href="#advantages" className="hover:text-white transition">Nega aynan biz?</a></li>
                <li><a href="#services" className="hover:text-white transition">Spa va Restoran</a></li>
                <li><a href="#reviews" className="hover:text-white transition">Mehmonlar sharhlari</a></li>
              </ul>
            </div>

            {/* Management login */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tizim boshqaruvi</h4>
              <p className="text-xs text-gray-400 mb-3">
                Mehmonxona xodimlari va administratorlar uchun boshqaruv paneliga kirish.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                <span>Boshqaruv tizimiga kirish</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Bog‘lanish</h4>
              <div className="space-y-2.5 text-xs text-gray-400">
                <p className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Amir Temur shoh ko‘chasi 15, Yunusobod tumani, Toshkent</span>
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

          <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Origin Hotel Tashkent. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition">Maxfiylik siyosati</a>
              <a href="#" className="hover:text-white transition">Foydalanish shartlari</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Room Booking Modal ─────────────────────────────────────────────────── */}
      {bookingModalRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setBookingModalRoom(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Bron muvaffaqiyatli qabul qilindi!
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Rahmat, <strong>{guestName}</strong>! Qabulxona xodimimiz tez orada <strong>{guestPhone}</strong> raqamingizga qo‘ng‘iroq qilib, buyurtmani tasdiqlaydi.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Xona band qilish
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1 mb-2">
                  {bookingModalRoom.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Narxi: <strong className="text-gray-900">{bookingModalRoom.price.toLocaleString('uz-UZ')} so‘m</strong> / kecha
                </p>
                {bookedRoomIds.includes(bookingModalRoom.id) && (
                  <p className="text-xs text-red-600 font-semibold mb-4">
                    Bu xona allaqachon band qilingan. Boshqa xona tanlang.
                  </p>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ism va familiyangiz
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jasur Aliyev"
                      value={guestName}
                      onChange={(e) => handleNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      inputMode="text"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Telefon raqamingiz
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998901234567"
                      value={guestPhone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      inputMode="numeric"
                      pattern="\+[0-9]*"
                      maxLength={14}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Kirish sanasi
                      </label>
                      <input
                        type="date"
                        defaultValue="2026-10-16"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Chiqish sanasi
                      </label>
                      <input
                        type="date"
                        defaultValue="2026-10-18"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookedRoomIds.includes(bookingModalRoom.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookedRoomIds.includes(bookingModalRoom.id) ? 'Bu xona band qilingan' : 'Buyurtmani tasdiqlash'}
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
