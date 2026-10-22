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
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Mehmonni chiqarib, xonani tozalash holatiga o‘tkazmoqchimisiz?
        </p>
        {booking && (
          <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mehmon</span>
              <span className="text-right font-medium">{booking.guest}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Xona</span>
              <span className="text-right font-medium">{booking.room}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Ketish sanasi</span>
              <span className="text-right font-medium">{booking.checkOut}</span>
            </div>
          </div>
        )}

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!booking}>
            <LogOut className="h-4 w-4" />
            Check-out qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
}
