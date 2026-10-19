import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  DollarSign,
  TrendingUp,
  Clock,
  PlusCircle,
  UserPlus,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Sparkles,
} from "lucide-react";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Types & Services
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Transaction } from "@/types/finance";
import { StorageService } from "@/services/storage";

// Dashboard subcomponents
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import BookingModal from "@/components/bookings/BookingModal";
import GuestModal from "@/components/guests/GuestModal";

const formatCurrency = (n: number) => n.toLocaleString("uz-UZ") + " so‘m";

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const loadData = () => {
    setRooms(StorageService.getRooms());
    setBookings(StorageService.getBookings());
    setGuests(StorageService.getGuests());
    setTransactions(StorageService.getTransactions());
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  // Room metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "Band").length;
  const vacantRooms = rooms.filter((r) => r.status === "Bo'sh").length;
  const cleaningRooms = rooms.filter((r) => r.status === "Tozalashda").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "Ta'mirda").length;

  const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Today's check-ins and check-outs
  const todayCheckIns = bookings.filter((b) => b.checkIn === todayStr).length;
  const todayCheckOuts = bookings.filter((b) => b.checkOut === todayStr).length;

  // Income & Expense totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const handleSaveBooking = (data: Omit<Booking, "id"> | Booking) => {
    if ("id" in data) {
      return StorageService.updateBooking(data as Booking);
    } else {
      return StorageService.addBooking(data);
    }
  };

  const handleSaveGuest = (guestData: Omit<Guest, "id"> | Guest) => {
    if ("id" in guestData) {
      StorageService.updateGuest(guestData as Guest);
    } else {
      StorageService.addGuest(guestData);
    }
    return true;
  };

  const handleCheckIn = (id: number) => {
    if (window.confirm("Mehmonni ro‘yxatga olish (Check-in) va xonani Band qilishni tasdiqlaysizmi?")) {
      StorageService.checkInBooking(id);
    }
  };

  const handleCheckOut = (id: number) => {
    if (window.confirm("Mehmonni chiqarish (Check-out) va xonani tozalashga o‘tkazishni tasdiqlaysizmi?")) {
      StorageService.checkOutBooking(id);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-foreground">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Boshqaruv paneli
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1 border-primary/20 text-primary">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Demo tizim
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Bugun:{" "}
            {new Date().toLocaleDateString("uz-UZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Action Buttons using shadcn Button */}
        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setBookingModalOpen(true)}
            className="gap-2 shadow-sm font-semibold cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Yangi bron
          </Button>
          <Button
            variant="outline"
            onClick={() => setGuestModalOpen(true)}
            className="gap-2 shadow-sm font-semibold cursor-pointer"
          >
            <UserPlus className="h-4 w-4 text-purple-600" />
            Yangi mehmon
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards using shadcn Card */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Jami Kirim */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Kirim (Daromad)
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +14.2%
              </span>
              <span>o‘tgan davrga nisbatan</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Chiqim & Sof Foyda */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sof Natija / Chiqim
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-blue-600" : "text-destructive"}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Chiqimlar: <span className="font-semibold text-rose-500">{formatCurrency(totalExpense)}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Xonalar bandligi */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Xonalar Bandligi
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BedDouble className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {occupancyPercent}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {occupiedRooms} band / {vacantRooms} bo‘sh ({totalRooms} jami)
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Bugungi Kirish/Chiqish */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bugungi Kirish/Chiqish
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayCheckIns} <span className="text-muted-foreground text-sm font-normal">kirish</span> / {todayCheckOuts} <span className="text-muted-foreground text-sm font-normal">chiqish</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kutilayotgan umumiy amallar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation using shadcn Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="overview" className="cursor-pointer font-semibold">
            Umumiy ko‘rinish
          </TabsTrigger>
          <TabsTrigger value="rooms" className="cursor-pointer font-semibold">
            Xonalar holati
          </TabsTrigger>
          <TabsTrigger value="finance" className="cursor-pointer font-semibold">
            Moliyaviy taqsimot
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Overview Chart (4 cols) */}
            <Card className="col-span-4 border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Moliyaviy o‘sish grafigi</CardTitle>
                    <CardDescription>Oylik kirim va chiqim ko‘rsatkichlari (ming so‘mda)</CardDescription>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      Kirim
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Chiqim
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart transactions={transactions} />
              </CardContent>
            </Card>

            {/* Recent Bookings (3 cols) */}
            <Card className="col-span-3 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>So‘nggi bronlar</CardTitle>
                  <CardDescription>
                    Mehmonlar va xona holati
                  </CardDescription>
                </div>
                <Link to="/admin/bronlar">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Barchasi <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentBookings
                  bookings={bookings}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Rooms Status */}
        <TabsContent value="rooms" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Xonalar to‘liq monitoringi</CardTitle>
                <CardDescription>Xonalarning real vaqtdagi holati va bandligi</CardDescription>
              </div>
              <Link to="/admin/xonalar">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Xonalar boshqaruvi <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status summary pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700">Bo‘sh xonalar</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-800 mt-2">{vacantRooms} ta</p>
                </div>

                <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-red-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-700">Band xonalar</span>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-black text-red-800 mt-2">{occupiedRooms} ta</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700">Tozalashda</span>
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-black text-amber-800 mt-2">{cleaningRooms} ta</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-700">Ta’mirda</span>
                    <Wrench className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-purple-800 mt-2">{maintenanceRooms} ta</p>
                </div>
              </div>

              {/* Rooms grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {rooms.map((room) => {
                  const getStatusColor = (s: string) => {
                    switch (s) {
                      case "Bo'sh":
                        return "bg-emerald-50 border-emerald-200 text-emerald-800";
                      case "Band":
                        return "bg-red-50 border-red-200 text-red-800";
                      case "Tozalashda":
                        return "bg-amber-50 border-amber-200 text-amber-800";
                      default:
                        return "bg-purple-50 border-purple-200 text-purple-800";
                    }
                  };

                  return (
                    <div
                      key={room.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${getStatusColor(room.status)}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-black text-base">#{room.number}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/80">
                          {room.floor}-q
                        </span>
                      </div>
                      <div className="mt-2 space-y-0.5 text-xs">
                        <p className="font-semibold truncate">{room.type}</p>
                        <p className="font-bold opacity-90">{room.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Finance Analytics */}
        <TabsContent value="finance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Income 5 Categories */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Kirimlar taqsimoti (5 ta kategoriya)</CardTitle>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    Jami: {formatCurrency(totalIncome)}
                  </Badge>
                </div>
                <CardDescription>TZ bo‘yicha belgilangan daromad manbalari</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Xona haqi",
                  "Ovqatlanish",
                  "Qo‘shimcha xizmatlar",
                  "Ijara",
                  "Boshqa kirim",
                ].map((cat) => {
                  const catSum = transactions
                    .filter((t) => t.type === "income" && t.category === cat)
                    .reduce((s, t) => s + t.amount, 0);
                  const pct = totalIncome > 0 ? Math.round((catSum / totalIncome) * 100) : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{cat}</span>
                        <span>{formatCurrency(catSum)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Expense 5 Categories */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Chiqimlar taqsimoti (5 ta kategoriya)</CardTitle>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    Jami: {formatCurrency(totalExpense)}
                  </Badge>
                </div>
                <CardDescription>TZ bo‘yicha belgilangan xarajat yo‘nalishlari</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Ish haqi",
                  "Kommunal to‘lovlar",
                  "Material/xaridlar",
                  "Ta’mirlash",
                  "Boshqa chiqim",
                ].map((cat) => {
                  const catSum = transactions
                    .filter((t) => t.type === "expense" && t.category === cat)
                    .reduce((s, t) => s + t.amount, 0);
                  const pct = totalExpense > 0 ? Math.round((catSum / totalExpense) * 100) : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{cat}</span>
                        <span>{formatCurrency(catSum)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
  );
}
