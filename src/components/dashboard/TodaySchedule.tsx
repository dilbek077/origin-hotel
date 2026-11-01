import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { LogIn, LogOut, Phone, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";

interface TodayScheduleProps {
  bookings: Booking[];
  guests: Guest[];
  dashboardPath: string;
}

export function TodaySchedule({ bookings, guests, dashboardPath }: TodayScheduleProps) {
  const today = new Date().toISOString().slice(0, 10);

  const todayArrivals = bookings.filter((b) => b.checkIn === today);
  const todayDepartures = bookings.filter((b) => b.checkOut === today);

  const displayArrivals = todayArrivals.length > 0 ? todayArrivals : bookings.slice(0, 2);
  const displayDepartures = todayDepartures.length > 0 ? todayDepartures : bookings.slice(2, 4);

  return (
    <L.div className="space-y-4">
      <L.div className="grid gap-3 sm:grid-cols-2">
        {/* Arrivals */}
        <L.div className="rounded-lg border border-border p-3.5 bg-card">
          <L.div className="flex items-center justify-between mb-3">
            <L.span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <LogIn className="h-4 w-4" />
              Bugungi kelishlar ({todayArrivals.length})
            </L.span>
            <Badge variant="outline" className="text-[10px]"><LocalizedText>
              Check-in
            </LocalizedText></Badge>
          </L.div>
          {displayArrivals.length === 0 ? (
            <L.p className="text-xs text-muted-foreground py-2">Bugun kutilayotgan mehmonlar yo‘q</L.p>
          ) : (
            <L.div className="space-y-2">
              {displayArrivals.map((b) => {
                const guestPhone = guests.find((guest) => guest.id === b.guestId)?.phone;
                return (
                  <L.div
                    key={`arr-${b.id}`}
                    className="flex items-center justify-between gap-2 rounded-md bg-muted/50 p-2 text-xs"
                  >
                    <L.div className="min-w-0">
                      <L.p className="truncate font-medium text-foreground">{b.guest}</L.p>
                      <L.div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <L.span>Xona: {b.room}</L.span>
                        {guestPhone && (
                          <L.span className="flex items-center gap-0.5">
                            <Phone className="h-2.5 w-2.5" />
                            {guestPhone}
                          </L.span>
                        )}
                      </L.div>
                    </L.div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      <LocalizedText>{b.status}</LocalizedText>
                    </Badge>
                  </L.div>
                );
              })}
            </L.div>
          )}
        </L.div>

        {/* Departures */}
        <L.div className="rounded-lg border border-border p-3.5 bg-card">
          <L.div className="flex items-center justify-between mb-3">
            <L.span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <LogOut className="h-4 w-4" />
              Bugungi ketishlar ({todayDepartures.length})
            </L.span>
            <Badge variant="outline" className="text-[10px]"><LocalizedText>
              Check-out
            </LocalizedText></Badge>
          </L.div>
          {displayDepartures.length === 0 ? (
            <L.p className="text-xs text-muted-foreground py-2">Bugun ketadigan mehmonlar yo‘q</L.p>
          ) : (
            <L.div className="space-y-2">
              {displayDepartures.map((b) => (
                <L.div
                  key={`dep-${b.id}`}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50 text-xs"
                >
                  <L.div className="min-w-0">
                    <L.p className="font-medium truncate text-foreground">{b.guest}</L.p>
                    <L.div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                      <L.span>Xona: {b.room}</L.span>
                      <L.span>{b.nights} kecha</L.span>
                    </L.div>
                  </L.div>
                  <Badge variant="outline" className="shrink-0 text-[10px]"><LocalizedText>
                    Hisob-kitob
                  </LocalizedText></Badge>
                </L.div>
              ))}
            </L.div>
          )}
        </L.div>
      </L.div>

      <L.div className="flex justify-end">
        <Link to={`${dashboardPath}/bronlar/kelish-ketish`}>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-foreground"><LocalizedText>
            To‘liq kelish-ketish jadvali
            </LocalizedText><ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </L.div>
    </L.div>
  );
}
