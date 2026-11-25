import { StorageService } from './storage';
import { verifyMockToken } from './mockAuth';
import type { Booking } from '@/types/booking';

export interface CreateBookingPayload {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestPhone: string;
  guestPassport: string;
  guestAddress: string;
  price: number;
  nights: number;
  payMethod: 'hotel' | 'card';
  notes?: string;
}

export interface BookingApiResponse {
  success: boolean;
  status: number;
  error?: string;
  message?: string;
  booking?: Booking;
  bookingCode?: string;
}

/**
 * Backend API simulyatsiyasi.
 * Xavfsizlik qoidalari:
 * 1. Token tekshiruvi (401 Unauthorized agar token yo'q yoki noto'g'ri bo'lsa)
 * 2. Sanalar va parametrlarni server tomonida tekshirish (400 Bad Request)
 * 3. Xona mavjudligini server tomonida qayta tekshirish (409 Conflict)
 * 4. Muvaffaqiyatli yaratilganda (201 Created)
 */
export const BookingApiService = {
  async createBooking(
    payload: CreateBookingPayload,
    authToken?: string | null
  ): Promise<BookingApiResponse> {
    // Kichik server kechikishini simulyatsiya qilish
    await new Promise((resolve) => setTimeout(resolve, 350));

    // 1. Backend Autentifikatsiya tekshiruvi
    const token = authToken || localStorage.getItem('token');
    const authCheck = verifyMockToken(token);

    if (!token || !authCheck.valid) {
      return {
        success: false,
        status: 401,
        error: 'Tizimga kirish talab qilinadi. Bron qilish uchun avval hisobingizga kiring yoki ro‘yxatdan o‘ting.',
      };
    }

    // 2. Kiruvchi ma'lumotlar validatsiyasi
    const trimmedName = payload.guestName.trim();
    const cleanPhone = payload.guestPhone.replace(/\D/g, '');
    const cleanPassport = payload.guestPassport.trim();
    const cleanAddress = payload.guestAddress.trim();

    if (trimmedName.length < 3) {
      return {
        success: false,
        status: 400,
        error: 'Ism va familiyangizni to‘liq kiriting.',
      };
    }

    if (cleanPhone.length < 9) {
      return {
        success: false,
        status: 400,
        error: 'Telefon raqamini to‘liq kiriting.',
      };
    }

    if (new Date(payload.checkOut) <= new Date(payload.checkIn)) {
      return {
        success: false,
        status: 400,
        error: 'Ketish sanasi kelish sanasidan keyin bo‘lishi shart!',
      };
    }

    // 3. Xona mavjudligini server tomonida qayta tekshirish
    const allRooms = StorageService.getRooms();
    const targetRoom = allRooms.find((r) => r.id === payload.roomId);

    if (!targetRoom) {
      return {
        success: false,
        status: 404,
        error: 'Tanlangan xona topilmadi.',
      };
    }

    const isAvailable = StorageService.checkRoomAvailability(
      payload.roomId,
      payload.checkIn,
      payload.checkOut
    );

    if (!isAvailable) {
      return {
        success: false,
        status: 409,
        error: 'Kechirasiz, tanlangan xona bu sanalarda allaqachon band qilingan. Iltimos, boshqa sana yoki xonani tanlang.',
      };
    }

    // 4. Booking va Mehmon ma'lumotlarini bazaga saqlash
    const code = 'OG-' + Math.floor(10000 + Math.random() * 89999);

    try {
      const guestsList = StorageService.getGuests();
      const existingGuest = guestsList.find(
        (g) =>
          g.phone === payload.guestPhone.trim() ||
          g.fullName.toLowerCase() === trimmedName.toLowerCase()
      );

      let guestId = existingGuest ? existingGuest.id : Date.now();
      if (!existingGuest) {
        const added = StorageService.addGuest({
          fullName: trimmedName,
          phone: payload.guestPhone.trim(),
          passport: cleanPassport || 'Kiritilmagan',
          notes: `Saytdan bron: ${code}, ${payload.payMethod === 'card' ? 'Karta' : 'Mehmonxonada'}`,
          address: cleanAddress || 'Kiritilmagan',
          lastVisit: payload.checkIn,
        });
        guestId = added.id;
      }

      const res = StorageService.addBooking({
        guestId: guestId,
        guest: trimmedName,
        roomId: targetRoom.id,
        room: `${targetRoom.number} — ${targetRoom.type}`,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        nights: payload.nights,
        price: payload.price,
        status: 'Kutilmoqda',
        notes: `Saytdan onlayn bron (${code}). Xona: ${targetRoom.number}. To‘lov: ${
          payload.payMethod === 'card' ? 'Karta orqali' : 'Mehmonxonada'
        }. Tel: ${payload.guestPhone.trim()}`,
      });

      if (!res.success || !res.booking) {
        return {
          success: false,
          status: 400,
          error: res.error || 'Bron qilishda xatolik yuz berdi.',
        };
      }

      return {
        success: true,
        status: 201,
        message: 'Bron muvaffaqiyatli qabul qilindi!',
        booking: res.booking,
        bookingCode: code,
      };
    } catch {
      return {
        success: false,
        status: 500,
        error: 'Serverda kutilmagan xatolik yuz berdi. Qayta urinib ko‘ring.',
      };
    }
  },
};
