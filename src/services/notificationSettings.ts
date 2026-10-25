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
