export interface PendingBooking {
  roomId: number;
  roomName?: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomPrice?: number;
  payMethod?: 'hotel' | 'card';
  createdAt?: number;
}

const PENDING_BOOKING_KEY = 'origin_hotel_pending_booking';

export const BookingStateService = {
  savePendingBooking(data: PendingBooking): void {
    try {
      const payload: PendingBooking = {
        ...data,
        createdAt: Date.now(),
      };
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(payload));
      localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  },

  getPendingBooking(): PendingBooking | null {
    try {
      const raw = sessionStorage.getItem(PENDING_BOOKING_KEY) || localStorage.getItem(PENDING_BOOKING_KEY);
      if (!raw) return null;
      const data: PendingBooking = JSON.parse(raw);
      // Agar pending booking 24 soatdan eski bo'lsa uni hisobga olmaslik
      if (data.createdAt && Date.now() - data.createdAt > 24 * 60 * 60 * 1000) {
        this.clearPendingBooking();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  clearPendingBooking(): void {
    try {
      sessionStorage.removeItem(PENDING_BOOKING_KEY);
      localStorage.removeItem(PENDING_BOOKING_KEY);
    } catch {
      // ignore
    }
  },
};
