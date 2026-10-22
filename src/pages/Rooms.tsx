import { useState, useEffect } from "react";
import { Plus, Search, BedDouble, Eye, Edit, Trash2, Users } from "lucide-react";
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
    let colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    if (status === "Bo'sh") {
      colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";
    } else if (status === "Band") {
      colorClass = "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";
    } else if (status === "Tozalashda") {
      colorClass = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
    } else if (status === "Ta'mirda") {
      colorClass = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30";
    }
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>{text}</span>;
  };

  const getTypeBadge = (type: string) => {
    const text = translateRoomType(type);
    let colorClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    if (type === "Deluxe") {
      colorClass = "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
    } else if (type === "Suite") {
      colorClass = "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
    } else if (type === "President") {
      colorClass = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
    }
    return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${colorClass}`}>{text}</span>;
  };

  const vacantCount = rooms.filter((r) => r.status === "Bo'sh").length;
  const occupiedCount = rooms.filter((r) => r.status === "Band").length;

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 p-6 text-slate-100" : "min-h-screen bg-gray-50 p-6 text-gray-900"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
            {t('nav.rooms')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {t('rooms.total').replace('{n}', String(rooms.length))} ({t('status.vacant')}: {vacantCount}, {t('status.occupied')}: {occupiedCount})
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          {t('rooms.new')}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder={t('rooms.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={
              isDark
                ? "w-full pl-9 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white shadow-xs"
                : "w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-700 shadow-xs"
            }
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={
            isDark
              ? "px-3 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white cursor-pointer shadow-xs"
              : "px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer shadow-xs"
          }
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className={isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
              {opt === "Barchasi" ? t('common.all') : translateStatus(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* Room Cards Grid */}
      {filtered.length === 0 ? (
        <div className={isDark ? "flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900 rounded-2xl border border-slate-800" : "flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100"}>
          <BedDouble size={48} className="mb-3 opacity-40" />
          <p className={isDark ? "text-base font-semibold text-slate-300" : "text-base font-semibold text-gray-700"}>{t('rooms.notFound')}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{t('rooms.notFoundDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((room) => (
            <div
              key={room.id}
              className={
                isDark
                  ? "bg-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-700 transition-all p-5 flex flex-col justify-between group"
                  : "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              }
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      <BedDouble size={22} />
                    </div>
                    <div>
                      <p className={isDark ? "text-xl font-black text-white leading-none" : "text-xl font-black text-gray-900 leading-none"}>
                        #{room.number}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">
                        {room.floor}-{t('common.floor')}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {getStatusBadge(room.status)}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 my-3">
                  {getTypeBadge(room.type)}
                  <span className={isDark ? "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300" : "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600"}>
                    <Users size={12} />
                    {room.capacity}
                  </span>
                </div>
              </div>

              <div>
                {/* Price */}
                <div className={`border-t pt-3 mb-4 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{t('common.perNight')}</p>
                  <p className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-gray-900"}>
                    {formatPrice(room.pricePerNight)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center gap-2 pt-2 border-t ${isDark ? "border-slate-800" : "border-gray-50"}`}>
                  <button
                    onClick={() => setViewRoom(room)}
                    title={t('common.view')}
                    className={
                      isDark
                        ? "flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-sky-400 bg-sky-950/40 hover:bg-sky-950/70 py-2 rounded-xl transition cursor-pointer"
                        : "flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-xl transition cursor-pointer"
                    }
                  >
                    <Eye size={14} />
                    {t('common.view')}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(room)}
                    title={t('common.edit')}
                    className={
                      isDark
                        ? "flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 py-2 rounded-xl transition cursor-pointer"
                        : "flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-2 rounded-xl transition cursor-pointer"
                    }
                  >
                    <Edit size={14} />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    title={t('common.delete')}
                    className={
                      isDark
                        ? "p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                        : "p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
