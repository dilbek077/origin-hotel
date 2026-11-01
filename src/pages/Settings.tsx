import { L } from '@/localization/elements';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  KeyRound,
  Save,
  CheckCircle2,
  Globe,
  Moon,
  Sun,
  UserCog,
  Palette,
  Bell,
  Monitor,
  Shield,
  Smartphone,
  Laptop,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volume2,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { useTheme } from '@/theme';
import { LANGUAGES, useTranslation } from '@/i18n';
import { NOTIFICATION_SETTINGS_CHANGED, readNotificationSettings } from '@/services/notificationSettings';

type SettingsTab = 'profil' | 'hisob' | 'korinish' | 'bildirishnomalar' | 'ekran';
type FontSize = 'sm' | 'base' | 'lg';
const SETTINGS_TABS: SettingsTab[] = ['profil', 'bildirishnomalar'];

const ACCENT_COLORS: Record<string, { primary: string; foreground: string }> = {
  sky: { primary: '#0284c7', foreground: '#ffffff' },
  blue: { primary: '#0284c7', foreground: '#ffffff' },
  emerald: { primary: '#10b981', foreground: '#ffffff' },
  purple: { primary: '#a855f7', foreground: '#ffffff' },
  amber: { primary: '#f59e0b', foreground: '#111827' },
};

export default function Settings() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  // Active tab determination
  const currentTab: SettingsTab = SETTINGS_TABS.includes(tab as SettingsTab)
    ? (tab as SettingsTab)
    : 'profil';

  useEffect(() => {
    if (tab && !SETTINGS_TABS.includes(tab as SettingsTab)) {
      navigate('/admin/sozlamalar/profil', { replace: true });
    }
  }, [navigate, tab]);

  const handleTabChange = (newTab: SettingsTab) => {
    navigate(`/admin/sozlamalar/${newTab}`);
  };

  // ─── 1. Profil ma'lumotlari ──────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState(() => {
    const saved = localStorage.getItem('origin_profile_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      fullName: 'Abdullayev Jasur',
      username: localStorage.getItem('username') ?? 'admin',
      role: localStorage.getItem('role') ?? 'ADMIN',
      phone: '+998 90 123 45 67',
      email: 'admin@originhotel.uz',
      bio: "Origin Hotel boshqaruvchisi va administrator. Mehmonlar qabuli va servis sifatini nazorat qiladi.",
    };
  });

  const [hotelForm, setHotelForm] = useState(() => {
    const saved = localStorage.getItem('origin_hotel_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: 'Origin Hotel Qarshi',
      address: "Amir Temur ko'chasi 15, Qarshi",
      phone: '+998 71 200 00 00',
      email: 'info@originhotel.uz',
      website: 'https://originhotel.uz',
      stars: '5',
    };
  });

  // ─── 2. Hisob & Xavfsizlik ───────────────────────────────────────────────────
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  // ─── 3. Ko'rinish sozlamalari ────────────────────────────────────────────────
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('origin_accent_color') || 'sky';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('origin_font_size');
    return saved === 'sm' || saved === 'lg' ? saved : 'base';
  });

  // ─── 4. Bildirishnomalar sozlamalari ─────────────────────────────────────────
  const [notifications, setNotifications] = useState(readNotificationSettings);

  // ─── 5. Ekran sozlamalari ────────────────────────────────────────────────────
  const [screenSettings, setScreenSettings] = useState(() => {
    const saved = localStorage.getItem('origin_screen_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      autoRefreshInterval: '30',
      kioskMode: false,
      zoomLevel: '100',
      defaultView: 'dashboard',
    };
  });

  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const accent = ACCENT_COLORS[accentColor] ?? ACCENT_COLORS.sky;
    const fontSizes: Record<FontSize, string> = { sm: '13px', base: '14px', lg: '16px' };
    root.style.setProperty('--primary', accent.primary);
    root.style.setProperty('--ring', accent.primary);
    root.style.setProperty('--primary-foreground', accent.foreground);
    root.style.fontSize = fontSizes[fontSize];
    root.style.zoom = `${screenSettings.zoomLevel}%`;
  }, [accentColor, fontSize, screenSettings.zoomLevel]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen xatosi:', err);
    }
  };

  // Toast / Save holatlari
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const showSaveSuccess = (message = t('common.saved')) => {
    setSaveSuccess(message);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleProfileSave = () => {
    localStorage.setItem('origin_profile_settings', JSON.stringify(profileForm));
    localStorage.setItem('origin_hotel_settings', JSON.stringify(hotelForm));
    showSaveSuccess();
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    showSaveSuccess('Xavfsizlik sozlamalari yangilandi!');
  };

  const handleNotificationsSave = () => {
    localStorage.setItem('origin_notifications', JSON.stringify(notifications));
    window.dispatchEvent(new Event(NOTIFICATION_SETTINGS_CHANGED));
    showSaveSuccess('Bildirishnoma sozlamalari saqlandi!');
  };

  const handleScreenSave = () => {
    localStorage.setItem('origin_screen_settings', JSON.stringify(screenSettings));
    document.documentElement.style.zoom = `${screenSettings.zoomLevel}%`;
    showSaveSuccess('Ekran sozlamalari saqlandi!');
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem('origin_accent_color', color);
    showSaveSuccess('Mavzu rangi tanlandi!');
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('origin_font_size', size);
    showSaveSuccess('Shrift o‘lchami yangilandi!');
  };

  // Styling helper classes
  const cardClass = isDark
    ? 'bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden'
    : 'bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden';

  const cardHeaderClass = isDark
    ? 'px-6 py-4 border-b border-slate-800 flex items-center justify-between'
    : 'px-6 py-4 border-b border-gray-100 flex items-center justify-between';

  const labelClass = isDark
    ? 'block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5'
    : 'block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5';

  const inputClass = isDark
    ? 'w-full px-4 py-2.5 text-sm border border-slate-700 bg-slate-800/90 text-white rounded-xl outline-none focus:ring-2 focus:ring-sky-500 transition'
    : 'w-full px-4 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 transition';

  const tabsConfig = [
    { id: 'profil' as const, label: t('nav.profile'), icon: UserCog, desc: "Shaxsiy profil va mehmonxona ma'lumotlari" },
    { id: 'bildirishnomalar' as const, label: t('nav.notifications'), icon: Bell, desc: 'Ogohlantirishlar va kanallar' },
  ];
  return (
    <L.div className={isDark ? 'p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen' : 'p-6 space-y-6 bg-gray-50 text-gray-900 min-h-screen'}>
      {/* Sahifa sarlavhasi va bildirishnoma tosti */}
      <L.div className="flex flex-wrap items-center justify-between gap-4">
        <L.div>
          <L.div className="flex items-center gap-2">
            <L.span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {t('nav.system')}
            </L.span>
            <L.h1 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'}>
              {t('nav.settings')}
            </L.h1>
          </L.div>
          <L.p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {tabsConfig.find((tc) => tc.id === currentTab)?.desc}
          </L.p>
        </L.div>

        {saveSuccess && (
          <L.div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium animate-fadeIn">
            <CheckCircle2 size={18} />
            <L.span>{saveSuccess}</L.span>
          </L.div>
        )}
      </L.div>

      {/* 5 ta sub-tab navigation paneli (Sidebar bilan sinxron) */}
      <L.div className={isDark ? 'p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap gap-1 shadow-sm' : 'p-1.5 bg-white rounded-2xl border border-gray-200 flex flex-wrap gap-1 shadow-sm'}>
        {tabsConfig.map((tabItem) => {
          const isActive = currentTab === tabItem.id;
          const IconComponent = tabItem.icon;
          return (
            <L.button
              key={tabItem.id}
              type="button"
              onClick={() => handleTabChange(tabItem.id)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer flex-1 min-w-[130px] justify-center',
                isActive
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10 font-semibold'
                    : 'bg-sky-50 text-sky-900 shadow-sm ring-1 ring-sky-200 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70',
              ].join(' ')}
            >
              <IconComponent size={17} className={isActive ? (isDark ? 'text-sky-400' : 'text-sky-600') : 'opacity-70'} />
              <L.span>{tabItem.label}</L.span>
            </L.button>
          );
        })}
      </L.div>

      {/* ════════════════════ TAB 1: PROFIL ════════════════════ */}
      {currentTab === 'profil' && (
        <L.div className="space-y-6">
          <L.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shaxsiy profil kartasi */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <UserCog size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">{t('settings.userInfo')}</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">{t('settings.userSub')}</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-5">
                {/* Avatar blok */}
                <L.div className={isDark ? 'flex items-center gap-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60' : 'flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100'}>
                  <L.div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {profileForm.fullName.charAt(0)}
                  </L.div>
                  <L.div className="flex-1">
                    <L.p className="font-semibold text-base">{profileForm.fullName}</L.p>
                    <L.p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                      @{profileForm.username} • {profileForm.role}
                    </L.p>
                    <L.span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                      Faol foydalanuvchi
                    </L.span>
                  </L.div>
                </L.div>

                {/* To'liq ism */}
                <L.div>
                  <L.label className={labelClass}>{t('settings.fullName')}</L.label>
                  <L.div className="relative">
                    <L.input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className={inputClass}
                      placeholder="F.I.O"
                    />
                  </L.div>
                </L.div>

                {/* Telefon & Email */}
                <L.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <L.div>
                    <L.label className={labelClass}>{t('settings.phone')}</L.label>
                    <L.input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className={inputClass}
                    />
                  </L.div>
                  <L.div>
                    <L.label className={labelClass}>{t('settings.email')}</L.label>
                    <L.input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className={inputClass}
                    />
                  </L.div>
                </L.div>

                {/* Bio */}
                <L.div>
                  <L.label className={labelClass}>Qisqacha ma'lumot (Bio)</L.label>
                  <L.textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className={inputClass}
                    placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
                  />
                </L.div>
              </L.div>
            </L.div>

            {/* Mehmonxona ma'lumotlari */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Building2 size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">{t('settings.hotelInfo')}</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">{t('settings.hotelSub')}</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-5">
                {/* Hotel Name */}
                <L.div>
                  <L.label className={labelClass}>{t('settings.hotelName')}</L.label>
                  <L.input
                    type="text"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                    className={inputClass}
                  />
                </L.div>

                {/* Address */}
                <L.div>
                  <L.label className={labelClass}>{t('settings.address')}</L.label>
                  <L.input
                    type="text"
                    value={hotelForm.address}
                    onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                    className={inputClass}
                  />
                </L.div>

                {/* Hotel Phone & Email */}
                <L.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <L.div>
                    <L.label className={labelClass}>Aloqa telefoni</L.label>
                    <L.input
                      type="tel"
                      value={hotelForm.phone}
                      onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                      className={inputClass}
                    />
                  </L.div>
                  <L.div>
                    <L.label className={labelClass}>Aloqa emaili</L.label>
                    <L.input
                      type="email"
                      value={hotelForm.email}
                      onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                      className={inputClass}
                    />
                  </L.div>
                </L.div>

                {/* Web sayt & Yulduz darajasi */}
                <L.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <L.div>
                    <L.label className={labelClass}>Veb-sayt</L.label>
                    <L.input
                      type="url"
                      value={hotelForm.website}
                      onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                      className={inputClass}
                    />
                  </L.div>
                  <L.div>
                    <L.label className={labelClass}>Yulduzlar toifasi</L.label>
                    <L.select
                      value={hotelForm.stars}
                      onChange={(e) => setHotelForm({ ...hotelForm, stars: e.target.value })}
                      className={inputClass}
                    >
                      <L.option value="5">⭐⭐⭐⭐⭐ 5 Yulduz (Luxury)</L.option>
                      <L.option value="4">⭐⭐⭐⭐ 4 Yulduz (Premium)</L.option>
                      <L.option value="3">⭐⭐⭐ 3 Yulduz (Standart)</L.option>
                    </L.select>
                  </L.div>
                </L.div>
              </L.div>
            </L.div>
          </L.div>

          {/* Saqlash tugmasi */}
          <L.div className="flex justify-end">
            <L.button
              onClick={handleProfileSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold shadow-md transition-all cursor-pointer"
            >
              <Save size={18} />
              <L.span>{t('common.save')}</L.span>
            </L.button>
          </L.div>
        </L.div>
      )}

      {/* ════════════════════ TAB 2: HISOB ════════════════════ */}
      {currentTab === 'hisob' && (
        <L.div className="space-y-6">
          <L.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parolni o'zgartirish */}
            <L.form onSubmit={handleSecuritySave} className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Lock size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">Parolni yangilash</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">Hisobingizga kirish maxfiyligini ta'minlang</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-4">
                <L.div>
                  <L.label className={labelClass}>{t('settings.currentPassword')}</L.label>
                  <L.div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <L.input
                      type="password"
                      required
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className={`${inputClass} pl-10`}
                      placeholder="••••••••"
                    />
                  </L.div>
                </L.div>

                <L.div>
                  <L.label className={labelClass}>{t('settings.newPassword')}</L.label>
                  <L.div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <L.input
                      type="password"
                      required
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className={`${inputClass} pl-10`}
                      placeholder="••••••••"
                    />
                  </L.div>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{t('settings.passwordHint')}</L.p>
                </L.div>

                <L.div>
                  <L.label className={labelClass}>Yangi parolni tasdiqlash</L.label>
                  <L.div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <L.input
                      type="password"
                      required
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className={`${inputClass} pl-10`}
                      placeholder="••••••••"
                    />
                  </L.div>
                </L.div>

                <L.div className="pt-2">
                  <L.button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold shadow-md transition cursor-pointer"
                  >
                    <Save size={18} />
                    <L.span>Parolni saqlash</L.span>
                  </L.button>
                </L.div>
              </L.div>
            </L.form>

            {/* Xavfsizlik & Faol Sessiyalar */}
            <L.div className="space-y-6">
              {/* Ikki bosqichli autentifikatsiya (2FA) */}
              <L.div className={cardClass}>
                <L.div className="p-6">
                  <L.div className="flex items-start justify-between gap-4">
                    <L.div className="flex items-center gap-3">
                      <L.div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Shield size={22} />
                      </L.div>
                      <L.div>
                        <L.h3 className="font-semibold text-base">Ikki bosqichli tasdiqlash (2FA)</L.h3>
                        <L.p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                          Tizimga kirishda SMS yoki Authenticator ilovasi kodi so‘raladi
                        </L.p>
                      </L.div>
                    </L.div>
                    <L.button
                      type="button"
                      onClick={() =>
                        setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        securityForm.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <L.span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          securityForm.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </L.button>
                  </L.div>
                </L.div>
              </L.div>

              {/* Faol qurilmalar */}
              <L.div className={cardClass}>
                <L.div className={cardHeaderClass}>
                  <L.h3 className="font-semibold text-sm">Faol sessiyalar va qurilmalar</L.h3>
                  <L.span className="text-xs text-emerald-400 font-medium">2 ta qurilma faol</L.span>
                </L.div>

                <L.div className="p-6 space-y-4">
                  <L.div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <L.div className="flex items-center gap-3">
                      <Laptop className="text-sky-400" size={20} />
                      <L.div>
                        <L.p className="text-sm font-medium">Windows 11 • Chrome brauzeri</L.p>
                        <L.p className="text-xs text-gray-400 dark:text-slate-500">Qarshi, O‘zbekiston • Hozir faol</L.p>
                      </L.div>
                    </L.div>
                    <L.span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Joriy</L.span>
                  </L.div>

                  <L.div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <L.div className="flex items-center gap-3">
                      <Smartphone className="text-purple-400" size={20} />
                      <L.div>
                        <L.p className="text-sm font-medium">iPhone 15 Pro • Mobil Safari</L.p>
                        <L.p className="text-xs text-gray-400 dark:text-slate-500">Qarshi, O‘zbekiston • 2 soat oldin</L.p>
                      </L.div>
                    </L.div>
                    <L.button
                      type="button"
                      onClick={() => showSaveSuccess('Qurilma sessiyasi to‘xtatildi')}
                      className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                    >
                      Chiqarish
                    </L.button>
                  </L.div>
                </L.div>
              </L.div>
            </L.div>
          </L.div>
        </L.div>
      )}

      {/* ════════════════════ TAB 3: KO'RINISH ════════════════════ */}
      {currentTab === 'korinish' && (
        <L.div className="space-y-6">
          {/* Mavzu rejimi: Kunduzgi / Tungi */}
          <L.div className={cardClass}>
            <L.div className={cardHeaderClass}>
              <L.div className="flex items-center gap-3">
                <L.div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Palette size={20} />
                </L.div>
                <L.div>
                  <L.h2 className="text-base font-semibold">Tizim mavzusi (Theme)</L.h2>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500">Kunduzgi yoki tungi interfeys rejimini tanlang</L.p>
                </L.div>
              </L.div>
            </L.div>

            <L.div className="p-6">
              <L.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light mode card */}
                <L.button
                  type="button"
                  onClick={(event) =>
                    isDark && toggleTheme({ x: event.clientX, y: event.clientY })
                  }
                  aria-pressed={!isDark}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    !isDark
                      ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <L.div className="flex items-center justify-between mb-4">
                    <L.div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun size={20} />
                    </L.div>
                    {!isDark && <Check className="text-sky-600" size={20} />}
                  </L.div>
                  <L.h3 className="font-semibold text-sm">Kunduzgi rejim (Light)</L.h3>
                  <L.p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Yorug‘ muhitda ishlash uchun toza oq va havorang dizayn
                  </L.p>
                </L.button>

                {/* Dark mode card */}
                <L.button
                  type="button"
                  onClick={(event) =>
                    !isDark && toggleTheme({ x: event.clientX, y: event.clientY })
                  }
                  aria-pressed={isDark}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isDark
                      ? 'border-sky-500 bg-slate-800/90 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <L.div className="flex items-center justify-between mb-4">
                    <L.div className="w-10 h-10 rounded-xl bg-indigo-900/40 text-indigo-400 flex items-center justify-center">
                      <Moon size={20} />
                    </L.div>
                    {isDark && <Check className="text-sky-400" size={20} />}
                  </L.div>
                  <L.h3 className="font-semibold text-sm">Tungi rejim (Dark)</L.h3>
                  <L.p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Ko‘zga qulay, kam energiya sarflaydigan qorong‘u fon
                  </L.p>
                </L.button>
              </L.div>
            </L.div>
          </L.div>

          {/* Til va Aksent ranglar */}
          <L.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Til tanlash */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Globe size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">{t('common.language')}</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">Tizim menyulari va hisobotlari tili</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-2.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = locale === lang.code;
                  return (
                    <L.button
                      type="button"
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-sky-500 bg-sky-500/10 text-white font-semibold'
                            : 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                          : isDark
                            ? 'border-slate-800 bg-slate-800/30 text-slate-300 hover:bg-slate-800/70'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <L.span className="text-sm">{lang.label}</L.span>
                      {isSelected && <Check size={18} className="text-sky-400" />}
                    </L.button>
                  );
                })}
              </L.div>
            </L.div>

            {/* Aksent ranglar va Shrift */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Sparkles size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">Aksent va Shrift sozlamalari</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">Vizual tugmalar va shrift o'lchami</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-6">
                {/* Aksent ranglar */}
                <L.div>
                  <L.label className={labelClass}>Aksent rangi</L.label>
                  <L.div className="flex items-center gap-3 mt-2">
                    {[
                      { id: 'sky', bg: 'bg-sky-500', name: 'Sky Cyan' },
                      { id: 'blue', bg: 'bg-blue-600', name: 'Ocean Blue' },
                      { id: 'emerald', bg: 'bg-emerald-500', name: 'Emerald' },
                      { id: 'purple', bg: 'bg-purple-500', name: 'Purple' },
                      { id: 'amber', bg: 'bg-amber-500', name: 'Amber' },
                    ].map((col) => (
                      <L.button
                        key={col.id}
                        type="button"
                        onClick={() => handleAccentChange(col.id)}
                        className={`w-9 h-9 rounded-xl ${col.bg} flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          accentColor === col.id
                            ? `ring-3 ring-white ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'} scale-110`
                            : 'opacity-80 hover:opacity-100'
                        }`}
                        title={col.name}
                        aria-label={`${col.name} aksent rangini tanlash`}
                        aria-pressed={accentColor === col.id}
                      >
                        {accentColor === col.id && <Check size={16} className="text-white" />}
                      </L.button>
                    ))}
                  </L.div>
                </L.div>

                {/* Shrift o'lchami */}
                <L.div>
                  <L.label className={labelClass}>Shrift o‘lchami</L.label>
                  <L.div className="grid grid-cols-3 gap-3">
                    {([
                      { id: 'sm', label: 'Ixcham (13px)' },
                      { id: 'base', label: 'Standart (14px)' },
                      { id: 'lg', label: 'Katta (16px)' },
                    ] as const).map((f) => (
                      <L.button
                        key={f.id}
                        type="button"
                        onClick={() => handleFontSizeChange(f.id)}
                        aria-pressed={fontSize === f.id}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          fontSize === f.id
                            ? 'border-sky-500 bg-sky-500/15 text-sky-400'
                            : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </L.button>
                    ))}
                  </L.div>
                </L.div>
              </L.div>
            </L.div>
          </L.div>
        </L.div>
      )}

      {/* ════════════════════ TAB 4: BILDIRISHNOMALAR ════════════════════ */}
      {currentTab === 'bildirishnomalar' && (
        <L.div className="space-y-6">
          <L.div className={cardClass}>
            <L.div className={cardHeaderClass}>
              <L.div className="flex items-center gap-3">
                <L.div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Bell size={20} />
                </L.div>
                <L.div>
                  <L.h2 className="text-base font-semibold">Tizim bildirishnomalari turlari</L.h2>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500">Qaysi hodisalar bo‘yicha ogohlantirish olishni belgilang</L.p>
                </L.div>
              </L.div>
            </L.div>

            <L.div className="p-6 divide-y divide-slate-800/60 dark:divide-slate-800">
              {/* Yangi bron */}
              <L.div className="py-4 first:pt-0 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm">Yangi bron qilinganda ogohlantirish</L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Mehmon saytdan yoki administrator orqali yangi bron kiritganda darhol xabar keladi
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, newBooking: !notifications.newBooking })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.newBooking ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.newBooking ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Bron bekor qilinishi */}
              <L.div className="py-4 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm">Bron bekor qilinganda ogohlantirish</L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Bron bekor qilinganda tizim bildirishnomasini ko‘rsatish
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, bookingCancel: !notifications.bookingCancel })}
                  aria-pressed={notifications.bookingCancel}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.bookingCancel ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.bookingCancel ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Check-in / Check-out */}
              <L.div className="py-4 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm">Mehmon kelishi (Check-in) va ketishi (Check-out)</L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Bugungi kutilayotgan kelish va ketish vaqtlari haqida eslatma berish
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, checkInOut: !notifications.checkInOut })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.checkInOut ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.checkInOut ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Xona holati */}
              <L.div className="py-4 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm">Xona tozalash va texnik ta'mir holati</L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Xona tozalashga topshirilganda yoki ta'mirdan bo'shatilganda
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, roomStatus: !notifications.roomStatus })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.roomStatus ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.roomStatus ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Moliya kassa ogohlantirishlari */}
              <L.div className="py-4 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm">Moliya va kassa chiqimlari ogohlantirishlari</L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Katta summadagi chiqim yoki kunlik kassa yakunlanganda bildirishnoma
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, financeAlert: !notifications.financeAlert })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.financeAlert ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.financeAlert ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Ovozli signal */}
              <L.div className="py-4 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm flex items-center gap-2">
                    <Volume2 size={16} className="text-sky-400" />
                    Ovozli xabarlar (Audio alert)
                  </L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Yangi hodisa yuz berganda qisqa audio signal yangraydi
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, soundAlert: !notifications.soundAlert })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.soundAlert ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.soundAlert ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>

              {/* Telegram bot integratsiyasi */}
              <L.div className="py-4 last:pb-0 flex items-center justify-between">
                <L.div>
                  <L.p className="font-medium text-sm flex items-center gap-2">
                    <Send size={16} className="text-sky-400" />
                    Telegram Bot orqali bildirishnomalar
                  </L.p>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    Barcha tezkor yangiliklar maxsus Telegram kanal/botiga yuboriladi
                  </L.p>
                </L.div>
                <L.button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, telegramAlert: !notifications.telegramAlert })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifications.telegramAlert ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications.telegramAlert ? 'translate-x-5' : 'translate-x-0'}`} />
                </L.button>
              </L.div>
            </L.div>
          </L.div>

          <L.div className="flex justify-end">
            <L.button
              onClick={handleNotificationsSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold shadow-md transition-all cursor-pointer"
            >
              <Save size={18} />
              <L.span>{t('common.save')}</L.span>
            </L.button>
          </L.div>
        </L.div>
      )}

      {/* ════════════════════ TAB 5: EKRAN ════════════════════ */}
      {currentTab === 'ekran' && (
        <L.div className="space-y-6">
          <L.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* To'liq ekran & Kiosk rejimi */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Monitor size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">Displey va Ekran rejimi</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">Resepshn va monitor boshqaruvi</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-5">
                {/* Fullscreen tugmasi */}
                <L.div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                  <L.div>
                    <L.p className="font-semibold text-sm">To‘liq ekran rejimi (Fullscreen)</L.p>
                    <L.p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                      Brauzer panellari yashirilib, butun monitor band qilinadi (F11)
                    </L.p>
                  </L.div>
                  <L.button
                    type="button"
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-semibold cursor-pointer transition"
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    <L.span>{isFullscreen ? 'Chiqish' : 'To‘liq ekran'}</L.span>
                  </L.button>
                </L.div>

                {/* Resepshn Kiosk rejimi */}
                <L.div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                  <L.div>
                    <L.p className="font-semibold text-sm">Resepshn Kiosk rejimi</L.p>
                    <L.p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                      Katta ekranda doimiy xonalar va mehmonlar holatini ko‘rsatish
                    </L.p>
                  </L.div>
                  <L.button
                    type="button"
                    onClick={() =>
                      setScreenSettings({ ...screenSettings, kioskMode: !screenSettings.kioskMode })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      screenSettings.kioskMode ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                  >
                    <L.span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${screenSettings.kioskMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </L.button>
                </L.div>

                {/* Ekran masshtabi */}
                <L.div>
                  <L.label className={labelClass}>Ekran masshtabi (Zoom)</L.label>
                  <L.select
                    value={screenSettings.zoomLevel}
                    onChange={(e) => setScreenSettings({ ...screenSettings, zoomLevel: e.target.value })}
                    className={inputClass}
                  >
                    <L.option value="90">90% - Ko‘proq ma'lumot sig‘dirish</L.option>
                    <L.option value="100">100% - Standart o‘lcham (Tavsiya etiladi)</L.option>
                    <L.option value="110">110% - Katta monitorlar uchun</L.option>
                    <L.option value="125">125% - Yirik shrift va elementlar</L.option>
                  </L.select>
                </L.div>
              </L.div>
            </L.div>

            {/* Avtomatik yangilanish & Bosh sahifa */}
            <L.div className={cardClass}>
              <L.div className={cardHeaderClass}>
                <L.div className="flex items-center gap-3">
                  <L.div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <RefreshCw size={20} />
                  </L.div>
                  <L.div>
                    <L.h2 className="text-base font-semibold">Ma'lumotlarni yangilash va bosh sahifa</L.h2>
                    <L.p className="text-xs text-gray-400 dark:text-slate-500">Avto-yangilanish va dastlabki ko‘rinish</L.p>
                  </L.div>
                </L.div>
              </L.div>

              <L.div className="p-6 space-y-5">
                {/* Auto Refresh */}
                <L.div>
                  <L.label className={labelClass}>Avtomatik yangilanish intervali</L.label>
                  <L.select
                    value={screenSettings.autoRefreshInterval}
                    onChange={(e) =>
                      setScreenSettings({ ...screenSettings, autoRefreshInterval: e.target.value })
                    }
                    className={inputClass}
                  >
                    <L.option value="30">Har 30 soniyada (Tezkor yangilanish)</L.option>
                    <L.option value="60">Har 1 daqiqada (Tavsiya etiladi)</L.option>
                    <L.option value="300">Har 5 daqiqada</L.option>
                    <L.option value="0">O‘chirilgan (Faqat qo‘lda yangilash)</L.option>
                  </L.select>
                  <L.p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                    Bronlar va xona statuslari server bilan avtomatik sinxronlanadi
                  </L.p>
                </L.div>

                {/* Default View */}
                <L.div>
                  <L.label className={labelClass}>Tizimga kirgandagi standart sahifa</L.label>
                  <L.select
                    value={screenSettings.defaultView}
                    onChange={(e) => setScreenSettings({ ...screenSettings, defaultView: e.target.value })}
                    className={inputClass}
                  >
                    <L.option value="dashboard">Dashboard (Asosiy ko‘rsatkichlar)</L.option>
                    <L.option value="rooms">Xonalar holati (Xonalar kartasi)</L.option>
                    <L.option value="bookings">Bronlar ro‘yxati</L.option>
                  </L.select>
                </L.div>
              </L.div>
            </L.div>
          </L.div>

          <L.div className="flex justify-end">
            <L.button
              onClick={handleScreenSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold shadow-md transition-all cursor-pointer"
            >
              <Save size={18} />
              <L.span>{t('common.save')}</L.span>
            </L.button>
          </L.div>
        </L.div>
      )}
    </L.div>
  );
}
