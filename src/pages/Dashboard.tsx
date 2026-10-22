import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  DollarSign,
  LogIn,
  LogOut,
  PlusCircle,
  UserPlus,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import BookingModal from "@/components/bookings/BookingModal";
import { CheckInConfirmDialog } from "@/components/bookings/CheckInConfirmDialog";
import { CheckOutConfirmModal } from "@/components/bookings/CheckOutConfirmModal";
import GuestModal from "@/components/guests/GuestModal";

const formatCurrency = (amount: number) => `${amount.toLocaleString("uz-UZ")} so‘m`;
const weekdayLabels = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function WeeklyBookingsChart({ bookings }: { bookings: Booking[] }) {
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = dateKey(date);

    const count = bookings.filter((booking) => booking.checkIn === key).length;

    return {
      day: weekdayLabels[date.getDay()],
      count: count || (date.getDay() % 3) + 1,
      isSample: count === 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;

            const { value, isSample } = payload[0].payload;

            return (
              <div
                className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
                style={{ color: "var(--card-foreground)", fontSize: 12 }}
              >
                <p className="font-medium">{label}</p>
                <p>{value} ta {isSample ? "namuna bron" : "bron"}</p>
              </div>
            );
          }}
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            color: "var(--card-foreground)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill="var(--primary)" radius={[5, 5, 0, 0]} maxBarSize={30}>
          {weeklyData.map((entry) => (
            <Cell key={entry.day} fill="var(--primary)" fillOpacity={entry.isSample ? 0.4 : 1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [guests, setGuests] = useState<Guest[]>(() => StorageService.getGuests());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);

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
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const dashboardPath = localStorage.getItem("role") === "STAFF" ? "/staff" : "/admin";
  const isAdmin = dashboardPath === "/admin";

  const metrics = [
    {
      label: "Yangi bronlar",
      value: monthBookings,
      note: "Joriy oyda",
      icon: CalendarPlus,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Bugungi kelish",
      value: todayCheckIns,
      note: "Check-in kutilmoqda",
      icon: LogIn,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Bugungi ketish",
      value: todayCheckOuts,
      note: "Check-out kutilmoqda",
      icon: LogOut,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Jami tushum",
      value: formatCurrency(totalIncome),
      note: "Barcha kirimlar",
      icon: DollarSign,
      iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
  ];

  const roomStatuses = [
    { label: "Band", count: occupiedRooms, color: "var(--primary)", dot: "bg-primary" },
    { label: "Bo‘sh", count: vacantRooms, color: "#34d399", dot: "bg-emerald-400" },
    { label: "Tozalashda", count: cleaningRooms, color: "#fbbf24", dot: "bg-amber-400" },
    { label: "Ta’mirda", count: maintenanceRooms, color: "#94a3b8", dot: "bg-slate-400" },
  ];

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

  const handleCheckIn = (id: number) => {
    setCheckInBooking(bookings.find((booking) => booking.id === id) ?? null);
  };

  const confirmCheckIn = (id: number) => {
    return StorageService.checkInBooking(id);
  };

  const handleCheckOut = (id: number) => {
    setCheckOutBooking(bookings.find((booking) => booking.id === id) ?? null);
  };

  const confirmCheckOut = (id: number) => {
    return StorageService.checkOutBooking(id);
  };

  return (
    <div className="min-h-screen space-y-5 bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Boshqaruv paneli</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("uz-UZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setBookingModalOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Yangi bron
          </Button>
          <Button variant="outline" onClick={() => setGuestModalOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Yangi mehmon
          </Button>
        </div>
      </div>

      <section aria-label="Asosiy ko‘rsatkichlar" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="gap-4 border-border/70 py-5 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-5 pb-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent className="px-5">
                <p className="truncate text-2xl font-bold tracking-tight">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="min-h-[380px] gap-4 border-border/70 py-5 shadow-sm xl:col-span-4">
          <CardHeader className="flex flex-row items-start justify-between px-5 pb-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Xonalar mavjudligi</CardTitle>
              <CardDescription>Jami {totalRooms} ta xona</CardDescription>
            </div>
            <Link to={`${dashboardPath}/xonalar`} aria-label="Xonalar sahifasiga o‘tish">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col px-5">
            <div className="flex min-h-[260px] flex-1 items-center gap-3 sm:gap-5">
              <div className="relative h-[230px] w-[180px] shrink-0" role="img" aria-label={`Xonalar bandligi ${occupancyPercent}%`}>
                <PieChart width={180} height={230}>
                  <Pie
                    data={roomStatuses}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy={140}
                    innerRadius={57}
                    outerRadius={84}
                    paddingAngle={2}
                    cornerRadius={5}
                    stroke="var(--card)"
                    strokeWidth={3}
                    startAngle={90}
                    endAngle={-270}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  >
                    {roomStatuses.map((status) => (
                      <Cell key={status.label} fill={status.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    allowEscapeViewBox={{ x: true, y: true }}
                    wrapperStyle={{ zIndex: 20, pointerEvents: "none" }}
                    content={({ active, payload, coordinate }) => {
                      if (!active || !payload?.length || !coordinate) return null;

                      const dx = coordinate.x - 90;
                      const dy = coordinate.y - 140;
                      const distance = Math.hypot(dx, dy) || 1;
                      const clearance = Math.max(0, 96 - distance);
                      const offsetX = Math.abs((dx / distance) * clearance);
                      const offsetY = Math.abs((dy / distance) * clearance);
                      const translateX = dx >= 0
                        ? `${offsetX}px`
                        : `calc(-100% - ${offsetX}px)`;
                      const translateY = dy >= 0
                        ? `${offsetY}px`
                        : `calc(-100% - ${offsetY}px)`;
                      const { value, name, color } = payload[0];
                      const count = Number(value);
                      const percentage = totalRooms
                        ? Math.round((count / totalRooms) * 100)
                        : 0;

                      return (
                        <div
                          className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
                          style={{
                            color: "var(--card-foreground)",
                            fontSize: 12,
                            transform: `translate(${translateX}, ${translateY})`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <p className="font-medium" style={{ color: String(color) }}>
                            {String(name)}
                          </p>
                          <p>{count} ta xona · {percentage}%</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
                <div className="pointer-events-none absolute inset-x-0 top-[140px] flex -translate-y-1/2 flex-col items-center justify-center">
                  <span className="text-2xl font-bold tracking-tight">{occupancyPercent}%</span>
                  <span className="text-xs text-muted-foreground">band</span>
                </div>
              </div>
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3">
                {roomStatuses.map((status) => (
                  <div key={status.label} className="flex min-w-0 items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-2 truncate text-xs text-muted-foreground">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dot}`} />
                      <span className="truncate">{status.label}</span>
                    </p>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-semibold">
                        {totalRooms ? Math.round((status.count / totalRooms) * 100) : 0}%
                      </span>
                      <span className="ml-1 text-[10px] text-muted-foreground">({status.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Bandlik darajasi</span>
              <span className="text-lg font-bold text-primary">{occupancyPercent}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-4 border-border/70 py-5 shadow-sm xl:col-span-8">
          <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pb-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Daromad dinamikasi</CardTitle>
              <CardDescription>
                Oylik kirim va chiqim, ming so‘mda
              </CardDescription>
            </div>
            {isAdmin && (
              <Link to="/admin/moliya" aria-label="Moliya sahifasiga o‘tish">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="px-3 sm:px-5">
            <OverviewChart transactions={transactions} />
          </CardContent>
        </Card>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-12">
        <Card className="gap-4 border-border/70 py-5 shadow-sm xl:col-span-5">
          <CardHeader className="flex flex-row items-start justify-between px-5 pb-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Bronlar</CardTitle>
              <CardDescription>Oxirgi 7 kun · namuna kunlari xira rangda</CardDescription>
            </div>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-5">
            <WeeklyBookingsChart bookings={bookings} />
          </CardContent>
        </Card>

        <Card className="gap-4 border-border/70 py-5 shadow-sm xl:col-span-7">
          <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pb-0">
            <div className="space-y-1">
              <CardTitle className="text-base">So‘nggi bronlar</CardTitle>
              <CardDescription>Mehmonlar va bron holati</CardDescription>
            </div>
            <Link to={`${dashboardPath}/bronlar`}>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Barchasi <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-4 sm:px-5">
            <RecentBookings
              bookings={bookings}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </CardContent>
        </Card>
      </section>

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
      <CheckInConfirmDialog
        booking={checkInBooking}
        onOpenChange={(open) => {
          if (!open) setCheckInBooking(null);
        }}
        onConfirm={confirmCheckIn}
      />
      <CheckOutConfirmModal
        booking={checkOutBooking}
        onOpenChange={(open) => {
          if (!open) setCheckOutBooking(null);
        }}
        onConfirm={confirmCheckOut}
      />
    </div>
  );
}
