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
    if (window.confirm("Haqiqatan ham bu mehmonni o‘chirmoqchimisiz?")) {
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
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{t('nav.guests')}</h1>
            <p className="text-sm text-gray-500">Jami {guests.length} ta mehmon ro‘yxatda</p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Yangi mehmon qo‘shish
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Ism, telefon, passport yoki izoh bo‘yicha..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  F.I.O
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Telefon
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Passport
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Izoh (Eslatma)
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Mehmon topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((guest, index) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">
                            {guest.fullName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">{guest.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {guest.phone || <span className="text-gray-400 italic">Mavjud emas</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {guest.passport || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[240px] truncate">
                      {guest.notes ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <FileText size={12} />
                          {guest.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Izoh yo‘q</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewGuest(guest)}
                          title="Ko‘rish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          title="Tahrirlash"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          title="O‘chirish"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
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
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Jami {filtered.length} ta mehmon ko‘rsatilmoqda
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
          title="Mehmon ma’lumotlari"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">F.I.O:</span>
                <span className="font-bold text-gray-900">{viewGuest.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefon:</span>
                <span className="font-semibold text-gray-800">{viewGuest.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pasport raqami:</span>
                <span className="font-mono font-bold text-blue-600">{viewGuest.passport || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Manzil:</span>
                <span className="font-medium text-gray-800">{viewGuest.address || "Ko‘rsatilmagan"}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="block text-gray-500 mb-1">Izoh / Maxsus eslatma:</span>
                <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-200 text-xs leading-relaxed">
                  {viewGuest.notes || "Izoh mavjud emas."}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewGuest(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
