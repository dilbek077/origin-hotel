export interface NotificationSettings {
  newBooking: boolean;
  bookingCancel: boolean;
  checkInOut: boolean;
  roomStatus: boolean;
  financeAlert: boolean;
  soundAlert: boolean;
  emailDigest: boolean;
  telegramAlert: boolean;
  telegramChatId: string;
}

export const NOTIFICATION_SETTINGS_CHANGED = 'origin-hotel-notifications-change';
export const HOTEL_NOTIFICATIONS_CHANGED = 'origin-hotel-notifications-history-change';

export type NotificationKind =
  | 'newBooking'
  | 'bookingCancel'
  | 'checkInOut'
  | 'roomStatus'
  | 'financeAlert';

export interface HotelNotification {
  id: number;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const HOTEL_NOTIFICATIONS_KEY = 'origin_hotel_notifications';
const HOTEL_NOTIFICATIONS_SEEDED = 'origin_hotel_notifications_seeded';

function seedInitialNotifications(): HotelNotification[] {
  const now = Date.now();
  const initial: HotelNotification[] = [
    {
      id: now - 300000,
      kind: 'newBooking',
      title: 'Yangi bron',
      message: 'Aliyev Jasur Baxtiyorovich — xona 102 — Deluxe',
      createdAt: new Date(now - 300000).toISOString(),
      read: false,
    },
    {
      id: now - 600000,
      kind: 'checkInOut',
      title: 'Mehmon kelishi',
      message: 'Karimova Malika Saidovna — xona 305 — Deluxe',
      createdAt: new Date(now - 600000).toISOString(),
      read: false,
    },
    {
      id: now - 1200000,
      kind: 'roomStatus',
      title: "Xona holati o'zgardi",
      message: '#204 — Tozalashda',
      createdAt: new Date(now - 1200000).toISOString(),
      read: false,
    },
    {
      id: now - 1800000,
      kind: 'checkInOut',
      title: 'Mehmon ketishi',
      message: 'Yusupov Bobur Erkinovich — xona 204 — Standart',
      createdAt: new Date(now - 1800000).toISOString(),
      read: false,
    },
    {
      id: now - 3600000,
      kind: 'financeAlert',
      title: 'Yangi kirim',
      message: "305-xona uchun to'lov (Mehmon: Karimova Malika) — 1 650 000 so'm",
      createdAt: new Date(now - 3600000).toISOString(),
      read: false,
    },
    {
      id: now - 5400000,
      kind: 'newBooking',
      title: 'Yangi bron',
      message: "Toshmatov Sardor Ulug'bekovich — xona 203 — Suite",
      createdAt: new Date(now - 5400000).toISOString(),
      read: false,
    },
    {
      id: now - 7200000,
      kind: 'financeAlert',
      title: 'Yangi chiqim',
      message: "Xodimlar oylik maoshi (avans) — 4 500 000 so'm",
      createdAt: new Date(now - 7200000).toISOString(),
      read: false,
    },
    {
      id: now - 10800000,
      kind: 'bookingCancel',
      title: 'Bron bekor qilindi',
      message: 'Rahimova Dilnoza Hamidovna — xona 101 — Standart',
      createdAt: new Date(now - 10800000).toISOString(),
      read: false,
    },
  ];
  localStorage.setItem(HOTEL_NOTIFICATIONS_KEY, JSON.stringify(initial));
  localStorage.setItem(HOTEL_NOTIFICATIONS_SEEDED, '1');
  return initial;
}

export function readHotelNotifications(): HotelNotification[] {
  const seeded = localStorage.getItem(HOTEL_NOTIFICATIONS_SEEDED);
  const saved = localStorage.getItem(HOTEL_NOTIFICATIONS_KEY);

  if (!seeded && !saved) {
    return seedInitialNotifications();
  }

  if (!saved) return [];
  try {
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed as HotelNotification[] : [];
  } catch {
    return [];
  }
}

export function addHotelNotification(
  kind: NotificationKind,
  title: string,
  message: string,
): void {
  const settings = readNotificationSettings();
  if (!settings[kind]) return;

  const notifications = readHotelNotifications();
  notifications.unshift({
    id: Date.now(),
    kind,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  localStorage.setItem(HOTEL_NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 30)));
  window.dispatchEvent(new Event(HOTEL_NOTIFICATIONS_CHANGED));
}

export function markHotelNotificationsRead(): void {
  const notifications = readHotelNotifications().map((item) => ({ ...item, read: true }));
  localStorage.setItem(HOTEL_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(HOTEL_NOTIFICATIONS_CHANGED));
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  newBooking: true,
  bookingCancel: true,
  checkInOut: true,
  roomStatus: true,
  financeAlert: true,
  soundAlert: true,
  emailDigest: false,
  telegramAlert: true,
  telegramChatId: '@originhotel_alerts',
};

export function readNotificationSettings(): NotificationSettings {
  const saved = localStorage.getItem('origin_notifications');
  if (!saved) return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new TypeError('Saved notification settings must be an object.');
    }

    const values = parsed as Partial<Record<keyof NotificationSettings, unknown>>;
    return {
      newBooking: typeof values.newBooking === 'boolean' ? values.newBooking : DEFAULT_NOTIFICATION_SETTINGS.newBooking,
      bookingCancel: typeof values.bookingCancel === 'boolean' ? values.bookingCancel : DEFAULT_NOTIFICATION_SETTINGS.bookingCancel,
      checkInOut: typeof values.checkInOut === 'boolean' ? values.checkInOut : DEFAULT_NOTIFICATION_SETTINGS.checkInOut,
      roomStatus: typeof values.roomStatus === 'boolean' ? values.roomStatus : DEFAULT_NOTIFICATION_SETTINGS.roomStatus,
      financeAlert: typeof values.financeAlert === 'boolean' ? values.financeAlert : DEFAULT_NOTIFICATION_SETTINGS.financeAlert,
      soundAlert: typeof values.soundAlert === 'boolean' ? values.soundAlert : DEFAULT_NOTIFICATION_SETTINGS.soundAlert,
      emailDigest: typeof values.emailDigest === 'boolean' ? values.emailDigest : DEFAULT_NOTIFICATION_SETTINGS.emailDigest,
      telegramAlert: typeof values.telegramAlert === 'boolean' ? values.telegramAlert : DEFAULT_NOTIFICATION_SETTINGS.telegramAlert,
      telegramChatId: typeof values.telegramChatId === 'string' ? values.telegramChatId : DEFAULT_NOTIFICATION_SETTINGS.telegramChatId,
    };
  } catch (error) {
    console.error('Bildirishnoma sozlamalarini o‘qib bo‘lmadi:', error);
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}
