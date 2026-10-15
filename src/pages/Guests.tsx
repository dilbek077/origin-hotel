import { useState } from "react";
import { Eye, Pencil, Trash2, Search, UserPlus, Users } from "lucide-react";

interface Guest {
  id: number;
  fullName: string;
  phone: string;
  passport: string;
  address: string;
  lastVisit: string;
}

const mockGuests: Guest[] = [
  {
    id: 1,
    fullName: "Aliyev Jasur Baxtiyorovich",
    phone: "+998 90 123 45 67",
    passport: "AA 1234567",
    address: "Toshkent, Yunusobod tumani",
    lastVisit: "12.10.2025",
  },
  {
    id: 2,
    fullName: "Karimova Malika Saidovna",
    phone: "+998 91 234 56 78",
    passport: "AB 2345678",
    address: "Samarqand, Registon ko'chasi",
    lastVisit: "05.10.2025",
  },
  {
    id: 3,
    fullName: "Toshmatov Sardor Ulugbekovich",
    phone: "+998 93 345 67 89",
    passport: "AC 3456789",
    address: "Buxoro, Markaziy ko'cha",
    lastVisit: "28.09.2025",
  },
  {
    id: 4,
    fullName: "Rahimova Dilnoza Hamidovna",
    phone: "+998 94 456 78 90",
    passport: "AD 4567890",
    address: "Namangan, Navoi ko'chasi",
    lastVisit: "20.09.2025",
  },
  {
    id: 5,
    fullName: "Yusupov Bobur Erkinovich",
    phone: "+998 95 567 89 01",
    passport: "AE 5678901",
    address: "Andijon, Mustaqillik xiyoboni",
    lastVisit: "15.09.2025",
  },
  {
    id: 6,
    fullName: "Nazarova Feruza Toxirovna",
    phone: "+998 97 678 90 12",
    passport: "AF 6789012",
    address: "Farg'ona, Bog'ishamol ko'chasi",
    lastVisit: "08.09.2025",
  },
];

export default function Guests() {
  const [search, setSearch] = useState("");

  const filtered = mockGuests.filter(
    (g) =>
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.passport.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mehmonlar</h1>
            <p className="text-sm text-gray-500">{mockGuests.length} ta mehmon ro'yxatda</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Yangi mehmon
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Ism, telefon yoki passport bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  F.I.O
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Telefon
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Passport
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Manzil
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  So'nggi tashrif
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Mehmon topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((guest, index) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">
                            {guest.fullName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{guest.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{guest.phone}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded-lg text-xs">
                        {guest.passport}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                      {guest.address}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{guest.lastVisit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          title="Ko'rish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Tahrirlash"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="O'chirish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Jami {filtered.length} ta mehmon ko'rsatilmoqda
          </span>
        </div>
      </div>
    </div>
  );
}
