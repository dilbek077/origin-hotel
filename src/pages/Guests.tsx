import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Search, UserPlus, Users, FileText } from "lucide-react";
import type { Guest } from "@/types/guest";
import { StorageService } from "@/services/storage";
import GuestModal from "@/components/guests/GuestModal";
import Modal from "@/components/common/Modal";
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

export default function Guests() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [viewGuest, setViewGuest] = useState<Guest | null>(null);

  const loadGuests = () => {
    setGuests(StorageService.getGuests());
  };

  useEffect(() => {
    loadGuests();
    const handleStorageChange = () => loadGuests();
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setModalOpen(true);
  };

  const handleSave = (guestData: Omit<Guest, "id"> | Guest) => {
    if ("id" in guestData) {
      StorageService.updateGuest(guestData as Guest);
    } else {
      StorageService.addGuest(guestData);
    }
    return true;
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('guests.deleteConfirm'))) {
      StorageService.deleteGuest(id);
    }
  };

  const filtered = guests.filter(
    (g) =>
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.passport.toLowerCase().includes(search.toLowerCase()) ||
      (g.notes && g.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 p-6 text-slate-100" : "min-h-screen bg-gray-50 p-6 text-gray-900"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.guests')}</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('guests.total').replace('{n}', String(guests.length))}
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {t('guests.new')}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder={t('guests.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={
            isDark
              ? "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 shadow-xs"
              : "w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 shadow-xs"
          }
        />
      </div>

      {/* Table */}
      <div className={isDark ? "bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden" : "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-slate-800/80 border-b border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider" : "bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider"}>
                <th className="text-left px-6 py-4">#</th>
                <th className="text-left px-6 py-4">{t('guests.name')}</th>
                <th className="text-left px-6 py-4">{t('common.phone')}</th>
                <th className="text-left px-6 py-4">{t('guests.passport')}</th>
                <th className="text-left px-6 py-4">{t('common.notes')}</th>
                <th className="text-left px-6 py-4">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-slate-500">
                    {t('rooms.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((guest, index) => (
                  <tr
                    key={guest.id}
                    className={isDark ? "hover:bg-slate-800/50 transition-colors group" : "hover:bg-blue-50/30 transition-colors group"}
                  >
                    <td className="px-6 py-4 text-gray-400 dark:text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-sky-300 font-bold text-sm">
                            {guest.fullName.charAt(0)}
                          </span>
                        </div>
                        <span className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}>{guest.fullName}</span>
                      </div>
                    </td>
                    <td className={isDark ? "px-6 py-4 text-slate-300 font-medium" : "px-6 py-4 text-gray-600 font-medium"}>
                      {guest.phone || <span className="text-gray-400 dark:text-slate-500 italic">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={isDark ? "font-mono text-sky-300 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold" : "font-mono text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold"}>
                        {guest.passport || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 max-w-[240px] truncate">
                      {guest.notes ? (
                        <span className={isDark ? "inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/50" : "inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100"}>
                          <FileText size={12} />
                          {guest.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewGuest(guest)}
                          title={t('common.view')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          title={t('common.edit')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/40 text-gray-400 hover:text-amber-600 transition cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          title={t('common.delete')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between ${isDark ? "border-slate-800 bg-slate-900/60" : "border-gray-100 bg-gray-50/50"}`}>
          <span className="text-xs text-gray-400 dark:text-slate-400 font-medium">
            {t('guests.total').replace('{n}', String(filtered.length))}
          </span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <GuestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingGuest}
      />

      {/* View Guest Modal */}
      {viewGuest && (
        <Modal
          isOpen={!!viewGuest}
          onClose={() => setViewGuest(null)}
          title={t('guests.detailsTitle')}
        >
          <div className="space-y-4">
            <div className={isDark ? "p-4 bg-slate-800/80 rounded-xl space-y-3 text-sm" : "p-4 bg-gray-50 rounded-xl space-y-3 text-sm"}>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('guests.name')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewGuest.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('common.phone')}:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{viewGuest.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('guests.passport')}:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-sky-400">{viewGuest.passport || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-400">{t('common.address')}:</span>
                <span className="font-medium text-gray-800 dark:text-slate-200">{viewGuest.address || "—"}</span>
              </div>
              <div className={`pt-2 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                <span className="block text-gray-400 dark:text-slate-400 mb-1">{t('common.notes')}:</span>
                <p className={isDark ? "text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-700 text-xs leading-relaxed" : "text-gray-800 bg-white p-3 rounded-lg border border-gray-200 text-xs leading-relaxed"}>
                  {viewGuest.notes || "—"}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewGuest(null)}
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
