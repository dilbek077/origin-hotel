export interface ProfileSettings {
  fullName: string;
  phone: string;
  email: string;
  bio: string;
}

export const PROFILE_SETTINGS_CHANGED = 'origin-hotel-profile-settings-change';

function createDefaultProfile(): ProfileSettings {
  return {
    fullName: localStorage.getItem('username') ?? '',
    phone: '',
    email: '',
    bio: '',
  };
}

export function readProfileSettings(): ProfileSettings {
  const saved = localStorage.getItem('origin_profile_settings');
  if (!saved) return createDefaultProfile();

  try {
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new TypeError('Saved profile settings must be an object.');
    }

    const values = parsed as Partial<Record<keyof ProfileSettings, unknown>>;
    const defaults = createDefaultProfile();
    return {
      fullName: typeof values.fullName === 'string' ? values.fullName : defaults.fullName,
      phone: typeof values.phone === 'string' ? values.phone : defaults.phone,
      email: typeof values.email === 'string' ? values.email : defaults.email,
      bio: typeof values.bio === 'string' ? values.bio : defaults.bio,
    };
  } catch (error) {
    console.error('Foydalanuvchi profilini o‘qib bo‘lmadi:', error);
    return createDefaultProfile();
  }
}

export function saveProfileSettings(profile: ProfileSettings): void {
  localStorage.setItem('origin_profile_settings', JSON.stringify(profile));
  localStorage.setItem('username', profile.fullName);
  window.dispatchEvent(new Event(PROFILE_SETTINGS_CHANGED));
}
