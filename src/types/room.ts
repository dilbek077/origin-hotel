export type RoomStatus = "Bo'sh" | "Band" | "Tozalashda" | "Ta'mirda";

export type RoomType = "Standart" | "Deluxe" | "Suite" | "President";

export interface Room {
  id: number;
  number: string;
  type: RoomType;
  pricePerNight: number;
  capacity: string;
  status: RoomStatus;
  floor: number;
}
