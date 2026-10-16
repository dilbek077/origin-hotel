import type { Room } from "@/types/room";
import type { Guest } from "@/types/guest";
import type { Booking } from "@/types/booking";
import type { Transaction } from "@/types/finance";

const ROOMS_KEY = "origin_hotel_rooms";
const GUESTS_KEY = "origin_hotel_guests";
const BOOKINGS_KEY = "origin_hotel_bookings";
const TRANSACTIONS_KEY = "origin_hotel_transactions";

const initialRooms: Room[] = [
  { id: 1, number: "101", type: "Standart",  pricePerNight: 350000,  capacity: "2 kishilik", status: "Bo'sh",       floor: 1 },
  { id: 2, number: "102", type: "Deluxe",    pricePerNight: 550000,  capacity: "2 kishilik", status: "Band",        floor: 1 },
  { id: 3, number: "203", type: "Suite",     pricePerNight: 900000,  capacity: "3 kishilik", status: "Bo'sh",       floor: 2 },
  { id: 4, number: "204", type: "Standart",  pricePerNight: 350000,  capacity: "2 kishilik", status: "Tozalashda",  floor: 2 },
  { id: 5, number: "305", type: "Deluxe",    pricePerNight: 550000,  capacity: "3 kishilik", status: "Band",        floor: 3 },
  { id: 6, number: "306", type: "President", pricePerNight: 1500000, capacity: "4 kishilik", status: "Bo'sh",       floor: 3 },
  { id: 7, number: "407", type: "Suite",     pricePerNight: 900000,  capacity: "3 kishilik", status: "Ta'mirda",    floor: 4 },
  { id: 8, number: "408", type: "Standart",  pricePerNight: 350000,  capacity: "1 kishilik", status: "Bo'sh",       floor: 4 },
];

const initialGuests: Guest[] = [
  {
    id: 1,
    fullName: "Aliyev Jasur Baxtiyorovich",
    phone: "+998 90 123 45 67",
    passport: "AA 1234567",
    notes: "Doimiy mehmon, sokin xonalarni xush ko‘radi",
    address: "Toshkent, Yunusobod tumani",
    lastVisit: "2026-10-12",
  },
  {
    id: 2,
    fullName: "Karimova Malika Saidovna",
    phone: "+998 91 234 56 78",
    passport: "AB 2345678",
    notes: "VIP mijoz, erta kelishi mumkin",
    address: "Samarqand, Registon ko'chasi",
    lastVisit: "2026-10-15",
  },
  {
    id: 3,
    fullName: "Toshmatov Sardor Ulug‘bekovich",
    phone: "+998 93 345 67 89",
    passport: "AC 3456789",
    notes: "Biznes delegatsiya rahbari",
    address: "Buxoro, Markaziy ko'cha",
    lastVisit: "2026-10-14",
  },
  {
    id: 4,
    fullName: "Rahimova Dilnoza Hamidovna",
    phone: "+998 94 456 78 90",
    passport: "AD 4567890",
    notes: "Qo‘shimcha to‘shak so‘ralgan",
    address: "Namangan, Navoiy ko'chasi",
    lastVisit: "2026-10-10",
  },
  {
    id: 5,
    fullName: "Yusupov Bobur Erkinovich",
    phone: "+998 95 567 89 01",
    passport: "AE 5678901",
    notes: "Kechki payt kirish rejalashtirilgan",
    address: "Andijon, Mustaqillik xiyoboni",
    lastVisit: "2026-10-16",
  },
];

const todayStr = new Date().toISOString().split("T")[0];

const initialBookings: Booking[] = [
  {
    id: 1,
    guestId: 1,
    guest: "Aliyev Jasur Baxtiyorovich",
    roomId: 2,
    room: "102 — Deluxe",
    checkIn: todayStr,
    checkOut: "2026-10-20",
    nights: 4,
    price: 2200000,
    status: "Yashamoqda",
    notes: "Bugun ertalab check-in qilingan",
  },
  {
    id: 2,
    guestId: 2,
    guest: "Karimova Malika Saidovna",
    roomId: 5,
    room: "305 — Deluxe",
    checkIn: todayStr,
    checkOut: "2026-10-19",
    nights: 3,
    price: 1650000,
    status: "Yashamoqda",
    notes: "Check-in o‘tkazilgan",
  },
  {
    id: 3,
    guestId: 3,
    guest: "Toshmatov Sardor Ulug‘bekovich",
    roomId: 3,
    room: "203 — Suite",
    checkIn: "2026-10-22",
    checkOut: "2026-10-25",
    nights: 3,
    price: 2700000,
    status: "Tasdiqlangan",
    notes: "Oldindan to‘lov qilingan",
  },
  {
    id: 4,
    guestId: 4,
    guest: "Rahimova Dilnoza Hamidovna",
    roomId: 1,
    room: "101 — Standart",
    checkIn: "2026-10-24",
    checkOut: "2026-10-26",
    nights: 2,
    price: 700000,
    status: "Kutilmoqda",
    notes: "Tasdiq kutilmoqda",
  },
  {
    id: 5,
    guestId: 5,
    guest: "Yusupov Bobur Erkinovich",
    roomId: 4,
    room: "204 — Standart",
    checkIn: "2026-10-12",
    checkOut: todayStr,
    nights: 4,
    price: 1400000,
    status: "Tugatilgan",
    notes: "Bugun check-out qilindi, xona tozalashda",
  },
];

const initialTransactions: Transaction[] = [
  { id: 1, date: "2026-10-12", type: "income", category: "Xona haqi", description: "102-xona to‘lovi", amount: 2200000 },
  { id: 2, date: "2026-10-13", type: "income", category: "Ovqatlanish", description: "Mehmonxona restorani tushumi", amount: 850000 },
  { id: 3, date: "2026-10-14", type: "income", category: "Qo‘shimcha xizmatlar", description: "Kir yuvish va transfer", amount: 320000 },
  { id: 4, date: "2026-10-15", type: "income", category: "Ijara", description: "Konferentsiya zali 1 kunlik ijarasi", amount: 1500000 },
  { id: 5, date: "2026-10-16", type: "income", category: "Boshqa kirim", description: "Valyuta ayirboshlash xizmati", amount: 180000 },

  { id: 6, date: "2026-10-10", type: "expense", category: "Ish haqi", description: "Xodimlar oylik maoshi (avans)", amount: 4500000 },
  { id: 7, date: "2026-10-12", type: "expense", category: "Kommunal to‘lovlar", description: "Elektr va sovuq suv to‘lovi", amount: 980000 },
  { id: 8, date: "2026-10-13", type: "expense", category: "Material/xaridlar", description: "Gigiene vositalari va choyshablar", amount: 620000 },
  { id: 9, date: "2026-10-14", type: "expense", category: "Ta’mirlash", description: "407-xona santexnika ta’miri", amount: 350000 },
  { id: 10, date: "2026-10-15", type: "expense", category: "Boshqa chiqim", description: "Internet va kabel televideniyesi", amount: 250000 },
];

function notifyChange() {
  window.dispatchEvent(new Event("origin-hotel-storage-change"));
}

export const StorageService = {
  // Rooms
  getRooms(): Room[] {
    const raw = localStorage.getItem(ROOMS_KEY);
    if (!raw) {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(initialRooms));
      return initialRooms;
    }
    return JSON.parse(raw);
  },

  saveRooms(rooms: Room[]) {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
    notifyChange();
  },

  addRoom(room: Omit<Room, "id">): { success: boolean; error?: string; room?: Room } {
    const rooms = this.getRooms();
    if (rooms.some((r) => r.number.trim().toLowerCase() === room.number.trim().toLowerCase())) {
      return { success: false, error: "Ushbu raqamdagi xona allaqachon mavjud!" };
    }
    const newRoom: Room = {
      ...room,
      id: Date.now(),
    };
    rooms.unshift(newRoom);
    this.saveRooms(rooms);
    return { success: true, room: newRoom };
  },

  updateRoom(room: Room): { success: boolean; error?: string } {
    const rooms = this.getRooms();
    const duplicate = rooms.some(
      (r) => r.id !== room.id && r.number.trim().toLowerCase() === room.number.trim().toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: "Ushbu raqamdagi xona allaqachon mavjud!" };
    }
    const index = rooms.findIndex((r) => r.id === room.id);
    if (index === -1) return { success: false, error: "Xona topilmadi" };
    rooms[index] = room;
    this.saveRooms(rooms);
    return { success: true };
  },

  deleteRoom(id: number): boolean {
    const rooms = this.getRooms().filter((r) => r.id !== id);
    this.saveRooms(rooms);
    return true;
  },

  // Guests
  getGuests(): Guest[] {
    const raw = localStorage.getItem(GUESTS_KEY);
    if (!raw) {
      localStorage.setItem(GUESTS_KEY, JSON.stringify(initialGuests));
      return initialGuests;
    }
    return JSON.parse(raw);
  },

  saveGuests(guests: Guest[]) {
    localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
    notifyChange();
  },

  addGuest(guest: Omit<Guest, "id">): Guest {
    const guests = this.getGuests();
    const newGuest: Guest = {
      ...guest,
      id: Date.now(),
      lastVisit: guest.lastVisit || new Date().toISOString().split("T")[0],
    };
    guests.unshift(newGuest);
    this.saveGuests(guests);
    return newGuest;
  },

  updateGuest(guest: Guest): boolean {
    const guests = this.getGuests();
    const idx = guests.findIndex((g) => g.id === guest.id);
    if (idx === -1) return false;
    guests[idx] = guest;
    this.saveGuests(guests);
    return true;
  },

  deleteGuest(id: number): boolean {
    const guests = this.getGuests().filter((g) => g.id !== id);
    this.saveGuests(guests);
    return true;
  },

  // Bookings
  getBookings(): Booking[] {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(raw);
  },

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    notifyChange();
  },

  // Bandlik qoidasi: tekshirish
  checkRoomAvailability(roomId: number, checkIn: string, checkOut: string, ignoreBookingId?: number): boolean {
    const bookings = this.getBookings();
    const inDate = new Date(checkIn).getTime();
    const outDate = new Date(checkOut).getTime();

    // Faol bronlar bilan to'qnashuvni tekshirish
    const hasOverlap = bookings.some((b) => {
      if (b.roomId !== roomId) return false;
      if (ignoreBookingId && b.id === ignoreBookingId) return false;
      if (b.status === "Bekor" || b.status === "Tugatilgan") return false;

      const bIn = new Date(b.checkIn).getTime();
      const bOut = new Date(b.checkOut).getTime();

      // [inDate, outDate] va [bIn, bOut] kesishishi
      return inDate < bOut && outDate > bIn;
    });

    return !hasOverlap;
  },

  addBooking(booking: Omit<Booking, "id">): { success: boolean; error?: string; booking?: Booking } {
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      return { success: false, error: "Ketish sanasi kelish sanasidan keyin bo‘lishi shart!" };
    }

    if (!this.checkRoomAvailability(booking.roomId, booking.checkIn, booking.checkOut)) {
      return { success: false, error: "Bu xona tanlangan sanalarda allaqachon band qilingan!" };
    }

    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now(),
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // Agar statusi "Yashamoqda" bo'lsa, xonani avtomatik "Band" holatiga o'tkazish
    if (newBooking.status === "Yashamoqda") {
      const rooms = this.getRooms();
      const room = rooms.find((r) => r.id === newBooking.roomId);
      if (room) {
        room.status = "Band";
        this.saveRooms(rooms);
      }
    }

    return { success: true, booking: newBooking };
  },

  updateBooking(booking: Booking): { success: boolean; error?: string } {
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      return { success: false, error: "Ketish sanasi kelish sanasidan keyin bo‘lishi shart!" };
    }

    if (!this.checkRoomAvailability(booking.roomId, booking.checkIn, booking.checkOut, booking.id)) {
      return { success: false, error: "Bu xona tanlangan sanalarda boshqa faol bron bilan to‘qnashmoqda!" };
    }

    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === booking.id);
    if (idx === -1) return { success: false, error: "Bron topilmadi" };

    bookings[idx] = booking;
    this.saveBookings(bookings);
    return { success: true };
  },

  checkInBooking(bookingId: number): boolean {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    booking.status = "Yashamoqda";
    this.saveBookings(bookings);

    // Xonani "Band" holatiga o'tkazish
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === booking.roomId);
    if (room) {
      room.status = "Band";
      this.saveRooms(rooms);
    }
    return true;
  },

  checkOutBooking(bookingId: number): boolean {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    booking.status = "Tugatilgan";
    this.saveBookings(bookings);

    // Xonani "Tozalashda" holatiga o'tkazish
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === booking.roomId);
    if (room) {
      room.status = "Tozalashda";
      this.saveRooms(rooms);
    }

    // Xona to'lovini kirim sifatida qo'shish
    this.addTransaction({
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "Xona haqi",
      description: `${booking.room} uchun to‘lov (Mehmon: ${booking.guest})`,
      amount: booking.price,
    });

    return true;
  },

  deleteBooking(id: number): boolean {
    const bookings = this.getBookings().filter((b) => b.id !== id);
    this.saveBookings(bookings);
    return true;
  },

  // Transactions (Kirimlar va Chiqimlar)
  getTransactions(): Transaction[] {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
      return initialTransactions;
    }
    return JSON.parse(raw);
  },

  saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    notifyChange();
  },

  addTransaction(data: Omit<Transaction, "id">): { success: boolean; error?: string; transaction?: Transaction } {
    if (data.amount <= 0) {
      return { success: false, error: "Summa 0 dan katta bo‘lishi shart!" };
    }
    if (!data.description.trim()) {
      return { success: false, error: "Izoh/tavsif kiritilishi shart!" };
    }

    const txs = this.getTransactions();
    const newTx: Transaction = {
      ...data,
      id: Date.now(),
    };
    txs.unshift(newTx);
    this.saveTransactions(txs);
    return { success: true, transaction: newTx };
  },

  deleteTransaction(id: number): boolean {
    const txs = this.getTransactions().filter((t) => t.id !== id);
    this.saveTransactions(txs);
    return true;
  },
};
