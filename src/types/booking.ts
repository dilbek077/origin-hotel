export type BookingStatus =
  | "Kutilmoqda"
  | "Tasdiqlangan"
  | "Yashamoqda"
  | "Tugatilgan"
  | "Bekor";

export interface Booking {
  id: number;
  guestId: number;
  guest: string;
  roomId: number;
  room: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  price: number;
  status: BookingStatus;
  notes?: string;
}
