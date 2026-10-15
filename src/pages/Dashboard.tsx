import {
  BedDouble,
  CheckCircle,
  Circle,
  Users,
  PlusCircle,
  UserPlus,
} from "lucide-react";

const statCards = [
  {
    label: "Jami xonalar",
    value: 50,
    icon: BedDouble,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    label: "Band xonalar",
    value: 32,
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
  },
  {
    label: "Bo'sh xonalar",
    value: 18,
    icon: Circle,
    iconColor: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-100",
  },
  {
    label: "Bugungi mehmonlar",
    value: 28,
    icon: Users,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
];

const bookings = [
  {
    id: 1,
    guest: "Alisher Karimov",
    room: "101 - Standart",
    checkIn: "2026-10-15",
    checkOut: "2026-10-18",
    status: "Tasdiqlangan",
  },
  {
    id: 2,
    guest: "Malika Yusupova",
    room: "205 - Deluxe",
    checkIn: "2026-10-15",
    checkOut: "2026-10-20",
    status: "Kutilmoqda",
  },
  {
    id: 3,
    guest: "Bobur Toshmatov",
    room: "312 - Suite",
    checkIn: "2026-10-16",
    checkOut: "2026-10-19",
    status: "Tasdiqlangan",
  },
  {
    id: 4,
    guest: "Nilufar Rahimova",
    room: "118 - Standart",
    checkIn: "2026-10-14",
    checkOut: "2026-10-17",
    status: "Bekor",
  },
  {
    id: 5,
    guest: "Jasur Akhmedov",
    room: "410 - Deluxe",
    checkIn: "2026-10-15",
    checkOut: "2026-10-22",
    status: "Kutilmoqda",
  },
];

const statusStyles: Record<string, string> = {
  Tasdiqlangan: "bg-green-100 text-green-700 border border-green-200",
  Kutilmoqda: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Bekor: "bg-red-100 text-red-600 border border-red-200",
};

export default function Dashboard() {
  const occupancyPercent = Math.round((32 / 50) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Boshqaruv paneli</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bugun:{" "}
          {new Date().toLocaleDateString("uz-UZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, iconColor, bgColor, borderColor }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl border ${borderColor} shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
          >
            <div className={`${bgColor} rounded-xl p-3`}>
              <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className="text-3xl font-bold text-gray-800 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">So'nggi bronlar</h2>
          <span className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">
            Barchasini ko'rish →
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Mehmon</th>
                <th className="px-6 py-3 text-left font-medium">Xona</th>
                <th className="px-6 py-3 text-left font-medium">Kirish</th>
                <th className="px-6 py-3 text-left font-medium">Chiqish</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{b.guest}</td>
                  <td className="px-6 py-4 text-gray-600">{b.room}</td>
                  <td className="px-6 py-4 text-gray-600">{b.checkIn}</td>
                  <td className="px-6 py-4 text-gray-600">{b.checkOut}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Quick Actions + Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Tezkor amallar</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl px-5 py-3 transition-colors flex-1 shadow-sm">
              <PlusCircle className="w-5 h-5" />
              Yangi bron
            </button>
            <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold rounded-xl px-5 py-3 transition-colors flex-1 border border-gray-200 shadow-sm">
              <UserPlus className="w-5 h-5 text-purple-500" />
              Yangi mehmon
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Yangi bron yoki mehmon qo'shish uchun yuqoridagi tugmalardan foydalaning.
          </p>
        </div>

        {/* Room Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Xona holati</h2>

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Band xonalar</span>
            <span className="font-semibold text-gray-800">
              32 / 50 ({occupancyPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-5">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-xl py-3 px-2 border border-blue-100">
              <p className="text-xl font-bold text-blue-600">50</p>
              <p className="text-xs text-gray-500 mt-1">Jami</p>
            </div>
            <div className="bg-green-50 rounded-xl py-3 px-2 border border-green-100">
              <p className="text-xl font-bold text-green-600">32</p>
              <p className="text-xs text-gray-500 mt-1">Band</p>
            </div>
            <div className="bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
              <p className="text-xl font-bold text-gray-500">18</p>
              <p className="text-xs text-gray-500 mt-1">Bo'sh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
