import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import type { Guest } from "@/types/guest";
import { StorageService } from "@/services/storage";
import GuestModal from "@/components/guests/GuestModal";
import Modal from "@/components/common/Modal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function downloadGuestsCsv(guests: Guest[]) {
  const quote = (value: string | undefined) => `"${(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    ["Ism-familiya", "Telefon", "Pasport", "Manzil", "Oxirgi tashrif", "Izoh"],
    ...guests.map((guest) => [
      guest.fullName,
      guest.phone,
      guest.passport,
      guest.address ?? "",
      guest.lastVisit ?? "",
      guest.notes,
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "origin-hotel-mehmonlar.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function Guests() {
  const { t } = useTranslation();
  const [guests, setGuests] = useState<Guest[]>(() => StorageService.getGuests());
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [viewGuest, setViewGuest] = useState<Guest | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    ids: number[];
    description: string;
  } | null>(null);
  const [today] = useState(() => new Date());

  useEffect(() => {
    const handleStorageChange = () => setGuests(StorageService.getGuests());
    window.addEventListener("origin-hotel-storage-change", handleStorageChange);
    return () => window.removeEventListener("origin-hotel-storage-change", handleStorageChange);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return guests;
    return guests.filter((guest) =>
      [guest.fullName, guest.phone, guest.passport, guest.address, guest.notes]
        .some((value) => value?.toLocaleLowerCase().includes(query)),
    );
  }, [guests, search]);
  const selectedGuests = guests.filter((guest) => selectedIds.includes(guest.id));
  const allVisibleSelected = filtered.length > 0 && filtered.every((guest) => selectedIds.includes(guest.id));
  const passportCount = guests.filter((guest) => guest.passport.trim()).length;
  const phoneCount = guests.filter((guest) => guest.phone.trim()).length;
  const recentCount = guests.filter((guest) => {
    if (!guest.lastVisit) return false;
    const visit = new Date(`${guest.lastVisit}T00:00:00`);
    const age = today.getTime() - visit.getTime();
    return Number.isFinite(age) && age >= 0 && age <= 30 * DAY_IN_MS;
  }).length;

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
      return StorageService.updateGuest(guestData);
    }
    StorageService.addGuest(guestData);
    return true;
  };

  const toggleGuest = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  };

  const toggleAllVisible = () => {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        const visibleIds = new Set(filtered.map((guest) => guest.id));
        return current.filter((id) => !visibleIds.has(id));
      }
      return [...new Set([...current, ...filtered.map((guest) => guest.id)])];
    });
  };

  const handleDelete = (guest: Guest) => {
    setDeleteConfirmation({
      ids: [guest.id],
      description: `${guest.fullName} — ${t("guests.deleteConfirm")}`,
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedGuests.length) return;
    setDeleteConfirmation({
      ids: selectedGuests.map((guest) => guest.id),
      description: `${selectedGuests.length} ta mehmonni o‘chirishni tasdiqlaysizmi?`,
    });
  };

  const confirmDeleteGuests = () => {
    if (!deleteConfirmation) return;
    deleteConfirmation.ids.forEach((id) => StorageService.deleteGuest(id));
    setSelectedIds((current) =>
      current.filter((id) => !deleteConfirmation.ids.includes(id)),
    );
    setDeleteConfirmation(null);
  };

  const stats = [
    { label: "Jami mehmonlar", value: guests.length, detail: "Ro‘yxatdagi barcha mehmonlar", icon: Users, tone: "text-primary bg-primary/10" },
    { label: "So‘nggi tashriflar", value: recentCount, detail: "Oxirgi 30 kun ichida", icon: UserPlus, tone: "text-sky-600 bg-sky-500/10 dark:text-sky-400" },
    { label: "Aloqa ma’lumoti", value: phoneCount, detail: `${guests.length - phoneCount} ta telefon raqami kiritilmagan`, icon: Phone, tone: "text-blue-600 bg-blue-500/10 dark:text-blue-400" },
    { label: "Pasport ma’lumoti", value: passportCount, detail: `${guests.length - passportCount} ta ma’lumot kiritilmagan`, icon: ShieldCheck, tone: "text-indigo-600 bg-indigo-500/10 dark:text-indigo-400" },
  ];

  return (
    <main className="min-h-screen space-y-6 bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Origin Hotel
            </span>
            <span className="text-xs text-muted-foreground">/ {t("nav.guests")}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("nav.guests")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mehmonlar ro‘yxati va aloqa ma’lumotlarini boshqaring</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 self-start sm:self-auto">
          <UserPlus className="h-4 w-4" />
          {t("guests.new")}
        </Button>
      </header>

      <section aria-label="Mehmonlar statistikasi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon, tone }) => (
          <Card key={label} className="gap-4 border-border/70 py-5 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-5 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent className="px-5">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <CardTitle className="text-base">Barcha mehmonlar</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {search ? `${filtered.length} ta natija` : `${guests.length} ta mehmon`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("guests.searchPlaceholder")}
                className="pl-9"
                aria-label={t("guests.searchPlaceholder")}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-primary/25 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => downloadGuestsCsv(selectedGuests.length ? selectedGuests : filtered)}
              disabled={!filtered.length}
            >
              <Download className="h-4 w-4" />
              {selectedGuests.length ? "Tanlanganlarni eksport" : "CSV eksport"}
            </Button>
          </div>
        </CardHeader>

        <div className="divide-y divide-border/50 md:hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-muted-foreground">
              <Users className="h-8 w-8 opacity-50" />
              <p className="font-medium">{search ? t("rooms.notFound") : "Hozircha mehmonlar yo‘q"}</p>
              {!search && <p className="text-xs">Yangi mehmon qo‘shib ro‘yxatni boshlang.</p>}
            </div>
          ) : (
            filtered.map((guest) => {
              const selected = selectedIds.includes(guest.id);
              const initials = guest.fullName
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <article
                  key={guest.id}
                  className={`space-y-3 p-4 transition-colors ${selected ? "bg-primary/5" : "hover:bg-muted/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleGuest(guest.id)}
                      aria-label={`${guest.fullName}ni tanlash`}
                      className="mt-3 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                    />
                    <Avatar className="h-10 w-10 shrink-0 border border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{guest.fullName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{guest.address || "Manzil kiritilmagan"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => setViewGuest(guest)} aria-label={`${guest.fullName} — ko‘rish`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white" onClick={() => handleOpenEdit(guest)} aria-label={`${guest.fullName} — tahrirlash`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(guest)} aria-label={`${guest.fullName} — o‘chirish`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pl-7 text-xs">
                    <div className="min-w-0">
                      <p className="text-muted-foreground">{t("common.phone")}</p>
                      <p className="mt-1 truncate font-medium">{guest.phone || "—"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-muted-foreground">{t("guests.passport")}</p>
                      <p className="mt-1 truncate font-mono font-medium">{guest.passport || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Oxirgi tashrif</p>
                      <p className="mt-1 font-medium">{guest.lastVisit || "—"}</p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    aria-label="Ko‘rinib turgan barcha mehmonlarni tanlash"
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                </th>
                <th className="px-4 py-3">{t("guests.name")}</th>
                <th className="px-4 py-3">{t("common.phone")}</th>
                <th className="px-4 py-3">{t("guests.passport")}</th>
                <th className="px-4 py-3">Oxirgi tashrif</th>
                <th className="px-4 py-3">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-50" />
                      <p className="font-medium">{search ? t("rooms.notFound") : "Hozircha mehmonlar yo‘q"}</p>
                      {!search && <p className="text-xs">Yangi mehmon qo‘shib ro‘yxatni boshlang.</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((guest) => {
                  const selected = selectedIds.includes(guest.id);
                  return (
                    <tr
                      key={guest.id}
                      className={`border-b border-border/50 transition-colors last:border-0 hover:bg-muted/40 ${selected ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleGuest(guest.id)}
                          aria-label={`${guest.fullName}ni tanlash`}
                          className="h-4 w-4 cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex min-w-56 items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/10">
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {guest.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{guest.fullName}</p>
                            {guest.address && <p className="mt-0.5 max-w-52 truncate text-xs text-muted-foreground">{guest.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                        {guest.phone || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {guest.passport ? (
                          <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">{guest.passport}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                        {guest.lastVisit || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => setViewGuest(guest)} aria-label={`${guest.fullName} — ko‘rish`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white" onClick={() => handleOpenEdit(guest)} aria-label={`${guest.fullName} — tahrirlash`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(guest)} aria-label={`${guest.fullName} — o‘chirish`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-border/70 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-xs text-muted-foreground">
            {filtered.length} / {guests.length} mehmon ko‘rsatilmoqda
          </span>
          {selectedGuests.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium">{selectedGuests.length} ta tanlandi</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => downloadGuestsCsv(selectedGuests)}
              >
                <Download className="h-3.5 w-3.5" />
                Eksport
              </Button>
              <Button type="button" size="sm" variant="destructive" className="gap-1.5" onClick={handleDeleteSelected}>
                <Trash2 className="h-3.5 w-3.5" />
                O‘chirish
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                Bekor qilish
              </Button>
            </div>
          )}
        </footer>
      </Card>

      <GuestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingGuest}
      />
      <ConfirmActionModal
        isOpen={deleteConfirmation !== null}
        title={t("common.delete")}
        description={deleteConfirmation?.description ?? ""}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.delete")}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDeleteGuests}
      />

      {viewGuest && (
        <Modal isOpen onClose={() => setViewGuest(null)} title={t("guests.detailsTitle")}>
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl bg-muted/40 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("guests.name")}</span>
                <span className="text-right font-semibold">{viewGuest.fullName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("common.phone")}</span>
                <span className="text-right">{viewGuest.phone || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("guests.passport")}</span>
                <span className="font-mono">{viewGuest.passport || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("common.address")}</span>
                <span className="text-right">{viewGuest.address || "—"}</span>
              </div>
              <div className="border-t border-border pt-3">
                <span className="text-muted-foreground">{t("common.notes")}</span>
                <p className="mt-1 leading-relaxed">{viewGuest.notes || "—"}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewGuest(null)}>{t("common.close")}</Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
