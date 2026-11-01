import { L } from '@/localization/elements';
import { LocalizedText } from '@/localization/Text';
import { AlertTriangle } from "lucide-react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmActionModal({
  isOpen,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <L.div className="space-y-5">
        <L.div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <L.p className="text-sm leading-6 text-foreground">{description}</L.p>
        </L.div>
        <L.div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="min-w-24"
            onClick={onClose}
          >
            <LocalizedText>{cancelLabel}</LocalizedText>
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="min-w-24"
            onClick={onConfirm}
          >
            <LocalizedText>{confirmLabel}</LocalizedText>
          </Button>
        </L.div>
      </L.div>
    </Modal>
  );
}
