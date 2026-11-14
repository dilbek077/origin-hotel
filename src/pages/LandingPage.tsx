import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/theme";
import { StorageService } from "@/services/storage";
import type { Room } from "@/types/room";
import "@/origin-landing.css";

interface DisplayRoomItem {
  id: number;
  name: string;
  type: string;
  desc: string;
  price: number;
  capacity: string;
  chips: string[];
  tag: string;
  colorA: string;
  colorB: string;
  imageUrl?: string;
  roomNumbers: string[];
  availableCount: number;
  totalCount: number;
}

const ROOM_TYPE_METADATA: Record<
  string,
  {
    name: string;
    desc: string;
    defaultPrice: number;
    chips: string[];
    tag: string;
    colorA: string;
    colorB: string;
  }
> = {
  Standart: {
    name: "Standart",
    desc: "Ikki kishilik qulay xona, shahar manzarasi.",
    defaultPrice: 350000,
    chips: ["22 m²", "Wi-Fi"],
    tag: "Tejamkor",
    colorA: "#334155",
    colorB: "#64748b",
  },
  Deluxe: {
    name: "Deluxe",
    desc: "Keng xona, ish stoli va mini-bar bilan.",
    defaultPrice: 550000,
    chips: ["34 m²", "King size", "Mini-bar"],
    tag: "Ommabop",
    colorA: "#1e293b",
    colorB: "#c8a15a",
  },
  Suite: {
    name: "Suite",
    desc: "Alohida mehmonxona va yotoqxonali lyuks.",
    defaultPrice: 900000,
    chips: ["58 m²", "2 xonali", "Vanna"],
    tag: "Premium",
    colorA: "#0b1220",
    colorB: "#8b6f3a",
  },
  President: {
    name: "President",
    desc: "Eng yuqori darajadagi hashamat, keng shahar panoramasi va maxsus VIP xizmat.",
    defaultPrice: 1500000,
    chips: ["85 m²", "King size", "VIP xizmat"],
    tag: "Eksklyuziv",
    colorA: "#0f172a",
    colorB: "#b45309",
  },
};

interface ExtraService {
  k: "b" | "t" | "l";
  name: string;
  price: number;
  perNight: boolean;
  desc: string;
}

const EXTRAS: ExtraService[] = [
  { k: "b", name: "Nonushta", price: 60000, perNight: true, desc: "Har kecha, shved stoli" },
  { k: "t", name: "Aeroport transferi", price: 120000, perNight: false, desc: "Bir martalik" },
  { k: "l", name: "Kech chiqish (16:00)", price: 100000, perNight: false, desc: "Bir martalik" },
];

const fmt = (n: number) => n.toLocaleString("en-US");
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const formatDateDisplay = (v: string) => v.split("-").reverse().join(".");

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  // Admin paneldagi xonalarni storage dan yuklash va o'zgarishlarni real-time kuzatish
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());

  useEffect(() => {
    const handleUpdate = () => {
      setRooms(StorageService.getRooms());
    };
    handleUpdate();
    window.addEventListener("origin-hotel-storage-change", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("origin-hotel-storage-change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Sanalar
  const todayIso = useMemo(() => isoDate(new Date()), []);
  const [checkIn, setCheckIn] = useState<string>(() => isoDate(new Date(Date.now() + 864e5)));
  const [checkOut, setCheckOut] = useState<string>(() => isoDate(new Date(Date.now() + 3 * 864e5)));
  const [guests, setGuests] = useState<string>("2 kishi");

  // Admin paneldan bo'sh xonalar soni
  const vacantCount = useMemo(() => {
    return rooms.filter((r) => r.status === "Bo'sh").length;
  }, [rooms]);

  // Admin paneldagi xonalarga asoslangan dinamik xona turlari
  const displayRooms: DisplayRoomItem[] = useMemo(() => {
    const baseTypes = ["Standart", "Deluxe", "Suite", "President"];
    const loadedTypes = Array.from(new Set(rooms.map((r) => r.type)));
    const allTypes = Array.from(new Set([...baseTypes, ...loadedTypes]));

    return allTypes
      .map((typeName, idx) => {
        const matchingRooms = rooms.filter((r) => r.type === typeName);
        if (matchingRooms.length === 0) return null;

        const meta = ROOM_TYPE_METADATA[typeName] || {
          name: typeName,
          desc: `${typeName} xonasi, zamonaviy qulayliklar bilan.`,
          defaultPrice: 400000,
          chips: ["Wi-Fi", "Qulay sharoit"],
          tag: "Maxsus",
          colorA: "#1e293b",
          colorB: "#64748b",
        };

        const minPrice = Math.min(...matchingRooms.map((r) => r.pricePerNight));
        const capacity = matchingRooms[0].capacity || "2 kishilik";
        const imageRoom = matchingRooms.find((r) => r.imageUrl);
        const imageUrl = imageRoom?.imageUrl;
        const availableRooms = matchingRooms.filter((r) =>
          StorageService.checkRoomAvailability(r.id, checkIn, checkOut)
        );

        const chips = [capacity, ...meta.chips];

        return {
          id: idx + 1,
          name: typeName,
          type: typeName,
          desc: meta.desc,
          price: minPrice,
          capacity,
          chips,
          tag: meta.tag,
          colorA: meta.colorA,
          colorB: meta.colorB,
          imageUrl,
          roomNumbers: matchingRooms.map((r) => r.number),
          availableCount: availableRooms.length,
          totalCount: matchingRooms.length,
        };
      })
      .filter(Boolean) as DisplayRoomItem[];
  }, [rooms, checkIn, checkOut]);

  // Modal holati
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [payMethod, setPayMethod] = useState<"hotel" | "card">("hotel");
  const [bookingCode, setBookingCode] = useState("");
  const [formError, setFormError] = useState("");

  const selectedRoom = useMemo(() => {
    if (!selectedRoomName) return null;
    return displayRooms.find((r) => r.name === selectedRoomName) || null;
  }, [selectedRoomName, displayRooms]);

  // Kechalar soni hisobi
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 864e5);
    return Math.max(0, diff) || 0;
  }, [checkIn, checkOut]);

  // Jami narx hisobi
  const calculateTotal = useMemo(() => {
    if (!selectedRoom) return 0;
    let total = selectedRoom.price * nightsCount;
    EXTRAS.forEach((e) => {
      if (selectedExtras[e.k]) {
        total += e.price * (e.perNight ? nightsCount : 1);
      }
    });
    return total;
  }, [selectedRoom, nightsCount, selectedExtras]);

  // Modalni ochish
  const handleOpenBooking = (roomName: string) => {
    setSelectedRoomName(roomName);
    setSelectedExtras({});
    setGuestName("");
    setGuestPhone("");
    setPayMethod("hotel");
    setModalStep(0);
    setFormError("");
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Modalni yopish
  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  // ESC orqali yopish
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  // 1-bosqichdan 2-bosqichga o'tish
  const handleNextToStep1 = () => {
    if (nightsCount <= 0) return;
    setModalStep(1);
    setFormError("");
  };

  // Bronni tasdiqlash (2-bosqichdan 3-bosqichga)
  const handleConfirmBooking = () => {
    const trimmedName = guestName.trim();
    const cleanPhone = guestPhone.replace(/\D/g, "");

    if (trimmedName.length < 3) {
      setFormError("Ism va familiyangizni kiriting.");
      return;
    }
    if (cleanPhone.length < 9) {
      setFormError("Telefon raqamini to‘liq kiriting.");
      return;
    }
    if (!selectedRoom) {
      setFormError("Xona tanlanmagan.");
      return;
    }

    // Tanlangan sanalarda bo'sh xonani topamiz
    const allRooms = StorageService.getRooms();
    const matchingRooms = allRooms.filter((r) => r.type === selectedRoom.name);
    const availableRoom = matchingRooms.find((r) =>
      StorageService.checkRoomAvailability(r.id, checkIn, checkOut)
    );

    if (!availableRoom) {
      setFormError("Kechirasiz, tanlangan sanalarda ushbu turdagi bo‘sh xona qolmagan. Iltimos, boshqa sanani yoki boshqa xona turini tanlang.");
      return;
    }

    const code = "OG-" + Math.floor(10000 + Math.random() * 89999);
    setBookingCode(code);

    try {
      const guestsList = StorageService.getGuests();
      const existingGuest = guestsList.find((g) => g.fullName.toLowerCase() === trimmedName.toLowerCase());

      let guestId = existingGuest ? existingGuest.id : Date.now();
      if (!existingGuest) {
        StorageService.addGuest({
          fullName: trimmedName,
          phone: guestPhone.trim(),
          passport: "AA" + Math.floor(1000000 + Math.random() * 8999999),
          notes: `Saytdan bron: ${code}, ${payMethod === "card" ? "Karta" : "Mehmonxonada"}`,
          address: "Toshkent shahri",
          lastVisit: checkIn,
        });
      }

      const res = StorageService.addBooking({
        guestId: guestId,
        guest: trimmedName,
        roomId: availableRoom.id,
        room: `${availableRoom.number} — ${availableRoom.type}`,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nightsCount,
        price: calculateTotal,
        status: "Kutilmoqda",
        notes: `Saytdan avtomatik bron (${code}). Xona: ${availableRoom.number}. To'lov: ${payMethod === "card" ? "Karta orqali" : "Mehmonxonada"}. Tel: ${guestPhone.trim()}`,
      });

      if (!res.success) {
        setFormError(res.error || "Bron qilishda xatolik yuz berdi.");
        return;
      }

      setModalStep(2);
    } catch (err) {
      console.warn("StorageService sync notice:", err);
      setFormError("Bron qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="landing-page-root">
      {/* HEADER */}
      <header className="landing-header">
        <div className="wrap nav">
          <a className="logo" href="#top">
            <i>O</i>Origin Hotel
          </a>
          <a className="l" href="#xonalar">
            Xonalar
          </a>
          <a className="l" href="#qulayliklar">
            Qulayliklar
          </a>
          <a className="l" href="#sharhlar">
            Sharhlar
          </a>
          <a className="l" href="#manzil">
            Manzil
          </a>
          <button
            className={`theme-toggle-btn ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
            id="theme"
            aria-label={isDark ? "Yorug‘ rejimga o‘tish" : "Qorong‘i rejimga o‘tish"}
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            title={isDark ? "Yorug‘ rejim" : "Qorong‘i rejim"}
          >
            {isDark ? (
              <Sun size={19} strokeWidth={2.1} />
            ) : (
              <Moon size={19} strokeWidth={2.1} />
            )}
          </button>
          <Link to="/login" className="login-btn" title="Admin panelga kirish">
            Kirish
          </Link>
          <button
            className="btn"
            onClick={() => {
              const el = document.getElementById("xonalar");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Band qilish
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main id="top">
        {/* HERO SECTION */}
        <div className="landing-hero">
          <div className="ph" role="img" aria-label="Origin Hotel binosi"></div>
          <div className="wrap">
            <div>
              <div className="badge">
                <b>★ 4.9</b> 1 200 dan ortiq mehmon bahosi
              </div>
              <h1 className="serif">
                Shahar markazidagi <em>sokin</em> oromgoh
              </h1>
              <p>
                Toshkentning yuragida zamonaviy xonalar, shinam nonushta va 24 soat ishlaydigan qabulxona. Xush
                kelibsiz.
              </p>
              <div className="cta">
                <a className="btn" href="#xonalar">
                  Xonalarni ko‘rish
                </a>
                <a className="btn o" href="#manzil">
                  Manzilni ko‘rish
                </a>
              </div>
            </div>
            <div className="tw">
              <div className="fl">
                <b>{vacantCount} ta bo‘sh xona</b>
                <span>Bugun uchun</span>
              </div>
              <svg className="tower" viewBox="0 0 400 460" aria-hidden="true">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2a3b66" />
                    <stop offset="1" stopColor="#101a33" />
                  </linearGradient>
                </defs>
                <rect x="40" y="130" width="130" height="300" rx="8" fill="url(#g1)" />
                <rect
                  x="150"
                  y="40"
                  width="150"
                  height="390"
                  rx="10"
                  fill="url(#g1)"
                  stroke="rgba(255,255,255,.15)"
                />
                <rect x="290" y="190" width="80" height="240" rx="8" fill="url(#g1)" />
                <g fill="#c8a15a" opacity=".9">
                  <rect x="170" y="70" width="16" height="22" rx="3" />
                  <rect x="204" y="70" width="16" height="22" rx="3" />
                  <rect x="238" y="110" width="16" height="22" rx="3" />
                  <rect x="272" y="70" width="16" height="22" rx="3" />
                  <rect x="170" y="150" width="16" height="22" rx="3" />
                  <rect x="204" y="190" width="16" height="22" rx="3" />
                  <rect x="272" y="230" width="16" height="22" rx="3" />
                  <rect x="238" y="270" width="16" height="22" rx="3" />
                  <rect x="170" y="310" width="16" height="22" rx="3" />
                  <rect x="60" y="170" width="14" height="20" rx="3" />
                  <rect x="100" y="250" width="14" height="20" rx="3" />
                  <rect x="310" y="230" width="14" height="20" rx="3" />
                </g>
                <g fill="rgba(255,255,255,.14)">
                  <rect x="170" y="110" width="16" height="22" rx="3" />
                  <rect x="238" y="70" width="16" height="22" rx="3" />
                  <rect x="204" y="150" width="16" height="22" rx="3" />
                  <rect x="272" y="150" width="16" height="22" rx="3" />
                  <rect x="238" y="190" width="16" height="22" rx="3" />
                  <rect x="170" y="230" width="16" height="22" rx="3" />
                  <rect x="204" y="270" width="16" height="22" rx="3" />
                  <rect x="60" y="210" width="14" height="20" rx="3" />
                  <rect x="100" y="170" width="14" height="20" rx="3" />
                  <rect x="340" y="270" width="14" height="20" rx="3" />
                </g>
                <rect x="205" y="370" width="40" height="60" rx="6" fill="#c8a15a" />
                <rect x="0" y="430" width="400" height="3" fill="rgba(255,255,255,.2)" />
              </svg>
            </div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <div className="wrap search">
          <div className="panel">
            <div className="sg">
              <div>
                <label htmlFor="checkin-date">Kelish sanasi</label>
                <input
                  type="date"
                  id="checkin-date"
                  min={todayIso}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="checkout-date">Ketish sanasi</label>
                <input
                  type="date"
                  id="checkout-date"
                  min={checkIn || todayIso}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="guests-select">Mehmonlar</label>
                <select
                  id="guests-select"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1 kishi">1 kishi</option>
                  <option value="2 kishi">2 kishi</option>
                  <option value="3 kishi">3 kishi</option>
                  <option value="4 kishi">4 kishi</option>
                </select>
              </div>
              <button
                className="btn dk"
                onClick={() => {
                  const el = document.getElementById("xonalar");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Xonalarni ko‘rish
              </button>
            </div>
            <div className="info">
              {nightsCount > 0 ? (
                <>
                  Tanlangan sana: <b>{nightsCount} kecha</b>, {guests}. Narxlar quyidagi kartalarda hisoblandi.
                </>
              ) : (
                "Ketish sanasi kelish sanasidan keyin bo‘lishi kerak."
              )}
            </div>
          </div>
        </div>

        {/* XONALAR SECTION */}
        <section id="xonalar">
          <div className="wrap">
            <div className="h">
              <h2 className="serif">Sizga mos xonani tanlang</h2>
              <p>Narxlar bir kecha uchun, barcha soliqlar bilan. Xonani tanlang va bir necha soniyada onlayn band qiling.</p>
            </div>
            <div className="rooms">
              {displayRooms.map((room) => (
                <article key={room.name} className="room">
                  <div className="pic">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={room.name} />
                    ) : (
                      <svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <defs>
                          <linearGradient id={`scene-grad-${room.name}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor={room.colorA} />
                            <stop offset="1" stopColor={room.colorB} />
                          </linearGradient>
                        </defs>
                        <rect width="400" height="210" fill={`url(#scene-grad-${room.name})`} />
                        <rect x="250" y="30" width="110" height="90" rx="6" fill="rgba(255,255,255,.18)" />
                        <path d="M305 30v90M250 75h110" stroke="rgba(255,255,255,.4)" strokeWidth="3" />
                        <rect x="40" y="110" width="220" height="60" rx="10" fill="#f8fafc" />
                        <rect x="40" y="100" width="40" height="35" rx="8" fill="#e2e8f0" />
                        <rect x="90" y="100" width="40" height="35" rx="8" fill="#e2e8f0" />
                        <rect x="40" y="140" width="220" height="40" rx="8" fill="rgba(15,23,42,.55)" />
                        <rect x="30" y="170" width="12" height="22" fill="#0b1220" />
                        <rect x="258" y="170" width="12" height="22" fill="#0b1220" />
                        <rect x="0" y="192" width="400" height="18" fill="rgba(0,0,0,.25)" />
                      </svg>
                    )}
                    <span className="tag">{room.tag}</span>
                    <span className={`avail-tag ${room.availableCount > 0 ? "ok" : "busy"}`}>
                      {room.availableCount > 0 ? `${room.availableCount} ta bo‘sh` : "Band"}
                    </span>
                  </div>
                  <div className="rb">
                    <h3>{room.name}</h3>
                    <p>{room.desc}</p>
                    <div className="chips">
                      {room.chips.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                    <div className="rf">
                      <div className="price">
                        {fmt(room.price)} so‘m
                        <small>
                          {nightsCount > 0
                            ? `${nightsCount} kecha: ${fmt(room.price * nightsCount)} so‘m`
                            : "bir kecha uchun"}
                        </small>
                      </div>
                      <button className="btn dk" onClick={() => handleOpenBooking(room.name)}>
                        Band qilish
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* QULAYLIKLAR SECTION */}
        <section id="qulayliklar" className="dark">
          <div className="wrap">
            <div className="h">
              <h2 className="serif">Qulayliklar</h2>
              <p>Qulay turar joy uchun kerakli hamma narsa bir joyda.</p>
            </div>
            <div className="feat">
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01" />
                </svg>
                <h3>Tezkor Wi-Fi</h3>
                <p>Barcha xonalarda bepul va barqaror internet.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M6 3v8M10 3v8M6 7h4M8 11v10M17 3c-2 2-2 6 0 8v10" />
                </svg>
                <h3>Nonushta</h3>
                <p>Har kuni 07:00 dan 10:30 gacha shved stoli.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M3 16l2-8h14l2 8M5 16v3M19 16v3M7 12h10" />
                </svg>
                <h3>Transfer</h3>
                <p>Aeroport va vokzaldan olib ketamiz.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
                </svg>
                <h3>Xavfsizlik</h3>
                <p>Kuzatuv va xonadagi seyf har doim ishlaydi.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" />
                </svg>
                <h3>Yig‘ilish zali</h3>
                <p>20 kishigacha, proyektor va ovoz tizimi bilan.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                </svg>
                <h3>24/7 qabulxona</h3>
                <p>Istalgan vaqtda ro‘yxatdan o‘tish mumkin.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M5 17h14M7 17V7h10v10M9 21h6" />
                </svg>
                <h3>Avtoturargoh</h3>
                <p>Mehmonlar uchun bepul va qo‘riqlanadigan.</p>
              </div>
              <div className="f">
                <svg viewBox="0 0 24 24">
                  <path d="M4 14c3-4 5 4 8 0s5 4 8 0M4 8c3-4 5 4 8 0s5 4 8 0" />
                </svg>
                <h3>Spa va sauna</h3>
                <p>Ish kunidan keyin dam olish uchun.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SHARHLAR SECTION */}
        <section id="sharhlar">
          <div className="wrap">
            <div className="h">
              <h2 className="serif">Mehmonlar nima deydi</h2>
              <p>Haqiqiy mehmonlarimizning fikrlari.</p>
            </div>
            <div className="rev">
              <div className="rv">
                <div className="st">★★★★★</div>
                <p>Xona juda toza va tinch edi. Qabulxona xodimlari hamma narsada yordam berishdi.</p>
                <div className="who">
                  <i>JA</i>
                  <div>
                    Jasur Aliyev<span>Biznes safar</span>
                  </div>
                </div>
              </div>
              <div className="rv">
                <div className="st">★★★★★</div>
                <p>Nonushta mazali, joylashuv ajoyib. Metroga besh daqiqa. Yana kelamiz.</p>
                <div className="who">
                  <i>MK</i>
                  <div>
                    Malika Karimova<span>Oilaviy dam olish</span>
                  </div>
                </div>
              </div>
              <div className="rv">
                <div className="st">★★★★★</div>
                <p>Suite xonasi rasmdagidan ham yaxshi chiqdi. Transfer vaqtida kutib oldi.</p>
                <div className="who">
                  <i>SU</i>
                  <div>
                    Sardor Ulug‘bekov<span>Mehmon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MANZIL SECTION */}
        <section id="manzil" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="h">
              <h2 className="serif">Bizni toping</h2>
              <p>Shahar markazida, asosiy diqqatga sazovor joylarga yaqin.</p>
            </div>
            <div className="loc">
              <div className="card">
                <h3>Origin Hotel</h3>
                <div className="li">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  <div>
                    Toshkent, Amir Temur ko‘chasi, 15
                    <span>Mustaqillik maydoniga 300 m</span>
                  </div>
                </div>
                <div className="li">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  <div>
                    <a href="tel:+998712000000">+998 71 200 00 00</a>
                    <span>Har kuni, 24 soat</span>
                  </div>
                </div>
                <div className="li">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
                  </svg>
                  <div>
                    info@originhotel.uz
                    <span>24 soat ichida javob beramiz</span>
                  </div>
                </div>
                <div className="li">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                  </svg>
                  <div>
                    Kelish 14:00, ketish 12:00
                    <span>Erta kelish so‘rov bo‘yicha</span>
                  </div>
                </div>
              </div>
              <div className="map">
                <svg viewBox="0 0 700 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="700" height="460" fill="var(--map1)" />
                  <path
                    d="M0 360 C150 330 230 400 380 370 S600 300 700 330 V460 H0Z"
                    fill="var(--water)"
                  />
                  <rect x="470" y="40" width="190" height="130" rx="22" fill="var(--park)" />
                  <rect x="40" y="250" width="150" height="90" rx="18" fill="var(--park)" />
                  <g stroke="var(--map2)" strokeWidth="16" fill="none" strokeLinecap="round">
                    <path d="M-10 200H710" />
                    <path d="M300 -10V470" />
                    <path d="M-10 90L710 150" />
                    <path d="M130 -10L220 470" />
                    <path d="M520 -10L430 470" />
                  </g>
                  <g stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" strokeDasharray="10 12">
                    <path d="M-10 200H710" />
                    <path d="M300 -10V470" />
                  </g>
                  <g fill="var(--map2)">
                    <rect x="330" y="215" width="70" height="50" rx="8" />
                    <rect x="215" y="215" width="70" height="50" rx="8" />
                    <rect x="330" y="110" width="80" height="70" rx="8" />
                    <rect x="215" y="120" width="70" height="60" rx="8" />
                    <rect x="560" y="215" width="100" height="60" rx="8" />
                  </g>
                </svg>
                <div className="pin">
                  <b>Origin Hotel</b>
                  <i></i>
                </div>
                <a
                  className="btn dk mb"
                  href="https://www.google.com/maps/search/?api=1&query=Amir+Temur+ko%CA%BBchasi+Tashkent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xaritada ochish
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="wrap">
          <div className="fg">
            <div>
              <a className="logo" href="#top" style={{ display: "flex", color: "#fff", padding: 0 }}>
                <i>O</i>Origin Hotel
              </a>
              <p>
                Toshkent markazidagi zamonaviy mehmonxona. Qulay xonalar, shinam nonushta va 24 soat ishlaydigan
                qabulxona.
              </p>
            </div>
            <div>
              <h4>Sahifalar</h4>
              <a href="#xonalar">Xonalar</a>
              <a href="#qulayliklar">Qulayliklar</a>
              <a href="#sharhlar">Sharhlar</a>
              <a href="#manzil">Manzil</a>
            </div>
            <div>
              <h4>Ish vaqti</h4>
              <span>Qabulxona: 24 soat</span>
              <span>Kelish: 14:00</span>
              <span>Ketish: 12:00</span>
              <span>Nonushta: 07:00–10:30</span>
            </div>
            <div>
              <h4>Aloqa</h4>
              <a href="tel:+998712000000">+998 71 200 00 00</a>
              <a href="mailto:info@originhotel.uz">info@originhotel.uz</a>
              <span>Toshkent, Amir Temur ko‘chasi, 15</span>
            </div>
          </div>
          <div className="fb">
            <span>© 2026 Origin Hotel. Barcha huquqlar himoyalangan.</span>
            <span>Toshkent, O‘zbekiston</span>
          </div>
        </div>
      </footer>

      {/* MODAL (BAND QILISH / BOOKING) */}
      {modalOpen && selectedRoom && (
        <div
          className="ov"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="md" role="dialog" aria-modal="true" aria-labelledby="mt">
            <button className="x" aria-label="Yopish" onClick={handleCloseModal}>
              ✕
            </button>

            <div className="stp" id="stp">
              <span className={modalStep >= 0 ? "on" : ""}>Xulosa</span>
              <span className={modalStep >= 1 ? "on" : ""}>Ma’lumotlar</span>
              <span className={modalStep >= 2 ? "on" : ""}>Tasdiq</span>
            </div>

            {/* STEP 0: XULOSA */}
            {modalStep === 0 && (
              <div>
                {nightsCount <= 0 ? (
                  <div>
                    <h3 id="mt">Sanalarni tekshiring</h3>
                    <p className="mm">
                      Ketish sanasi kelish sanasidan keyin bo‘lishi kerak. Sahifa tepasidagi qidiruv panelida sanalarni
                      to‘g‘rilang.
                    </p>
                    <button className="btn dk w" onClick={handleCloseModal}>
                      Tushunarli
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 id="mt">{selectedRoom.name} xonasi</h3>
                    <div className="sm">
                      <div>
                        <span>Kelish</span>
                        <b>{formatDateDisplay(checkIn)}</b>
                      </div>
                      <div>
                        <span>Ketish</span>
                        <b>{formatDateDisplay(checkOut)}</b>
                      </div>
                      <div>
                        <span>Mehmonlar</span>
                        <b>{guests}</b>
                      </div>
                    </div>

                    <h4>Qo‘shimcha xizmatlar</h4>
                    {EXTRAS.map((extra) => (
                      <label key={extra.k} className="ex">
                        <input
                          type="checkbox"
                          checked={!!selectedExtras[extra.k]}
                          onChange={(e) =>
                            setSelectedExtras((prev) => ({
                              ...prev,
                              [extra.k]: e.target.checked,
                            }))
                          }
                        />
                        <div>
                          {extra.name}
                          <span>{extra.desc}</span>
                        </div>
                        <b>+{fmt(extra.price)}</b>
                      </label>
                    ))}

                    <div className="tt">
                      <span>
                        {nightsCount} kecha × {fmt(selectedRoom.price)} so‘m + xizmatlar
                      </span>
                      <b>{fmt(calculateTotal)} so‘m</b>
                    </div>

                    <button className="btn dk w" onClick={handleNextToStep1}>
                      Davom etish
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: MA'LUMOTLAR */}
            {modalStep === 1 && (
              <div>
                <h3 id="mt">Ma’lumotlaringiz</h3>
                <div className="fld">
                  <label htmlFor="bn">Ism va familiya</label>
                  <input
                    id="bn"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Masalan, Aliyev Jasur"
                    autoComplete="name"
                  />
                </div>
                <div className="fld">
                  <label htmlFor="bp">Telefon raqami</label>
                  <input
                    id="bp"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    autoComplete="tel"
                  />
                </div>
                <label>To‘lov usuli</label>
                <div className="pay">
                  <button
                    type="button"
                    className={payMethod === "hotel" ? "on" : ""}
                    onClick={() => setPayMethod("hotel")}
                  >
                    Mehmonxonada to‘layman
                  </button>
                  <button
                    type="button"
                    className={payMethod === "card" ? "on" : ""}
                    onClick={() => setPayMethod("card")}
                  >
                    Karta orqali
                  </button>
                </div>

                {formError && (
                  <p className="err" role="alert">
                    {formError}
                  </p>
                )}

                <div className="tt" style={{ marginTop: 0 }}>
                  <span>Jami</span>
                  <b>{fmt(calculateTotal)} so‘m</b>
                </div>

                <button className="btn dk w" onClick={handleConfirmBooking}>
                  Bronni tasdiqlash
                </button>
                <button className="btn w sec" onClick={() => setModalStep(0)}>
                  Orqaga
                </button>
              </div>
            )}

            {/* STEP 2: TASDIQ */}
            {modalStep === 2 && (
              <div>
                <div className="okc">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <h3 id="mt">Bron qabul qilindi</h3>
                <p className="mm" style={{ marginTop: -6 }}>
                  Bron raqami: <span className="code">{bookingCode}</span>
                </p>

                <div className="rw">
                  <span>Xona</span>
                  <b>{selectedRoom.name}</b>
                </div>
                <div className="rw">
                  <span>Sanalar</span>
                  <b>
                    {formatDateDisplay(checkIn)} — {formatDateDisplay(checkOut)}
                  </b>
                </div>
                <div className="rw">
                  <span>To‘lov</span>
                  <b>{payMethod === "card" ? "Karta (havola yuboriladi)" : "Mehmonxonada"}</b>
                </div>
                <div className="rw">
                  <span>Jami</span>
                  <b>{fmt(calculateTotal)} so‘m</b>
                </div>

                <div className="adm">
                  <i>
                    {guestName
                      .trim()
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "OK"}
                  </i>
                  <div>
                    <b>{guestName.trim()}</b>
                    <span>
                      {selectedRoom.name} · {nightsCount} kecha · admin panelga tushdi
                    </span>
                  </div>
                  <span className="pill">Kutilmoqda</span>
                </div>

                <p className="mm" style={{ fontSize: 14 }}>
                  Administrator bronni tasdiqlaydi va 15 daqiqa ichida {guestPhone} raqamiga qo‘ng‘iroq qiladi.
                </p>

                <button className="btn dk w" onClick={handleCloseModal}>
                  Yopish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
