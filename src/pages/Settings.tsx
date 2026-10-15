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
} from 'lucide-react';

export default function Settings() {
  const [hotelForm, setHotelForm] = useState({
    name: 'Origin Hotel Tashkent',
    address: "Amir Temur ko'chasi 15, Toshkent",
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
    setUserForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    setTimeout(() => setUserSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-sm text-gray-500 mt-1">Mehmonxona va foydalanuvchi ma'lumotlarini boshqarish</p>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Hotel Ma'lumotlari</h2>
              <p className="text-xs text-gray-400">Asosiy mehmonxona konfiguratsiyasi</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Hotel Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Mehmonxona nomi
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Mehmonxona nomi"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Manzil</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={hotelForm.address}
                  onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="To'liq manzil"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={hotelForm.phone}
                  onChange={e => setHotelForm({ ...hotelForm, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+998 XX XXX XX XX"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={hotelForm.email}
                  onChange={e => setHotelForm({ ...hotelForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="example@hotel.uz"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleHotelSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                hotelSaved
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {hotelSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saqlandi!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Foydalanuvchi Ma'lumotlari</h2>
              <p className="text-xs text-gray-400">Shaxsiy ma'lumotlar va parol</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {userForm.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{userForm.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                To'liq ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Ism va familiya"
                />
              </div>
            </div>

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Joriy parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={userForm.currentPassword}
                  onChange={e => setUserForm({ ...userForm, currentPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Joriy parolni kiriting"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Yangi parol
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={userForm.newPassword}
                  onChange={e => setUserForm({ ...userForm, newPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Yangi parolni kiriting"
                />
              </div>
              <p className="text-xs text-gray-400">Kamida 8 ta belgi, raqam va harf</p>
            </div>

            {/* Save button */}
            <button
              onClick={handleUserSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userSaved
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {userSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saqlandi!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
