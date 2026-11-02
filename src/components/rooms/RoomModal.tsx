import React, { useState, useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import type { Room, RoomStatus, RoomType } from "@/types/room";
import { useTranslation } from "@/i18n";

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

  const labelClass = "mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400";
  const inputClass = "w-full h-11 rounded-xl border border-slate-700 bg-[#0e1215] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none";
  const actionButtonClass = "rounded-xl border border-slate-700 bg-[#141b1f] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800";
  const submitButtonClass = "rounded-xl bg-[#dfe0e4] px-4 py-2.5 text-sm font-semibold text-[#101418] transition hover:bg-white";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('rooms.modalTitleEdit') : t('rooms.modalTitleAdd')}
      maxWidth="max-w-[620px]"
      variant="dark"
    >
      <div className="bg-[#11181d] px-5 pb-5 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
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
                  <option key={tItem} value={tItem} className="bg-[#111315] text-white">
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
                  <option key={s} value={s} className="bg-[#111315] text-white">
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
              <div className="relative overflow-hidden rounded-xl border border-slate-700">
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
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-[#0e1215] text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200">
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

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={actionButtonClass}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={submitButtonClass}>
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
