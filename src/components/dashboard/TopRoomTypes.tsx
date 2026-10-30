import { BedDouble, Sparkles, Building, Crown, type LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

interface TopRoomTypesProps {
  rooms: Room[];
  bookings: Booking[];
}

export function TopRoomTypes({ rooms, bookings }: TopRoomTypesProps) {
  const categoryConfig: Record<string, { label: string; icon: LucideIcon }> = {
    Standard: { label: "Standart xonalar", icon: BedDouble },
    Standart: { label: "Standart xonalar", icon: BedDouble },
    Deluxe: { label: "Deluxe xonalar", icon: Sparkles },
    Lyuks: { label: "Lyuks xonalar", icon: Sparkles },
    Suite: { label: "Suite / VIP", icon: Crown },
    Family: { label: "Oilaviy xonalar", icon: Building },
    Oilaviy: { label: "Oilaviy xonalar", icon: Building },
  };

  const totalBookingsCount = bookings.length || 1;
  const categoriesMap = new Map<string, { count: number; revenue: number }>();

  [...new Set(rooms.map((room) => room.type))].forEach((type) => {
    categoriesMap.set(type, { count: 0, revenue: 0 });
  });

  bookings.forEach((b) => {
    const room = rooms.find((r) => r.id === b.roomId);
    const type = room?.type || "Standart";
    const current = categoriesMap.get(type) || { count: 0, revenue: 0 };
    categoriesMap.set(type, {
      count: current.count + 1,
      revenue: current.revenue + (b.price || 0),
    });
  });

  const categories = Array.from(categoriesMap.entries())
    .map(([type, data]) => {
      const cfg = categoryConfig[type] || {
        label: `${type} toifasi`,
        icon: BedDouble,
      };
      const count = data.count;
      const revenue = data.revenue;
      const percent = Math.min(100, Math.round((count / totalBookingsCount) * 100));

      return {
        type,
        label: cfg.label,
        Icon: cfg.icon,
        count,
        revenue,
        percent,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-4">
      {categories.map((item) => {
        const Icon = item.Icon;
        return (
          <div key={item.type} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-sky-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground">{item.count} ta bron</span>
                <span className="font-semibold text-foreground">
                  {item.revenue.toLocaleString("uz-UZ")} so‘m
                </span>
              </div>
            </div>
            <Progress value={item.percent} className="h-1.5 bg-muted" indicatorClassName="bg-blue-600 dark:bg-sky-400" />
          </div>
        );
      })}
    </div>
  );
}
