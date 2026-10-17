import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  KeyRound,
  Save,
  CheckCircle2,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/theme';
import { LANGUAGES, useTranslation, type LanguageCode } from '@/i18n';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const [hotelForm, setHotelForm] = useState({
    name: 'Origin Hotel Qarshi',
    address: "Amir Temur ko'chasi 15, Qarshi",
    phone: '+998 71 200 00 00',
    email: 'info@originhotel.uz',
  });

  const [userForm, setUserForm] = useState({
    name: 'Abdullayev Jasur',
    currentPassword: '',
    newPassword: '',
  });

  const [hotelSaved, setHotelSaved] = useState(false);
  const [userSaved, setUserSaved] = useState(false);

  const handleHotelSave = () => {
    setHotelSaved(true);
    setTimeout(() => setHotelSaved(false), 2500);
  };

  const handleUserSave = () => {
    setUserSaved(true);
    setUserForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    setTimeout(() => setUserSaved(false), 2500);
  };

  const cardClass = isDark
    ? 'bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden'
    : 'bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden';

  const cardHeaderClass = isDark
    ? 'px-6 py-4 border-b border-slate-800 flex items-center justify-between'
    : 'px-6 py-4 border-b border-gray-100 flex items-center justify-between';

  const labelClass = isDark
    ? 'block text-sm font-medium text-slate-300'
    : 'block text-sm font-medium text-gray-700';

  const inputClass = isDark
    ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-slate-700 bg-slate-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition'
    : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition';

  return (
    <div className={isDark ? 'p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen' : 'p-6 space-y-6 bg-gray-50 text-gray-900 min-h-screen'}>
      {/* Header */}
      <div>
        <h1 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'}>
          {t('nav.settings')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Quick Appearance & Language bar */}
      <div className={isDark ? 'p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4' : 'p-4 rounded-2xl bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-xs'}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-300 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className={isDark ? 'text-sm font-bold text-white' : 'text-sm font-bold text-gray-900'}>
              {t('common.language')} & {t('common.darkMode')}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {locale.toUpperCase()} • {isDark ? t('common.darkMode') : t('common.lightMode')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={
              isDark
                ? 'flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition'
                : 'flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs font-semibold cursor-pointer transition'
            }
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
            <span>{isDark ? t('common.lightMode') : t('common.darkMode')}</span>
          </button>

          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as LanguageCode)}
            className={
              isDark
                ? 'px-3 py-2 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                : 'px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
            }
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Info */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-sky-300" />
              </div>
              <div>
                <h2 className={isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-gray-900'}>
                  {t('settings.hotelInfo')}
                </h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">{t('settings.hotelSub')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Hotel Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                {t('settings.hotelName')}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className={inputClass}
                  placeholder={t('settings.hotelName')}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className={labelClass}>{t('settings.address')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className={inputClass}
                  placeholder={t('settings.address')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className={labelClass}>{t('settings.phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={hotelForm.phone}
                  onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+998 XX XXX XX XX"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={labelClass}>{t('settings.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={hotelForm.email}
                  onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="example@hotel.uz"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleHotelSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                hotelSaved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {hotelSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t('common.saved')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.save')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h2 className={isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-gray-900'}>
                  {t('settings.userInfo')}
                </h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">{t('settings.userSub')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Avatar */}
            <div className={isDark ? 'flex items-center gap-4 p-4 bg-slate-800/80 rounded-xl' : 'flex items-center gap-4 p-4 bg-gray-50 rounded-xl'}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {userForm.name.charAt(0)}
              </div>
              <div>
                <p className={isDark ? 'font-semibold text-white text-sm' : 'font-semibold text-gray-900 text-sm'}>{userForm.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-400 capitalize">
                  {(localStorage.getItem('role') || 'Admin').toLowerCase()}
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                {t('settings.fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className={inputClass}
                  placeholder={t('settings.fullName')}
                />
              </div>
            </div>

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                {t('settings.currentPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={userForm.currentPassword}
                  onChange={(e) => setUserForm({ ...userForm, currentPassword: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                {t('settings.newPassword')}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={userForm.newPassword}
                  onChange={(e) => setUserForm({ ...userForm, newPassword: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500">{t('settings.passwordHint')}</p>
            </div>

            {/* Save button */}
            <button
              onClick={handleUserSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                userSaved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {userSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t('common.saved')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
