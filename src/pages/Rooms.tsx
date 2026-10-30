import { useState, useEffect } from "react";
import { Plus, Search, BedDouble, Eye, Edit, Trash2 } from "lucide-react";
import type { Room, RoomStatus } from "@/types/room";
import { StorageService } from "@/services/storage";
import RoomModal from "@/components/rooms/RoomModal";
import Modal from "@/components/common/Modal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

const STATUS_OPTIONS = ["Barchasi", "Bo'sh", "Band", "Tozalashda", "Ta'mirda"] as const;

export default function Rooms() {
  const { isDark } = useTheme();
  const { t, locale, translateStatus, translateRoomType } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Barchasi");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewRoom, setViewRoom] = useState<Room | null>(null);
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);

  const loadRooms = () => {
    setRooms(StorageService.getRooms());
  };

  useEffect(() => {
    loadRooms();
    const handleStorageChange = () => loadRooms();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const handleSave = (roomData: Omit<Room, "id"> | Room) => {
    if ("id" in roomData) {
      return StorageService.updateRoom(roomData as Room);
    } else {
      return StorageService.addRoom(roomData);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteRoomId(id);
  };

  const confirmDeleteRoom = () => {
    if (deleteRoomId === null) return;
    StorageService.deleteRoom(deleteRoomId);
    setDeleteRoomId(null);
  };

  const formatPrice = (amount: number): string => {
    return amount.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'en-US') + ' ' + t('common.currency');
  };

  const filtered = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Barchasi" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RoomStatus) => {
    const text = translateStatus(status);
    let colorClass = isDark
      ? "border border-slate-700 bg-slate-800/80 text-slate-200"
      : "border border-slate-200 bg-slate-100 text-slate-700";
    if (status === "Bo'sh") {
      colorClass = isDark
        ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
        : "border border-emerald-200 bg-emerald-50 text-emerald-700";
    } else if (status === "Band") {
      colorClass = isDark
        ? "border border-red-500/30 bg-red-500/15 text-red-300"
        : "border border-red-200 bg-red-50 text-red-700";
    } else if (status === "Tozalashda") {
      colorClass = isDark
        ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
        : "border border-amber-200 bg-amber-50 text-amber-700";
    } else if (status === "Ta'mirda") {
      colorClass = isDark
        ? "border border-violet-500/30 bg-violet-500/15 text-violet-300"
        : "border border-violet-200 bg-violet-50 text-violet-700";
    }
    return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${colorClass}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{text}</span>;
  };

  const getTypeBadge = (type: string) => {
    const text = translateRoomType(type);
    let colorClass = isDark
      ? "border border-slate-700 bg-slate-800/80 text-slate-200"
      : "border border-slate-200 bg-slate-100 text-slate-700";
    if (type === "Deluxe") {
      colorClass = isDark
        ? "border border-violet-500/30 bg-violet-500/10 text-violet-200"
        : "border border-violet-200 bg-violet-50 text-violet-700";
    } else if (type === "Suite") {
      colorClass = isDark
        ? "border border-sky-500/30 bg-sky-500/10 text-sky-200"
        : "border border-sky-200 bg-sky-50 text-sky-700";
    } else if (type === "President") {
      colorClass = isDark
        ? "border border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border border-amber-200 bg-amber-50 text-amber-700";
    }
    return <span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium ${colorClass}`}>{text}</span>;
  };

  const vacantCount = rooms.filter((r) => r.status === "Bo'sh").length;
  const occupiedCount = rooms.filter((r) => r.status === "Band").length;

  const pageShell = isDark
    ? "min-h-screen bg-[#05080b] p-6 text-slate-100"
    : "min-h-screen bg-slate-100 p-6 text-slate-800";
  const panelShell = isDark
    ? "mx-auto max-w-[1400px] rounded-[26px] border border-[#1c252d] bg-[#0a0f13] shadow-[0_30px_80px_rgba(2,6,23,0.7)]"
    : "mx-auto max-w-[1400px] rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]";
  const headerBorder = isDark ? "border-[#1c252d]" : "border-slate-200";
  const fieldShell = isDark
    ? "border-[#1c252d] bg-[#0b1015] text-slate-100 placeholder:text-slate-500 focus:border-slate-500"
    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-slate-300";
  const statShell = isDark
    ? "border-[#1c252d] bg-[#0b1015] text-slate-400"
    : "border-slate-200 bg-slate-50 text-slate-600";
  const panelInner = isDark
    ? "border-[#1c252d] bg-[#0d1419] shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]"
    : "border-slate-200 bg-slate-50 shadow-[inset_0_1px_0_rgba(148,163,184,0.12)]";

  return (
    <div className={pageShell}>
      <div className={panelShell}>
        <div className={`mb-0 flex items-center justify-between gap-4 border-b px-6 py-5 ${headerBorder}`}>
          <div>
            <h1 className={`text-[2.1rem] font-bold tracking-[-0.04em] ${isDark ? "text-white" : "text-slate-900"}`}>Xonalar</h1>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Qavatlar, narxlar va xonalar holatini bir joyda boshqaring.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className={isDark
              ? "inline-flex items-center gap-2 rounded-xl border border-[#1c252d] bg-[#10171d] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-[#121d26]"
              : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-200"}
          >
            <Plus size={16} />
            Xona qo‘shish
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className={`rounded-[18px] border p-4 ${panelInner}`}>
            <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr]">
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder={t('rooms.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${fieldShell}`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-xl border px-3 py-3 text-sm outline-none ${fieldShell}`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-white">
                    {opt === "Barchasi" ? t('common.all') : translateStatus(opt)}
                  </option>
                ))}
              </select>

              <div className={`rounded-xl border px-3 py-3 text-sm ${statShell}`}>
                {vacantCount} ta bo‘sh
              </div>

              <div className={`rounded-xl border px-3 py-3 text-sm ${statShell}`}>
                {occupiedCount} ta band
              </div>

              <div className={`rounded-xl border px-3 py-3 text-sm ${statShell}`}>
                {rooms.length} ta jami
              </div>
            </div>
          </div>

          <div className={`mt-5 rounded-[18px] border p-4 ${panelInner}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                O‘chirib bo‘lishi mumkin: <span className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{filtered.length} ta xona</span>
              </p>
              <div className={`flex gap-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span className={isDark ? "rounded-full border border-[#1c252d] bg-[#0d1419] px-2.5 py-1 text-slate-200" : "rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700"}>Barchasi</span>
                <span className={isDark ? "rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-emerald-300" : "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700"}>Bo‘sh</span>
                <span className={isDark ? "rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-300" : "rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700"}>Band</span>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={`mt-6 flex flex-col items-center justify-center rounded-[18px] border border-dashed py-16 text-center ${isDark ? "border-[#1c252d] bg-[#0d1419]" : "border-slate-200 bg-white"}`}>
              <BedDouble size={46} className={`mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <p className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{t('rooms.notFound')}</p>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t('rooms.notFoundDesc')}</p>
            </div>
          ) : (
            <div className={`mt-6 overflow-hidden rounded-[18px] border ${isDark ? "border-[#1c252d] bg-[#0a0f13]" : "border-slate-200 bg-white"}`}>
              <div className={`grid grid-cols-[1.4fr_1fr_1fr_1.1fr_1.2fr_1fr] border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] ${isDark ? "border-[#1c252d] bg-[#0d1419] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                <span>Xona</span>
                <span>Qavat</span>
                <span>Tur</span>
                <span>Mehmon</span>
                <span>Narx</span>
                <span>Holat</span>
              </div>

              {filtered.map((room) => (
                <div
                  key={room.id}
                  className={`grid grid-cols-[1.4fr_1fr_1fr_1.1fr_1.2fr_1fr] items-center border-b px-4 py-4 text-sm last:border-b-0 ${isDark ? "border-[#1b2430] text-slate-200 hover:bg-[#0f171d]" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>#{room.number}</span>
                    <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{room.type}</span>
                  </div>

                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{room.floor} qavat</span>

                  <div>{getTypeBadge(room.type)}</div>

                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{room.capacity} kishi</span>

                  <span className={`font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{formatPrice(room.pricePerNight)}</span>

                  <div className="flex items-center justify-between gap-2">
                    {getStatusBadge(room.status)}
                    <div className={`flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      <button onClick={() => setViewRoom(room)} className={isDark ? "hover:text-sky-300" : "hover:text-sky-600"} aria-label={t('common.view')}>
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleOpenEdit(room)} className={isDark ? "hover:text-amber-300" : "hover:text-amber-600"} aria-label={t('common.edit')}>
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className={isDark ? "hover:text-red-300" : "hover:text-red-600"} aria-label={t('common.delete')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingRoom}
      />
      <ConfirmActionModal
        isOpen={deleteRoomId !== null}
        title={t('common.delete')}
        description={t('rooms.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.delete')}
        onClose={() => setDeleteRoomId(null)}
        onConfirm={confirmDeleteRoom}
      />

      {/* View Details Modal */}
      {viewRoom && (
        <Modal
          isOpen={!!viewRoom}
          onClose={() => setViewRoom(null)}
          title={`${t('rooms.detailsTitle')} #${viewRoom.number}`}
        >
          <div className="space-y-4">
            <div className={isDark ? "p-4 bg-slate-800/80 rounded-xl space-y-2.5 text-sm" : "p-4 bg-gray-50 rounded-xl space-y-2.5 text-sm"}>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('rooms.number')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">#{viewRoom.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('rooms.type')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{translateRoomType(viewRoom.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('rooms.floor')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{viewRoom.floor}-{t('common.floor')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('rooms.capacity')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{viewRoom.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('common.status')}:</span>
                {getStatusBadge(viewRoom.status)}
              </div>
              <div className={`flex justify-between pt-2 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                <span className="text-gray-400 dark:text-slate-400">{t('common.perNight')}:</span>
                <span className="font-bold text-blue-600 dark:text-sky-400 text-base">{formatPrice(viewRoom.pricePerNight)}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewRoom(null)}
                className={
                  isDark
                    ? "px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition cursor-pointer"
                    : "px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
                }
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
