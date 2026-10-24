import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";
import type { Booking } from "@/types/booking";

interface RecentBookingsProps {
  bookings: Booking[];
}

const formatBookingDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
};

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Yashamoqda":
        return "text-primary";
      case "Tasdiqlangan":
        return "text-emerald-600 dark:text-emerald-400";
      case "Bekor":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const recent = bookings.slice(0, 6);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
        <CalendarDays className="h-5 w-5" />
        Hozircha hech qanday bron mavjud emas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recent.map((booking) => {
        const initials = booking.guest
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return (
          <div
            key={booking.id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-3.5"
          >
            <Avatar className="row-span-2 h-10 w-10 self-center border border-primary/10 sm:row-span-1">
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 self-center">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <p className="min-w-0 truncate text-sm font-semibold text-foreground">
                  {booking.guest}
                </p>
                <span className={`shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {booking.room}
                <span className="mx-1.5 text-border">·</span>
                {formatBookingDate(booking.checkIn)} – {formatBookingDate(booking.checkOut)}
                <span className="mx-1.5 text-border">·</span>
                {booking.nights} kecha
              </p>
            </div>

            <div className="col-start-2 row-start-2 flex items-center justify-between gap-2 sm:col-start-auto sm:row-start-auto">
              <p className="self-center whitespace-nowrap text-sm font-bold text-foreground sm:text-right">
                {booking.price.toLocaleString("uz-UZ")} <span className="text-xs font-medium text-muted-foreground">so‘m</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
