import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, ChevronDown, ChevronLeft, ChevronRight, Clock, Hotel, LogOut, Sun, Moon, UserRound, Wifi } from "lucide-react";
import { useTheme } from "@/theme";
import { StorageService } from "@/services/storage";
import { isUserAuthenticated, getStoredCurrentUser, logoutUser } from "@/services/mockAuth";
import { BookingStateService } from "@/services/bookingState";
import { AuthRequiredModal } from "@/components/bookings/AuthRequiredModal";
import { HOTEL_INFORMATION, type HotelInfoKey } from "@/data/hotelInformation";
import type { Room } from "@/types/room";
import "@/origin-landing.css";

type FacilityKey = HotelInfoKey | "breakfast" | "security" | "meeting";

interface FacilityInformation {
  title: string;
  description: string;
  items: string[];
}

interface GuestReview {
  id: string;
  name: string;
  context: string;
  text: string;
  rating: number;
}

const REVIEW_STORAGE_KEY = "origin_hotel_reviews";

const SAMPLE_REVIEWS: GuestReview[] = [
  {
    id: "sample-jasur",
    name: "Jasur Aliyev",
    context: "Biznes safar",
    text: "Xona juda toza va tinch edi. Qabulxona xodimlari hamma narsada yordam berishdi.",
    rating: 5,
  },
  {
    id: "sample-malika",
    name: "Malika Karimova",
    context: "Oilaviy dam olish",
    text: "Nonushta mazali, joylashuv ajoyib. Metroga besh daqiqa. Yana kelamiz.",
    rating: 5,
  },
  {
    id: "sample-sardor",
    name: "Sardor Ulug‘bekov",
    context: "Mehmon",
    text: "Suite xonasi rasmdagidan ham yaxshi chiqdi. Transfer vaqtida kutib oldi.",
    rating: 5,
  },
];

const isGuestReview = (value: unknown): value is GuestReview =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "string" &&
  "name" in value &&
  typeof value.name === "string" &&
  "context" in value &&
  typeof value.context === "string" &&
  "text" in value &&
  typeof value.text === "string" &&
  "rating" in value &&
  typeof value.rating === "number" &&
  Number.isInteger(value.rating) &&
  value.rating >= 1 &&
  value.rating <= 5;

const readStoredReviews = (): GuestReview[] => {
  try {
    const savedReviews = window.localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!savedReviews) return [];

    const parsedReviews: unknown = JSON.parse(savedReviews);
    if (!Array.isArray(parsedReviews) || !parsedReviews.every(isGuestReview)) {
      throw new Error("Stored reviews have an invalid format.");
    }
    return parsedReviews;
  } catch (error) {
    console.error("Could not load saved guest reviews:", error);
    return [];
  }
};

const FACILITY_INFORMATION: Record<FacilityKey, FacilityInformation> = {
  ...HOTEL_INFORMATION,
  breakfast: {
    title: "Nonushta",
    description: "Har kuni 07:00 dan 10:30 gacha shved stoli.",
    items: ["Nonushta vaqti: 07:00–10:30", "Shved stoli"],
  },
  security: {
    title: "Xavfsizlik",
    description: "Mehmonlar xavfsizligi uchun kuzatuv va xonada seyf mavjud.",
    items: ["Mehmonxona hududida kuzatuv", "Xonada seyf"],
  },
  meeting: {
    title: "Yig‘ilish zali",
    description: "Uchrashuv va tadbirlar uchun jihozlangan zal.",
    items: ["20 kishigacha", "Proyektor", "Ovoz tizimi"],
  },
};

interface DisplayRoomItem {
  id: number;
  roomNumber: string;
  name: string;
  type: string;
  desc: string;
  price: number;
  capacity: string;
  chips: string[];
  amenities: string[];
  tag: string;
  colorA: string;
  colorB: string;
  imageUrl?: string;
  isAvailable: boolean;
  availabilityLabel: string;
}

const ROOM_TYPE_METADATA: Record<
  string,
  {
    name: string;
    desc: string;
    defaultPrice: number;
    chips: string[];
    amenities: string[];
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
    amenities: ["Konditsioner", "Bepul Wi-Fi", "Televizor", "Fen", "Xalat", "Shahar manzarasi"],
    tag: "Tejamkor",
    colorA: "#334155",
    colorB: "#64748b",
  },
  Deluxe: {
    name: "Deluxe",
    desc: "Keng xona, ish stoli va mini-bar bilan.",
    defaultPrice: 550000,
    chips: ["34 m²", "King size", "Mini-bar"],
    amenities: ["Konditsioner", "Bepul Wi-Fi", "Televizor", "Fen", "Xalat", "King size yotoq", "Ish stoli", "Mini-bar"],
    tag: "Ommabop",
    colorA: "#1e293b",
    colorB: "#c8a15a",
  },
  Suite: {
    name: "Suite",
    desc: "Alohida mehmonxona va yotoqxonali lyuks.",
    defaultPrice: 900000,
    chips: ["58 m²", "2 xonali", "Vanna"],
    amenities: ["Konditsioner", "Bepul Wi-Fi", "Televizor", "Fen", "Xalat", "2 xonali", "Alohida yotoqxona", "Vanna"],
    tag: "Premium",
    colorA: "#0b1220",
    colorB: "#8b6f3a",
  },
  President: {
    name: "President",
    desc: "Eng yuqori darajadagi hashamat, keng shahar panoramasi va maxsus VIP xizmat.",
    defaultPrice: 1500000,
    chips: ["85 m²", "King size", "VIP xizmat"],
    amenities: ["Konditsioner", "Bepul Wi-Fi", "Televizor", "Fen", "Xalat", "King size yotoq", "VIP xizmat", "Bepul transfer"],
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
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => setCurrentUser(getStoredCurrentUser());
    syncAuth();
    window.addEventListener("origin-hotel-auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("origin-hotel-auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Admin paneldagi xonalarni storage dan yuklash va o'zgarishlarni real-time kuzatish
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const landingRef = useRef<HTMLDivElement>(null);
  const roomsTrackRef = useRef<HTMLDivElement>(null);
  const [roomScrollState, setRoomScrollState] = useState({ canPrevious: false, canNext: false });

  useEffect(() => {
    const handleUpdate = () => {
      setRooms([...StorageService.getRooms()]);
    };
    handleUpdate();
    window.addEventListener("origin-hotel-storage-change", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("origin-hotel-storage-change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 560px)");
    const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches);
    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  useEffect(() => {
    const root = landingRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealElements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
      .filter((element) => !element.classList.contains("is-visible"));
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      revealElements.forEach((element) => element.classList.remove("reveal-pending"));
    };
  }, [rooms.length, showAllRooms]);

  // Sanalar
  const todayIso = useMemo(() => isoDate(new Date()), []);
  const [checkIn, setCheckIn] = useState<string>(() => isoDate(new Date(Date.now() + 864e5)));
  const [checkOut, setCheckOut] = useState<string>(() => isoDate(new Date(Date.now() + 3 * 864e5)));
  const [guests, setGuests] = useState<string>("2 kishi");

  // Har bir admin xonasi landing sahifada alohida ko‘rsatiladi
  const displayRooms: DisplayRoomItem[] = useMemo(() => {
    return rooms.map((room) => {
      const typeName = room.type;
      const meta = ROOM_TYPE_METADATA[typeName] || {
        name: typeName,
        desc: `${typeName} xonasi, zamonaviy qulayliklar bilan.`,
        defaultPrice: 400000,
        chips: ["Wi-Fi", "Qulay sharoit"],
        amenities: ["Konditsioner", "Bepul Wi-Fi", "Televizor", "Fen", "Xalat"],
        tag: "Maxsus",
        colorA: "#1e293b",
        colorB: "#64748b",
      };

      const capacity = room.capacity || "2 kishilik";
      const chips = [capacity, ...meta.chips];

      return {
        id: room.id,
        roomNumber: room.number,
        name: typeName,
        type: typeName,
        desc: meta.desc,
        price: room.pricePerNight,
        capacity,
        chips,
        amenities: [...meta.amenities],
        tag: meta.tag,
        colorA: meta.colorA,
        colorB: meta.colorB,
        imageUrl: room.imageUrl,
        isAvailable: room.status === "Bo'sh",
        availabilityLabel: room.status,
      };
    });
  }, [rooms, checkIn, checkOut]);
  const roomPreviewCount = isSmallScreen ? 2 : 3;
  const visibleRooms = showAllRooms ? displayRooms : displayRooms.slice(0, roomPreviewCount);

  useEffect(() => {
    const track = roomsTrackRef.current;
    if (!track) return;

    const updateScrollState = () => {
      const nextState = {
        canPrevious: track.scrollLeft > 2,
        canNext: track.scrollLeft + track.clientWidth < track.scrollWidth - 2,
      };
      setRoomScrollState((currentState) =>
        currentState.canPrevious === nextState.canPrevious && currentState.canNext === nextState.canNext
          ? currentState
          : nextState
      );
    };

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isSmallScreen, showAllRooms, visibleRooms.length]);

  const scrollRooms = (direction: -1 | 1) => {
    const track = roomsTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  // Modal holati
  const [modalOpen, setModalOpen] = useState(false);
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [modalStep, setModalStep] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [detailsRoom, setDetailsRoom] = useState<DisplayRoomItem | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<FacilityKey | null>(null);
  const [visitorReviews] = useState<GuestReview[]>(readStoredReviews);
  
  // Mehmon shaxsiy ma'lumotlari
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("+998 ");
  const [guestPassport, setGuestPassport] = useState("");
  const [guestAddress, setGuestAddress] = useState("");

  const handleGuestPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = "+998 ";
    let raw = e.target.value;
    if (!raw.startsWith(prefix)) {
      raw = prefix;
    }
    const digits = raw.slice(prefix.length).replace(/\D/g, "").slice(0, 9);
    let formatted = prefix;
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
    setGuestPhone(formatted);
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + " " + cleaned.slice(2);
    }
    setGuestPassport(formatted);
  };

  const [payMethod, setPayMethod] = useState<"hotel" | "card">("hotel");
  const [bookingCode, setBookingCode] = useState("");
  const [formError, setFormError] = useState("");

  const selectedRoom = useMemo(() => {
    if (selectedRoomId === null) return null;
    return displayRooms.find((r) => r.id === selectedRoomId) || null;
  }, [selectedRoomId, displayRooms]);

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
  const handleOpenBooking = (roomId: number) => {
    if (!isUserAuthenticated()) {
      BookingStateService.savePendingBooking({
        roomId,
        roomName: displayRooms.find((room) => room.id === roomId)?.name,
        roomNumber: displayRooms.find((room) => room.id === roomId)?.roomNumber,
        checkIn,
        checkOut,
        guests,
        payMethod,
      });
      setAuthRequiredOpen(true);
      return;
    }

    setSelectedRoomId(roomId);
    setSelectedExtras({});
    setPayMethod("hotel");
    setModalStep(0);
    setFormError("");
    setModalOpen(true);
  };

  // Modalni yopish
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!location.state?.resumeBooking) return;
    if (!isUserAuthenticated()) return;

    const pending = BookingStateService.getPendingBooking();
    if (!pending) return;

    setCheckIn(pending.checkIn);
    setCheckOut(pending.checkOut);
    setGuests(pending.guests);
    setPayMethod(pending.payMethod || "hotel");
    setSelectedRoomId(pending.roomId);
    setSelectedExtras({});
    setModalStep(0);
    setFormError("");
    setModalOpen(true);

    const currentUser = getStoredCurrentUser();
    if (currentUser?.name) setGuestName(currentUser.name);
    if (currentUser?.phone) setGuestPhone(currentUser.phone);

    BookingStateService.clearPendingBooking();
  }, [location.state]);

  const handleOpenRoomDetails = (room: DisplayRoomItem) => {
    setDetailsRoom(room);
  };

  const handleCloseRoomDetails = () => {
    setDetailsRoom(null);
  };

  useEffect(() => {
    document.body.style.overflow =
      modalOpen || authRequiredOpen || detailsRoom || selectedFacility ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen, authRequiredOpen, detailsRoom, selectedFacility]);

  // ESC orqali yopish
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modalOpen) handleCloseModal();
        if (authRequiredOpen) setAuthRequiredOpen(false);
        if (detailsRoom) handleCloseRoomDetails();
        if (selectedFacility) setSelectedFacility(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, authRequiredOpen, detailsRoom, selectedFacility]);

  // Bronni tasdiqlash
  const handleConfirmBooking = () => {
    const trimmedName = guestName.trim();
    const cleanPhone = guestPhone.replace(/\D/g, "");
    const cleanPassport = guestPassport.trim();
    const cleanAddress = guestAddress.trim();

    if (trimmedName.length < 3) {
      setFormError("Ism va familiyangizni to‘liq kiriting.");
      return;
    }
    if (cleanPhone.length < 9) {
      setFormError("Telefon raqamini to‘liq kiriting.");
      return;
    }
    if (cleanPassport.length < 7) {
      setFormError("Pasport seriya va raqamini kiriting (masalan: AA 1234567).");
      return;
    }
    if (cleanAddress.length < 3) {
      setFormError("Yashash manzilingizni kiriting.");
      return;
    }
    if (!selectedRoom) {
      setFormError("Xona tanlanmagan.");
      return;
    }

    // Tanlangan sanalarda bo'sh xonani topamiz
    const allRooms = StorageService.getRooms();
    const availableRoom = allRooms.find((r) =>
      r.id === selectedRoom.id &&
      StorageService.checkRoomAvailability(r.id, checkIn, checkOut)
    );

    if (!availableRoom) {
      setFormError("Kechirasiz, tanlangan xona bu sanalarda band. Boshqa xona yoki sanani tanlang.");
      return;
    }

    const code = "OG-" + Math.floor(10000 + Math.random() * 89999);
    setBookingCode(code);

    try {
      const guestsList = StorageService.getGuests();
      const existingGuest = guestsList.find(
        (g) => g.phone === guestPhone.trim() || g.fullName.toLowerCase() === trimmedName.toLowerCase()
      );

      let guestId = existingGuest ? existingGuest.id : Date.now();
      if (!existingGuest) {
        const added = StorageService.addGuest({
          fullName: trimmedName,
          phone: guestPhone.trim(),
          passport: cleanPassport,
          notes: `Saytdan bron: ${code}, ${payMethod === "card" ? "Karta" : "Mehmonxonada"}`,
          address: cleanAddress,
          lastVisit: checkIn,
        });
        guestId = added.id;
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

      setModalStep(1);
    } catch (err) {
      console.warn("StorageService sync notice:", err);
      setFormError("Bron qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div ref={landingRef} className={`landing-page-root ${isDark ? "dark" : ""}`} data-theme={isDark ? "dark" : "light"}>
      <AuthRequiredModal
        isOpen={authRequiredOpen}
        onClose={() => setAuthRequiredOpen(false)}
        pendingBooking={BookingStateService.getPendingBooking()}
        onLogin={() => navigate("/login", { state: { fromBooking: true } })}
        onRegister={() => navigate("/register", { state: { fromBooking: true } })}
      />
      {/* HEADER */}
      <header className="landing-header">
        <div className="wrap nav" data-reveal>
          <a className="logo" href="#top">
            <i aria-hidden="true"><Hotel size={20} /></i>
            <span>Origin Hotel</span>
          </a>
          <nav className="nav-links" aria-label="Asosiy menyu">
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
          </nav>
          <div className="nav-actions">
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
            {currentUser ? (
              <div className="account-menu">
                <button
                  type="button"
                  className="account-menu-button"
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                >
                  <span className="account-avatar"><UserRound size={16} /></span>
                  <span className="account-name">{currentUser.name}</span>
                  <ChevronDown size={14} className={accountMenuOpen ? "account-chevron open" : "account-chevron"} />
                </button>
                {accountMenuOpen && (
                  <div className="account-dropdown" role="menu">
                    <div className="account-dropdown-head">
                      <b>{currentUser.name}</b>
                      <span>{currentUser.role === "GUEST" ? "Mehmon" : "Xodim"}</span>
                    </div>
                    {currentUser.role === "ADMIN" && (
                      <button type="button" role="menuitem" onClick={() => navigate("/admin")}>
                        Boshqaruv paneli
                      </button>
                    )}
                    {currentUser.role === "STAFF" && (
                      <button type="button" role="menuitem" onClick={() => navigate("/staff")}>
                        Boshqaruv paneli
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      className="account-logout"
                      onClick={() => {
                        logoutUser();
                        setAccountMenuOpen(false);
                        setCurrentUser(null);
                      }}
                    >
                      <LogOut size={15} />
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn" title="Tizimga kirish">
                Kirish
              </Link>
            )}
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
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main id="top">
        {/* HERO SECTION */}
        <div className="landing-hero">
          <div className="ph" role="img" aria-label="Origin Hotel binosi"></div>
          <div className="wrap">
            <div data-reveal>
              <div className="badge">
                <b>★ 4.9</b> 1 200 dan ortiq mehmon bahosi
              </div>
              <h1 className="serif">
                Shahar markazidagi <em>shinam</em> mehmonxona
              </h1>
              <p>
                Qarshi markazida zamonaviy xonalar, shinam nonushta va 24 soat ishlaydigan qabulxona. Xush
                kelibsiz.
              </p>
              <ul className="hero-trust" aria-label="Mehmonxona afzalliklari">
                <li><Wifi size={18} aria-hidden="true" />Bepul Wi-Fi</li>
                <li><Clock size={18} aria-hidden="true" />24/7 qabulxona</li>
                <li><Car size={18} aria-hidden="true" />Bepul avtoturargoh</li>
              </ul>
              <div className="cta">
                <a className="btn" href="#xonalar">
                  Xonalarni ko‘rish
                </a>
                <a className="btn o" href="#manzil">
                  Manzilni ko‘rish
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <div className="wrap search">
          <div className="panel" data-reveal>
            <div className="search-heading">
              <h2>Bron qilish</h2>
              <p>Sanalarni tanlang va bo‘sh xonalarni ko‘ring.</p>
            </div>
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
            <div className="rooms-carousel">
              {isSmallScreen && displayRooms.length > 1 && (
                <button
                  type="button"
                  className="rooms-arrow rooms-arrow-previous"
                  aria-label="Oldingi xonalar"
                  onClick={() => scrollRooms(-1)}
                  disabled={!roomScrollState.canPrevious}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
              )}
              <div
                className={`rooms${visibleRooms.length === 1 ? " rooms--single" : visibleRooms.length === 2 ? " rooms--double" : ""}`}
                ref={roomsTrackRef}
              >
                {visibleRooms.map((room) => (
                <article key={room.id} className="room" data-reveal>
                  <div className="pic">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={`#${room.roomNumber} ${room.name} xonasi`} />
                    ) : (
                      <svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <defs>
                          <linearGradient id={`scene-grad-${room.id}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor={room.colorA} />
                            <stop offset="1" stopColor={room.colorB} />
                          </linearGradient>
                        </defs>
                        <rect width="400" height="210" fill={`url(#scene-grad-${room.id})`} />
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
                    <span className={`avail-tag ${room.isAvailable ? "ok" : room.availabilityLabel === "Tozalashda" ? "cleaning" : "busy"}`}>
                      {room.availabilityLabel}
                    </span>
                  </div>
                  <div className="rb">
                    <h3>#{room.roomNumber} · {room.name}</h3>
                    <p>{room.desc}</p>
                    <div className="chips">
                      {room.chips.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                    <button className="room-details-button" onClick={() => handleOpenRoomDetails(room)}>
                      Batafsil <ChevronRight size={16} aria-hidden="true" />
                    </button>
                    <div className="rf">
                      <div className="price">
                        {fmt(room.price)} so‘m
                        <small>
                          {nightsCount > 0
                            ? `${nightsCount} kecha: ${fmt(room.price * nightsCount)} so‘m`
                            : "bir kecha uchun"}
                        </small>
                      </div>
                      <button
                        className="btn dk"
                        onClick={() => handleOpenBooking(room.id)}
                        disabled={!room.isAvailable}
                      >
                        Band qilish
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              </div>
              {isSmallScreen && displayRooms.length > 1 && (
                <button
                  type="button"
                  className="rooms-arrow rooms-arrow-next"
                  aria-label="Keyingi xonalar"
                  onClick={() => scrollRooms(1)}
                  disabled={!roomScrollState.canNext}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              )}
            </div>
            {displayRooms.length > roomPreviewCount && (
              <button
                type="button"
                className="btn dk rooms-more"
                data-reveal
                aria-expanded={showAllRooms}
                onClick={() => setShowAllRooms((show) => !show)}
              >
                {showAllRooms ? "Kamroq ko‘rsatish" : `Barcha xonalarni ko‘rish (${displayRooms.length})`}
              </button>
            )}
          </div>
        </section>

        {/* QULAYLIKLAR SECTION */}
        <section id="qulayliklar" className="facilities-section">
          <div className="wrap">
            <div className="h" data-reveal>
              <h2 className="serif">Qulayliklar</h2>
              <p>Qulay turar joy uchun kerakli hamma narsa bir joyda.</p>
            </div>
            <div className="feat">
              <button type="button" className="f" onClick={() => setSelectedFacility("wifi")}>
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01" />
                </svg>
                <h3>Tezkor Wi-Fi</h3>
                <p>Barcha xonalarda bepul va barqaror internet.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("breakfast")}>
                <svg viewBox="0 0 24 24">
                  <path d="M6 3v8M10 3v8M6 7h4M8 11v10M17 3c-2 2-2 6 0 8v10" />
                </svg>
                <h3>Nonushta</h3>
                <p>Har kuni 07:00 dan 10:30 gacha shved stoli.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("transfer")}>
                <svg viewBox="0 0 24 24">
                  <path d="M3 16l2-8h14l2 8M5 16v3M19 16v3M7 12h10" />
                </svg>
                <h3>Transfer</h3>
                <p>Aeroport va vokzaldan olib ketamiz.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("security")}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
                </svg>
                <h3>Xavfsizlik</h3>
                <p>Kuzatuv va xonadagi seyf har doim ishlaydi.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("meeting")}>
                <svg viewBox="0 0 24 24">
                  <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" />
                </svg>
                <h3>Yig‘ilish zali</h3>
                <p>20 kishigacha, proyektor va ovoz tizimi bilan.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("reception")}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                </svg>
                <h3>24/7 qabulxona</h3>
                <p>Istalgan vaqtda ro‘yxatdan o‘tish mumkin.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("parking")}>
                <svg viewBox="0 0 24 24">
                  <path d="M5 17h14M7 17V7h10v10M9 21h6" />
                </svg>
                <h3>Avtoturargoh</h3>
                <p>Mehmonlar uchun bepul va qo‘riqlanadigan.</p>
              </button>
              <button type="button" className="f" onClick={() => setSelectedFacility("spa")}>
                <svg viewBox="0 0 24 24">
                  <path d="M4 14c3-4 5 4 8 0s5 4 8 0M4 8c3-4 5 4 8 0s5 4 8 0" />
                </svg>
                <h3>Spa va sauna</h3>
                <p>Ish kunidan keyin dam olish uchun.</p>
              </button>
            </div>
          </div>
        </section>

        {selectedFacility && (
          <div
            className="ov facility-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedFacility(null);
            }}
          >
            <div className="md facility-dialog" role="dialog" aria-modal="true" aria-labelledby="facility-title">
              <button className="x" aria-label="Yopish" onClick={() => setSelectedFacility(null)}>
                ✕
              </button>
              <h3 id="facility-title">{FACILITY_INFORMATION[selectedFacility].title}</h3>
              <p className="mm">{FACILITY_INFORMATION[selectedFacility].description}</p>
              <ul className="facility-detail-list">
                {FACILITY_INFORMATION[selectedFacility].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <section id="sharhlar">
          <div className="wrap">
            <div className="h" data-reveal>
              <h2 className="serif">Mehmonlar nima deydi</h2>
              <p>Mehmonlarimizning taassurotlari va baholari.</p>
            </div>
            <div className="rev">
              {[...visitorReviews, ...SAMPLE_REVIEWS].slice(4).map((review, index) => (
                <article className="rv" key={review.id} data-reveal>
                  <div className="st" role="img" aria-label={`${review.rating} yulduzdan ${review.rating}`}>
                    {"★".repeat(review.rating)}
                  </div>
                  <p>{review.text}</p>
                  <div className="who">
                    <i className={`review-avatar review-avatar-${index % 4}`} aria-hidden="true">
                      {review.name.trim().charAt(0).toUpperCase() || "?"}
                    </i>
                    <div>
                      {review.name}
                      <span>{review.context}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MANZIL SECTION */}
        <section id="manzil" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="h" data-reveal>
              <h2 className="serif">Bizni toping</h2>
              <p>Shahar markazida, asosiy diqqatga sazovor joylarga yaqin.</p>
            </div>
            <div className="loc">
              <div className="card" data-reveal>
                <h3>Origin Hotel</h3>
                <div className="li">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  <div>
                    Qarshi, Amir Temur ko‘chasi, 15
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
              <div className="map" data-reveal>
                <iframe
                  title="Origin Hotel joylashuvi"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=65.7915%2C38.8415%2C65.8002%2C38.8470&amp;layer=mapnik&amp;marker=38.8442376%2C65.7958525"
                  aria-label="OpenStreetMap xaritasida Origin Hotel, Qarshi"
                />
                <div className="map-label">
                  <i aria-hidden="true" />
                  <span>
                    <b>Origin Hotel</b>
                    <small>Qarshi markazi</small>
                  </span>
                </div>
                <a
                  className="btn dk mb"
                  href="https://www.google.com/maps/place/Origin+Hotel/@38.8442221,65.7958732,19.38z/data=!4m6!3m5!1s0x3f4ea7000943d029:0xb6072f27825eea07!8m2!3d38.8442376!4d65.7958525!16s%2Fg%2F11zwqnh0w1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Origin Hotel, Qarshi manzilini Google Maps’da ochish"
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
                <i aria-hidden="true"><Hotel size={20} /></i>
                <span>Origin Hotel</span>
              </a>
              <p>
                Qarshi markazidagi zamonaviy mehmonxona. Qulay xonalar, shinam nonushta va 24 soat ishlaydigan
                qabulxona.
              </p>
            </div>
            <div>
              <h4>Sahifalar</h4>
              <a href="#xonalar">Xonalar</a>
              <a href="#qulayliklar">Qulayliklar</a>
              <a href="#sharhlar">Sharhlar</a>
              <a href="#manzil">Manzil</a>
              <Link to="/login" style={{ opacity: 0.75 }}>Admin panel</Link>
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
              <span>Qarshi, Amir Temur ko‘chasi, 15</span>
            </div>
          </div>
          <div className="fb">
            <span>© 2026 Origin Hotel. Barcha huquqlar himoyalangan.</span>
            <Link to="/login" style={{ color: "inherit", opacity: 0.65, textDecoration: "none", fontSize: "13px" }}>
              Xodimlar / Admin tizimi
            </Link>
            <span>Qarshi, O‘zbekiston</span>
          </div>
        </div>
      </footer>

      {detailsRoom && (
        <div
          className="ov room-details-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseRoomDetails();
          }}
        >
          <div
            className="md room-details-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-details-title"
          >
            <button className="x" aria-label="Yopish" onClick={handleCloseRoomDetails}>
              ✕
            </button>
            {detailsRoom.imageUrl ? (
              <img
                className="room-details-image"
                src={detailsRoom.imageUrl}
                alt={`#${detailsRoom.roomNumber} ${detailsRoom.name} xonasi`}
              />
            ) : (
              <div
                className="room-details-placeholder"
                style={{
                  background: `linear-gradient(135deg, ${detailsRoom.colorA}, ${detailsRoom.colorB})`,
                }}
              >
                #{detailsRoom.roomNumber} · {detailsRoom.name}
              </div>
            )}
            <h2 id="room-details-title">#{detailsRoom.roomNumber} · {detailsRoom.name} xonasi</h2>
            <p className="room-details-description">{detailsRoom.desc}</p>
            <div className="chips room-details-chips">
              {detailsRoom.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <h3>Qulayliklar</h3>
            <ul className="room-amenities">
              {detailsRoom.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
            <div className="room-details-footer">
              <strong>{fmt(detailsRoom.price)} so‘m <span>/ kecha</span></strong>
              <button
                className="btn dk"
                onClick={() => {
                  handleCloseRoomDetails();
                  handleOpenBooking(detailsRoom.id);
                }}
                disabled={!detailsRoom.isAvailable}
              >
                Band qilish
              </button>
            </div>
          </div>
        </div>
      )}

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
              <span className={modalStep === 0 ? "on" : ""}>Bronlash</span>
              <span className={modalStep === 1 ? "on" : ""}>Tasdiq</span>
            </div>

            {/* STEP 0: XULOSA */}
            {modalStep === 0 && (
              <div>
                <div>
                  <h3 id="mt">#{selectedRoom.roomNumber} · {selectedRoom.name} xonasi</h3>
                  <div className="sm booking-summary-edit">
                    <div>
                      <label htmlFor="modal-checkin">Kelish</label>
                      <input
                        id="modal-checkin"
                        type="date"
                        min={todayIso}
                        value={checkIn}
                        onChange={(event) => setCheckIn(event.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-checkout">Ketish</label>
                      <input
                        id="modal-checkout"
                        type="date"
                        min={checkIn || todayIso}
                        value={checkOut}
                        onChange={(event) => setCheckOut(event.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-guests">Mehmonlar</label>
                      <select
                        id="modal-guests"
                        value={guests}
                        onChange={(event) => setGuests(event.target.value)}
                      >
                        <option value="1 kishi">1 kishi</option>
                        <option value="2 kishi">2 kishi</option>
                        <option value="3 kishi">3 kishi</option>
                        <option value="4 kishi">4 kishi</option>
                      </select>
                    </div>
                  </div>

                  {nightsCount <= 0 && (
                    <p className="err" role="alert">
                      Ketish sanasi kelish sanasidan keyin bo‘lishi kerak.
                    </p>
                  )}

                  <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleConfirmBooking();
                      }}
                    >
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

                      <div className="fld">
                        <label htmlFor="bn">To‘liq ism va familiya *</label>
                        <input
                          id="bn"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Masalan: Aliyev Jasur"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <div className="fld">
                        <label htmlFor="bp">Telefon raqami *</label>
                        <input
                          id="bp"
                          type="tel"
                          value={guestPhone}
                          onChange={handleGuestPhoneChange}
                          placeholder="+998 90 123 45 67"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      <div className="fld">
                        <label htmlFor="bpass">Pasport seriya va raqami *</label>
                        <input
                          id="bpass"
                          value={guestPassport}
                          onChange={handlePassportChange}
                          placeholder="Masalan: AA 1234567"
                          maxLength={10}
                          style={{ textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}
                          required
                        />
                      </div>
                      <div className="fld">
                        <label htmlFor="baddr">Doimiy yashash manzili *</label>
                        <input
                          id="baddr"
                          value={guestAddress}
                          onChange={(e) => setGuestAddress(e.target.value)}
                          placeholder="Masalan: Toshkent shahri"
                          required
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
                        <span>
                          {nightsCount} kecha × {fmt(selectedRoom.price)} so‘m + xizmatlar
                        </span>
                        <b>{fmt(calculateTotal)} so‘m</b>
                      </div>

                      <button className="btn dk w" type="submit" disabled={nightsCount <= 0}>
                        Bronni tasdiqlash
                      </button>
                    </form>
                </div>
              </div>
            )}

            {/* STEP 1: TASDIQ */}
            {modalStep === 1 && (
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
                  <b>#{selectedRoom.roomNumber} · {selectedRoom.name}</b>
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
                      #{selectedRoom.roomNumber} · {selectedRoom.name} · {nightsCount} kecha · admin panelga tushdi
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
