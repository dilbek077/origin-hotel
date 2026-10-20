import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import type { Booking } from "@/types/booking";

interface RecentBookingsProps {
  bookings: Booking[];
  onCheckIn: (id: number) => void;
  onCheckOut: (id: number) => void;
}

export function RecentBookings({
  bookings,
  onCheckIn,
  onCheckOut,
}: RecentBookingsProps) {
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
      <div className="py-8 text-center text-sm text-muted-foreground">
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
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-border/40"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {booking.guest}
                  </p>
                  <span className={`text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {booking.room} • {booking.checkIn} → {booking.checkOut} ({booking.nights} kecha)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {booking.price.toLocaleString("uz-UZ")} so‘m
                </p>
              </div>

              {/* Quick check-in / check-out */}
              {(booking.status === "Tasdiqlangan" || booking.status === "Kutilmoqda") && (
                <Button
                  size="sm"
                  className="h-8 shrink-0 whitespace-nowrap gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  onClick={() => onCheckIn(booking.id)}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Check-in
                </Button>
              )}

              {booking.status === "Yashamoqda" && (
                <Button
                  size="sm"
                  className="h-8 shrink-0 whitespace-nowrap gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  onClick={() => onCheckOut(booking.id)}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Check-out
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
