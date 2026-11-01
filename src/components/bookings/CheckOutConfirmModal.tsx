import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/Modal";
import type { Booking } from "@/types/booking";

interface CheckOutConfirmModalProps {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (bookingId: number) => boolean;
}

export function CheckOutConfirmModal({
  booking,
  onOpenChange,
  onConfirm,
}: CheckOutConfirmModalProps) {
  const [error, setError] = useState("");

  const handleOpenChange = (open: boolean) => {
    setError("");
    onOpenChange(open);
  };

  const handleConfirm = () => {
    if (!booking) return;
    if (onConfirm(booking.id)) {
      setError("");
      onOpenChange(false);
    } else {
      setError("Check-out amalga oshmadi. Bron ma’lumotini tekshirib, qayta urinib ko‘ring.");
    }
  };

  return (
    <Modal
      isOpen={booking !== null}
      onClose={() => handleOpenChange(false)}
      title="Check-outni tasdiqlash"
      maxWidth="max-w-md"
    >
      <L.div className="space-y-5">
        <L.p className="text-sm text-muted-foreground">
          Mehmonni chiqarib, xonani tozalash holatiga o‘tkazmoqchimisiz?
        </L.p>
        {booking && (
          <L.div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <L.div className="flex justify-between gap-4">
              <L.span className="text-muted-foreground">Mehmon</L.span>
              <L.span className="text-right font-medium">{booking.guest}</L.span>
            </L.div>
            <L.div className="flex justify-between gap-4">
              <L.span className="text-muted-foreground">Xona</L.span>
              <L.span className="text-right font-medium">{booking.room}</L.span>
            </L.div>
            <L.div className="flex justify-between gap-4">
              <L.span className="text-muted-foreground">Ketish sanasi</L.span>
              <L.span className="text-right font-medium">{booking.checkOut}</L.span>
            </L.div>
          </L.div>
        )}

        {error && <L.p role="alert" className="text-sm text-destructive">{error}</L.p>}

        <L.div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}><LocalizedText>
            Bekor qilish
          </LocalizedText></Button>
          <Button type="button" onClick={handleConfirm} disabled={!booking}>
            <LogOut className="h-4 w-4" /><LocalizedText>
            Check-out qilish
          </LocalizedText></Button>
        </L.div>
      </L.div>
    </Modal>
  );
}
