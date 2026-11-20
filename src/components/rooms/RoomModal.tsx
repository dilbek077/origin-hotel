import React, { useState, useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import type { Room, RoomStatus, RoomType } from "@/types/room";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/theme";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: Omit<Room, "id"> | Room) => { success: boolean; error?: string };
  initialData?: Room | null;
}

const ROOM_TYPES: RoomType[] = ["Standart", "Deluxe", "Suite", "President"];
const ROOM_STATUSES: RoomStatus[] = ["Bo'sh", "Band", "Tozalashda", "Ta'mirda"];

export default function RoomModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: RoomModalProps) {
  const { t, translateStatus, translateRoomType } = useTranslation();
  const { isDark } = useTheme();
  const [number, setNumber] = useState("");
  const [type, setType] = useState<RoomType>("Standart");
  const [pricePerNight, setPricePerNight] = useState<number>(350000);
  const [capacity, setCapacity] = useState("2 kishilik");
  const [status, setStatus] = useState<RoomStatus>("Bo'sh");
  const [floor, setFloor] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNumber(initialData.number);
      setType(initialData.type);
      setPricePerNight(initialData.pricePerNight);
      setCapacity(initialData.capacity);
      setStatus(initialData.status);
      setFloor(initialData.floor);
      setImageUrl(initialData.imageUrl);
    } else {
      setNumber("");
      setType("Standart");
      setPricePerNight(350000);
      setCapacity("2 kishilik");
      setStatus("Bo'sh");
      setFloor(1);
      setImageUrl(undefined);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Iltimos, rasm faylini tanlang.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Rasm hajmi 8 MB dan oshmasligi kerak.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Rasmni o‘qib bo‘lmadi. Boshqa faylni tanlang.");
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Rasmni o‘qib bo‘lmadi. Boshqa faylni tanlang.");
        return;
      }

      const sourceImage = new Image();
      sourceImage.onerror = () => setError("Rasmni ochib bo‘lmadi. Boshqa faylni tanlang.");
      sourceImage.onload = () => {
        try {
          const scale = Math.min(1, 900 / sourceImage.width, 600 / sourceImage.height);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(sourceImage.width * scale));
          canvas.height = Math.max(1, Math.round(sourceImage.height * scale));
          const context = canvas.getContext("2d");
          if (!context) {
            setError("Rasmni tayyorlab bo‘lmadi. Boshqa faylni tanlang.");
            return;
          }

          let compressedImage = "";
          while (Math.max(canvas.width, canvas.height) >= 320) {
            context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
            for (const quality of [0.72, 0.6, 0.48]) {
              compressedImage = canvas.toDataURL("image/jpeg", quality);
              if (compressedImage.length <= 160_000) break;
            }
            if (compressedImage.length <= 160_000) break;
            canvas.width = Math.round(canvas.width * 0.8);
            canvas.height = Math.round(canvas.height * 0.8);
          }
          if (!compressedImage || compressedImage.length > 160_000) {
            setError("Rasmni yetarlicha kichraytirib bo‘lmadi. Boshqa rasm tanlang.");
            return;
          }

          setImageUrl(compressedImage);
          setError(null);
        } catch {
          setError("Rasmni tayyorlab bo‘lmadi. Boshqa faylni tanlang.");
        }
      };
      sourceImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!number.trim()) {
      setError(t('rooms.number') + " !");
      return;
    }
    if (pricePerNight <= 0) {
      setError("Price > 0 !");
      return;
    }

    const payload = initialData
      ? {
          ...initialData,
          number: number.trim(),
          type,
          pricePerNight: Number(pricePerNight),
          capacity: capacity.trim() || "1 kishilik",
          status,
          floor: Number(floor) || 1,
          imageUrl,
        }
      : {
          number: number.trim(),
          type,
          pricePerNight: Number(pricePerNight),
          capacity: capacity.trim() || "1 kishilik",
          status,
          floor: Number(floor) || 1,
          imageUrl,
        };

    let res;
    try {
      res = onSave(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Xonani saqlashda xatolik yuz berdi.");
      return;
    }
    if (!res.success) {
      setError(res.error || "Xatolik yuz berdi");
    } else {
      onClose();
    }
  };

  const labelClass = `mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] ${isDark ? "text-slate-400" : "text-slate-500"}`;
  const inputClass = `w-full h-11 rounded-xl border px-3.5 text-sm focus:outline-none ${isDark ? "border-slate-700 bg-[#0e1215] text-white placeholder:text-slate-500 focus:border-slate-500" : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400"}`;
  const actionButtonClass = `rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isDark ? "border-slate-700 bg-[#141b1f] text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`;

  const form = (
      <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`rounded-xl border px-3 py-2 text-xs font-medium ${isDark ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-red-300 bg-red-50 text-red-700"}`}>
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.number')}</label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="101"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t('rooms.floor')}</label>
              <input
                type="number"
                min={1}
                max={20}
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.type')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className={inputClass}
              >
                {ROOM_TYPES.map((tItem) => (
                  <option key={tItem} value={tItem} className={isDark ? "bg-[#111315] text-white" : "bg-white text-slate-900"}>
                    {translateRoomType(tItem)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('common.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
                className={inputClass}
              >
                {ROOM_STATUSES.map((s) => (
                  <option key={s} value={s} className={isDark ? "bg-[#111315] text-white" : "bg-white text-slate-900"}>
                    {translateStatus(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t('rooms.capacity')}</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="2 kishilik"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t('rooms.price')}</label>
              <input
                type="number"
                min={1000}
                step={1}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Xona rasmi</label>
            {imageUrl ? (
              <div className={`relative overflow-hidden rounded-xl border ${isDark ? "border-slate-700" : "border-slate-300"}`}>
                <img src={imageUrl} alt="Xona rasmi" className="h-48 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/70 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
                >
                  <Trash2 size={14} />
                  Rasmni olib tashlash
                </button>
              </div>
            ) : (
              <label className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition ${isDark ? "border-slate-700 bg-[#0e1215] text-slate-400 hover:border-slate-500 hover:text-slate-200" : "border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400 hover:text-slate-700"}`}>
                <ImagePlus size={22} />
                <span>Rasm tanlash (8 MB gacha)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <button type="button" onClick={onClose} className={actionButtonClass}>
              {t('common.cancel')}
            </button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
  );

  if (initialData) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent
            side="right"
            className={`h-full w-full overflow-y-auto border-l p-6 sm:max-w-[620px] ${isDark ? "border-slate-800 bg-[#090d10] text-white" : "border-slate-200 bg-white text-slate-900"}`}
          >
            <SheetHeader className="mb-2 p-0 pr-10">
              <SheetTitle className={`text-xl ${isDark ? "text-white" : "text-slate-900"}`}>
                {t('rooms.modalTitleEdit')}
              </SheetTitle>
            </SheetHeader>
            {form}
          </SheetContent>
        </Sheet>
    );
  }

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('rooms.modalTitleAdd')}
        maxWidth="max-w-[620px]"
        variant="dark"
    >
        {form}
    </Modal>
  );
}
