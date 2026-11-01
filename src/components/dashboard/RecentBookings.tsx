import { useTranslation, type LanguageCode } from '@/i18n';
import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import type { Booking } from "@/types/booking";

interface RecentBookingsProps {
  bookings: Booking[];
}

const formatBookingDate = (date: string, locale: LanguageCode) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString(locale, { day: "numeric", month: "short" });
};

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const { locale } = useTranslation();
  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Yashamoqda":
        return "default";
      case "Tasdiqlangan":
        return "secondary";
      case "Bekor":
        return "destructive";
      default:
        return "outline";
    }
  };

  const recent = bookings.slice(0, 5);

  if (recent.length === 0) {
    return (
      <L.div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
        <CalendarDays className="h-8 w-8 text-muted-foreground/60" />
        <L.p>Hozircha yangi bronlar mavjud emas.</L.p>
      </L.div>
    );
  }

  return (
    <L.div className="space-y-3">
      {recent.map((booking) => {
        const initials = booking.guest
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <L.div
            key={booking.id}
            className="flex items-center justify-between gap-4 p-2 rounded-lg transition-colors hover:bg-muted/50"
          >
            <L.div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 border border-blue-100 dark:border-blue-900/50">
                <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-sky-300">
                  <LocalizedText>{initials || "GH"}</LocalizedText>
                </AvatarFallback>
              </Avatar>
              <L.div className="min-w-0">
                <L.div className="flex items-center gap-2">
                  <L.p className="truncate text-sm font-medium leading-none text-foreground">
                    {booking.guest}
                  </L.p>
                  <Badge variant={getBadgeVariant(booking.status)} className="h-5 px-1.5 text-[10px] font-medium">
                    <LocalizedText>{booking.status}</LocalizedText>
                  </Badge>
                </L.div>
                <L.p className="mt-1 truncate text-xs text-muted-foreground">
                  Xona {booking.room} · {formatBookingDate(booking.checkIn, locale)} – {formatBookingDate(booking.checkOut, locale)} ({booking.nights} k.)
                </L.p>
              </L.div>
            </L.div>

            <L.div className="text-right shrink-0">
              <L.p className="text-sm font-semibold tracking-tight text-foreground flex items-center justify-end">
                <ArrowUpRight className="mr-0.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                +{booking.price.toLocaleString("uz-UZ")}
              </L.p>
              <L.p className="text-[11px] text-muted-foreground">so‘m</L.p>
            </L.div>
          </L.div>
        );
      })}
    </L.div>
  );
}
