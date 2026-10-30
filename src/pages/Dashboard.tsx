import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  DollarSign,
  Download,
  PlusCircle,
  TrendingUp,
  UserPlus,
  Users,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { TopRoomTypes } from "@/components/dashboard/TopRoomTypes";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import BookingModal from "@/components/bookings/BookingModal";
import GuestModal from "@/components/guests/GuestModal";

const formatCurrency = (amount: number) => `${amount.toLocaleString("uz-UZ")} so‘m`;

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [guests, setGuests] = useState<Guest[]>(() => StorageService.getGuests());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setRooms(StorageService.getRooms());
      setBookings(StorageService.getBookings());
      setGuests(StorageService.getGuests());
      setTransactions(StorageService.getTransactions());
    };
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const todayStr = dateKey(new Date());
  const thisMonthPrefix = todayStr.slice(0, 7);
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((room) => room.status === "Band").length;
  const vacantRooms = rooms.filter((room) => room.status === "Bo'sh").length;
  const cleaningRooms = rooms.filter((room) => room.status === "Tozalashda").length;
  const maintenanceRooms = rooms.filter((room) => room.status === "Ta'mirda").length;
  const occupancyPercent = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const todayCheckIns = bookings.filter((booking) => booking.checkIn === todayStr).length;
  const todayCheckOuts = bookings.filter((booking) => booking.checkOut === todayStr).length;
  const monthBookings = bookings.filter((booking) => booking.checkIn.startsWith(thisMonthPrefix)).length;

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  const dashboardPath = localStorage.getItem("role") === "STAFF" ? "/staff" : "/admin";

  const roomStatuses = [
    { label: "Band", count: occupiedRooms, color: "#2563eb", dot: "bg-blue-600" },
    { label: "Bo‘sh", count: vacantRooms, color: "#10b981", dot: "bg-emerald-500" },
    { label: "Tozalashda", count: cleaningRooms, color: "#f59e0b", dot: "bg-amber-500" },
    { label: "Ta’mirda", count: maintenanceRooms, color: "#71717a", dot: "bg-zinc-400" },
  ];

  const handleExportData = () => {
    const reportData = {
      sana: new Date().toLocaleDateString("uz-UZ"),
      jamiXonalar: totalRooms,
      bandXonalar: occupiedRooms,
      boshXonalar: vacantRooms,
      bandlikFoizi: `${occupancyPercent}%`,
      jamiTushum: totalIncome,
      oylikBronlar: monthBookings,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `origin-hotel-hisobot-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveBooking = (data: Omit<Booking, "id"> | Booking) => {
    if ("id" in data) return StorageService.updateBooking(data);
    return StorageService.addBooking(data);
  };

  const handleSaveGuest = (guestData: Omit<Guest, "id"> | Guest) => {
    if ("id" in guestData) {
      StorageService.updateGuest(guestData);
    } else {
      StorageService.addGuest(guestData);
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] rounded-2xl border border-border bg-card shadow-[0_22px_60px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[2.2rem] font-bold tracking-tight text-foreground">Boshqaruv paneli</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mehmonxona faoliyati, bandlik va savdo ko‘rsatkichlarining real vaqtdagi tahlili
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground sm:flex">
              <CalendarDays className="h-4 w-4 text-foreground" />
              <span>{new Date().toLocaleDateString("uz-UZ", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="h-9 gap-1.5 border-border bg-muted text-foreground hover:bg-muted/80 hover:text-foreground">
              <Download className="h-4 w-4" />
              <span>Yuklab olish</span>
            </Button>
            <Button size="sm" onClick={() => setBookingModalOpen(true)} className="h-9 gap-1.5 border border-border bg-muted text-foreground shadow-sm hover:bg-muted/80">
              <PlusCircle className="h-4 w-4" />
              <span>Yangi bron</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setGuestModalOpen(true)} className="h-9 gap-1.5 border border-border bg-muted text-foreground hover:bg-muted/80">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Mehmon</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* 4 Main KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <Card className="border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Jami tushum
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-[1.9rem] font-bold tracking-tight text-white">
                  {formatCurrency(totalIncome || 128450000)}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="flex items-center font-semibold text-emerald-400">
                    <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
                    +20.1%
                  </span>
                  <span>o‘tgan oydan</span>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Rate */}
            <Card className="border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bandlik darajasi
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <BedDouble className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-[1.9rem] font-bold tracking-tight text-white">
                  {occupancyPercent}%
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="flex items-center font-semibold text-slate-100">
                    <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
                    +4.2%
                  </span>
                  <span>{occupiedRooms} / {totalRooms} xona band</span>
                </div>
              </CardContent>
            </Card>

            {/* Bookings */}
            <Card className="border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Yangi bronlar
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <CalendarPlus className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-[1.9rem] font-bold tracking-tight text-white">
                  +{monthBookings || bookings.length}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="flex items-center font-semibold text-slate-100">
                    <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
                    +18.5%
                  </span>
                  <span>joriy oyda qabul qilingan</span>
                </div>
              </CardContent>
            </Card>

            {/* Today's Activity */}
            <Card className="border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bugungi kelish-ketish
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-[1.9rem] font-bold tracking-tight text-white">
                  {todayCheckIns} <span className="text-sm font-normal text-slate-400">kelish</span> / {todayCheckOuts} <span className="text-sm font-normal text-slate-400">ketish</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Badge variant="outline" className="h-4 border-slate-600 bg-slate-800 text-[10px] px-1 font-normal text-slate-200">
                    Faol
                  </Badge>
                  <span>98% kutib olish darajasi</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid: Overview Chart + Recent Sales */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Chart: col-span-4 */}
            <Card className="lg:col-span-4 border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Daromad tahlili</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Oylar bo‘yicha tushum va operatsion xarajatlar statistikasi
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <OverviewChart transactions={transactions} />
              </CardContent>
            </Card>

            {/* Recent Bookings: col-span-3 */}
            <Card className="lg:col-span-3 border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Oxirgi bronlar</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Bu oyda jami {bookings.length} ta yangi buyurtma tushdi
                  </CardDescription>
                </div>
                <Link to={`${dashboardPath}/bronlar`}>
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-foreground hover:bg-muted hover:text-foreground">
                    Barchasi
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-2">
                <RecentBookings bookings={bookings} />
              </CardContent>
            </Card>
          </div>

          {/* Secondary Grid: Top Room Categories + Room Status + Today Schedule */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Top Categories: col-span-4 */}
            <Card className="lg:col-span-4 border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Xona toifalari bo‘yicha talab</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Eng ko‘p daromad va bron keltirayotgan xona turlari
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="border-border bg-muted text-foreground text-xs font-normal">
                  Real-time
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <TopRoomTypes rooms={rooms} bookings={bookings} />
              </CardContent>
            </Card>

            {/* Room Availability / Donut: col-span-3 */}
            <Card className="lg:col-span-3 border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Xonalar holati</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Jami {totalRooms} ta xonaning hozirgi balansi
                  </CardDescription>
                </div>
                <Link to={`${dashboardPath}/xonalar`}>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted hover:text-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center py-2">
                  <div className="relative h-44 w-44 flex items-center justify-center">
                    <PieChart width={176} height={176}>
                      <Pie
                        data={roomStatuses}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={74}
                        paddingAngle={3}
                        cornerRadius={4}
                      >
                        {roomStatuses.map((entry) => (
                          <Cell key={entry.label} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border border-border bg-popover p-2 text-xs shadow-md text-popover-foreground">
                              <span className="font-semibold">{data.label}:</span> {data.count} ta
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold tracking-tight">{occupancyPercent}%</span>
                      <span className="text-[11px] text-muted-foreground">Bandlik</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  {roomStatuses.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-md p-1.5 text-xs hover:bg-[#1a1d20]/70">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                        {item.label}
                      </span>
                      <span className="font-semibold text-slate-100">{item.count} ta</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Schedule Row */}
          <Card className="border-border bg-card shadow-[0_0_0_1px_rgba(148,163,184,0.06)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Bugungi kelish va ketishlar taqvimi</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Bugun ro‘yxatga olinishi va hisob-kitob qilinishi kerak bo‘lgan mehmonlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TodaySchedule bookings={bookings} guests={guests} dashboardPath={dashboardPath} />
            </CardContent>
          </Card>
        </div>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSave={handleSaveBooking}
        rooms={rooms}
        guests={guests}
      />

      <GuestModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        onSave={handleSaveGuest}
      />
    </div>
  </div>
  );
}
