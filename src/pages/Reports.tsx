import { useState } from 'react';
import {
  BarChart2,
  BedDouble,
  Users,
  CalendarCheck,
  Download,
  Eye,
  Calendar,
} from 'lucide-react';

const reportCards = [
  {
    id: 1,
    icon: BarChart2,
    title: 'Daromad hisoboti',
    description: "Oylik va yillik daromadlar tahlili, kategoriyalar bo'yicha breakdown va o'sish ko'rsatkichlari.",
    color: 'blue',
  },
  {
    id: 2,
    icon: BedDouble,
    title: 'Xona band hisoboti',
    description: "Xonalarning bandlik darajasi, bo'sh va band kunlar statistikasi hamda dolzarb tendentsiyalar.",
    color: 'green',
  },
  {
    id: 3,
    icon: Users,
    title: 'Mehmon hisoboti',
    description: "Mehmonlar soni, qayta tashrif buyuruvchilar ulushi, millat va yoshga ko'ra tahlil.",
    color: 'purple',
  },
  {
    id: 4,
    icon: CalendarCheck,
    title: 'Bron hisoboti',
    description: "Bronlar soni, bekor qilishlar, oldindan to'lovlar va kanallar bo'yicha taqsimot.",
    color: 'orange',
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string; btn: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',   btn: 'bg-blue-600 hover:bg-blue-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  badge: 'bg-green-100 text-green-700',  btn: 'bg-green-600 hover:bg-green-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
};

const monthlyStats = [
  { month: "Yanvar",   income: 18500000, rooms: 142, guests: 198, bookings: 85,  occupancy: '72%' },
  { month: "Fevral",  income: 16200000, rooms: 128, guests: 174, bookings: 76,  occupancy: '65%' },
  { month: "Mart",    income: 21000000, rooms: 165, guests: 224, bookings: 98,  occupancy: '81%' },
  { month: "Aprel",   income: 23500000, rooms: 178, guests: 245, bookings: 112, occupancy: '87%' },
  { month: "May",     income: 25800000, rooms: 192, guests: 267, bookings: 124, occupancy: '92%' },
  { month: "Iyun",    income: 28100000, rooms: 201, guests: 289, bookings: 136, occupancy: '95%' },
];

const formatCurrency = (n: number) => n.toLocaleString('uz-UZ') + " so'm";

export default function Reports() {
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-06-30');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hisobotlar</h1>
          <p className="text-sm text-gray-500 mt-1">Mehmonxona faoliyati tahlili va hisobotlari</p>
        </div>

        {/* Date Filter + Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="text-sm text-gray-700 outline-none bg-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm">—</span>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="text-sm text-gray-700 outline-none bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Eksport
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reportCards.map(card => {
          const c = colorMap[card.color];
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                  Aktiv
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
              </div>
              <button className={`w-full flex items-center justify-center gap-2 text-white text-xs font-medium py-2 rounded-lg transition-colors ${c.btn}`}>
                <Eye className="w-3.5 h-3.5" />
                Ko'rish
              </button>
            </div>
          );
        })}
      </div>

      {/* Monthly Stats Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Oylik umumiy statistika</h2>
          <p className="text-xs text-gray-400 mt-0.5">2024-yil, 1-6 oy</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-6 py-3 font-medium">Oy</th>
                <th className="px-6 py-3 font-medium">Daromad</th>
                <th className="px-6 py-3 font-medium">Xonalar</th>
                <th className="px-6 py-3 font-medium">Mehmonlar</th>
                <th className="px-6 py-3 font-medium">Bronlar</th>
                <th className="px-6 py-3 font-medium">Bandlik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyStats.map(row => (
                <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{formatCurrency(row.income)}</td>
                  <td className="px-6 py-4 text-gray-700">{row.rooms}</td>
                  <td className="px-6 py-4 text-gray-700">{row.guests}</td>
                  <td className="px-6 py-4 text-gray-700">{row.bookings}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: row.occupancy }}
                        />
                      </div>
                      <span className="text-gray-700 font-medium text-xs">{row.occupancy}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-6 py-4 font-semibold text-gray-700">Jami</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  {formatCurrency(monthlyStats.reduce((s, r) => s + r.income, 0))}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {monthlyStats.reduce((s, r) => s + r.rooms, 0)}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {monthlyStats.reduce((s, r) => s + r.guests, 0)}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {monthlyStats.reduce((s, r) => s + r.bookings, 0)}
                </td>
                <td className="px-6 py-4 font-semibold text-blue-600">82%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
