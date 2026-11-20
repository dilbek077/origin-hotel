import { useEffect, useState } from 'react';
import { Building2, Check, CheckCircle2, Palette, Bell, Save, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme';
import { LANGUAGES, useTranslation } from '@/i18n';
import { NOTIFICATION_SETTINGS_CHANGED, readNotificationSettings } from '@/services/notificationSettings';

type FontSize = 'sm' | 'base' | 'lg';

const ACCENT_COLORS: Record<string, { primary: string; foreground: string }> = {
  sky: { primary: '#0284c7', foreground: '#ffffff' },
  blue: { primary: '#2563eb', foreground: '#ffffff' },
  emerald: { primary: '#10b981', foreground: '#ffffff' },
  purple: { primary: '#a855f7', foreground: '#ffffff' },
  amber: { primary: '#f59e0b', foreground: '#111827' },
};

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [hotelForm, setHotelForm] = useState(() => {
    const saved = localStorage.getItem('origin_hotel_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Use the defaults below.
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

  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem('origin_accent_color') || 'sky',
  );
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('origin_font_size');
    return saved === 'sm' || saved === 'lg' ? saved : 'base';
  });
  const [notifications, setNotifications] = useState(readNotificationSettings);
  useEffect(() => {
    applyVisualSettings(accentColor, fontSize);
  }, []);

  const applyVisualSettings = (color: string, size: FontSize) => {
    const accent = ACCENT_COLORS[color] ?? ACCENT_COLORS.sky;
    const sizes: Record<FontSize, string> = { sm: '13px', base: '14px', lg: '16px' };
    document.documentElement.style.setProperty('--primary', accent.primary);
    document.documentElement.style.setProperty('--ring', accent.primary);
    document.documentElement.style.setProperty('--primary-foreground', accent.foreground);
    document.documentElement.style.fontSize = sizes[size];
  };

  const showSaveSuccess = (message = t('common.saved')) => {
    setSaveSuccess(message);
    window.setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem('origin_accent_color', color);
    applyVisualSettings(color, fontSize);
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('origin_font_size', size);
    applyVisualSettings(accentColor, size);
  };

  const handleHotelSave = () => {
    localStorage.setItem('origin_hotel_settings', JSON.stringify(hotelForm));
    window.dispatchEvent(new Event('origin-hotel-storage-change'));
    showSaveSuccess('Mehmonxona ma’lumotlari saqlandi');
  };

  const handleNotificationsSave = () => {
    localStorage.setItem('origin_notifications', JSON.stringify(notifications));
    window.dispatchEvent(new Event(NOTIFICATION_SETTINGS_CHANGED));
    showSaveSuccess('Bildirishnoma sozlamalari saqlandi');
  };

  const cardClass = 'overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm';
  const cardHeaderClass = 'flex items-center gap-3 border-b border-border px-6 py-4';
  const labelClass = 'mb-2 block text-sm font-medium text-foreground';
  const inputClass = 'h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-sky-500';

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  };

  const notificationRows = [
    { key: 'newBooking' as const, title: 'Yangi bron', description: 'Mehmon yoki xodim yangi bron qolganda' },
    { key: 'bookingCancel' as const, title: 'Bron bekor qilindi', description: 'Bron bekor qilinganda' },
    { key: 'checkInOut' as const, title: 'Kelish va ketish', description: 'Mehmon kelishi yoki ketishi tasdiqlanganda' },
    { key: 'roomStatus' as const, title: 'Xona holati', description: 'Xona band, bo‘sh yoki tozalash holatiga o‘tganida' },
    { key: 'financeAlert' as const, title: 'Moliya hodisalari', description: 'Kirim yoki chiqim kiritilganda' },
    { key: 'soundAlert' as const, title: 'Ovozli signal', description: 'Muhim bildirishnoma uchun qisqa ovoz' },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-background p-6 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.settings')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mehmonxona ma’lumotlari va tizim ko‘rinishini boshqarish</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={18} />
            {saveSuccess}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)]">
        <div className="space-y-6">
          <section className={cardClass}>
            <div className={cardHeaderClass}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="font-semibold">{t('settings.hotelInfo')}</h2>
                <p className="text-xs text-muted-foreground">{t('settings.hotelSub')}</p>
              </div>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('settings.hotelName')}</label>
                <input value={hotelForm.name} onChange={(event) => setHotelForm({ ...hotelForm, name: event.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('settings.address')}</label>
                <input value={hotelForm.address} onChange={(event) => setHotelForm({ ...hotelForm, address: event.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aloqa telefoni</label>
                <input type="tel" value={hotelForm.phone} onChange={(event) => setHotelForm({ ...hotelForm, phone: event.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aloqa emaili</label>
                <input type="email" value={hotelForm.email} onChange={(event) => setHotelForm({ ...hotelForm, email: event.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Veb-sayt</label>
                <input type="url" value={hotelForm.website} onChange={(event) => setHotelForm({ ...hotelForm, website: event.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mehmonxona toifasi</label>
                <select value={hotelForm.stars} onChange={(event) => setHotelForm({ ...hotelForm, stars: event.target.value })} className={inputClass}>
                  <option value="5">5 yulduz — Luxury</option>
                  <option value="4">4 yulduz — Premium</option>
                  <option value="3">3 yulduz — Standart</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end border-t border-border px-6 py-4">
              <button type="button" onClick={handleHotelSave} className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600">
                <Save size={17} />
                Saqlash
              </button>
            </div>
          </section>

          <section className={cardClass}>
            <div className={cardHeaderClass}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Ko‘rinish</h2>
                <p className="text-xs text-muted-foreground">Mavzu, til, rang va shrift</p>
              </div>
            </div>
            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <div>
                <label className={labelClass}>Tizim mavzusi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={(event) => isDark && toggleTheme({ x: event.clientX, y: event.clientY })} className={`flex h-20 items-center gap-3 rounded-xl border p-4 text-left ${!isDark ? 'border-sky-500 bg-sky-50' : 'border-border'}`}>
                    <Sun size={20} className="text-amber-500" />
                    <span className="text-sm font-semibold">Yorug‘</span>
                  </button>
                  <button type="button" onClick={(event) => !isDark && toggleTheme({ x: event.clientX, y: event.clientY })} className={`flex h-20 items-center gap-3 rounded-xl border p-4 text-left ${isDark ? 'border-sky-500 bg-sky-500/10' : 'border-border'}`}>
                    <Moon size={20} className="text-indigo-500" />
                    <span className="text-sm font-semibold">Tungi</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Tizim tili</label>
                <div className="space-y-2">
                  {LANGUAGES.map((language) => (
                    <button key={language.code} type="button" onClick={() => setLocale(language.code)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm ${locale === language.code ? 'border-sky-500 bg-sky-500/10 font-semibold' : 'border-border'}`}>
                      {language.label}
                      {locale === language.code && <Check size={17} className="text-sky-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Aksent rangi</label>
                <div className="flex gap-3">
                  {Object.entries(ACCENT_COLORS).map(([id, color]) => (
                    <button
                      key={id}
                      type="button"
                      title={id}
                      onClick={() => handleAccentChange(id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${accentColor === id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}`}
                      style={{ backgroundColor: color.primary, color: color.foreground }}
                    >
                      {accentColor === id && <Check size={17} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Shrift o‘lchami</label>
                <div className="grid grid-cols-3 gap-2">
                  {([['sm', 'Ixcham'], ['base', 'Standart'], ['lg', 'Katta']] as const).map(([size, label]) => (
                    <button key={size} type="button" onClick={() => handleFontSizeChange(size)} className={`rounded-xl border px-3 py-3 text-xs font-semibold ${fontSize === size ? 'border-sky-500 bg-sky-500/10 text-sky-600' : 'border-border'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={cardClass}>
          <div className={cardHeaderClass}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Bildirishnomalar</h2>
              <p className="text-xs text-muted-foreground">Muhim hodisalar uchun</p>
            </div>
          </div>
          <div className="divide-y divide-border px-6">
            {notificationRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-sm font-medium">{row.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{row.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications[row.key] as boolean}
                  onClick={() => toggleNotification(row.key)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${notifications[row.key] ? 'bg-sky-500' : isDark ? 'bg-slate-700' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${notifications[row.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-border px-6 py-4">
            <button type="button" onClick={handleNotificationsSave} className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600">
              <Save size={17} />
              Saqlash
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
