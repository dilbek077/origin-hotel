import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Banknote,
  BarChart3,
  Settings,
  UserCog,
  User,
  Palette,
  Bell,
  Monitor,
  // Staff uchun ham shu iconlar ishlatiladi
} from "lucide-react"

// ─── Menyu turlari ─────────────────────────────────────────────────────────────

export interface SidebarSubItem {
  title: string
  path: string
  icon: React.ElementType
}

export interface SidebarItem {
  title: string
  path: string
  icon: React.ElementType
  section?: string
  children?: SidebarSubItem[]
}

export interface SidebarMenu {
  ADMIN: SidebarItem[]
  STAFF: SidebarItem[]
  [key: string]: SidebarItem[]
}

// ─── Menyu konfiguratsiyasi ────────────────────────────────────────────────────

export const SIDEBAR_MENU: SidebarMenu = {
  // 1. Admin — barcha modullar
  ADMIN: [
    { title: "Dashboard",    path: "/admin",            icon: LayoutDashboard },
    { title: "Xonalar",      path: "/admin/xonalar",    icon: BedDouble       },
    { title: "Mehmonlar",    path: "/admin/mehmonlar",  icon: Users           },
    { title: "Bronlar",      path: "/admin/bronlar",    icon: CalendarCheck   },
    { title: "Moliya",       path: "/admin/moliya",     icon: Banknote        },
    { title: "Hisobotlar",   path: "/admin/hisobotlar", icon: BarChart3       },
    {
      title: "Sozlamalar",
      path: "/admin/sozlamalar",
      icon: Settings,
      section: "Tizim",
      children: [
        { title: "Profil",            path: "/admin/sozlamalar/profil",            icon: UserCog },
        { title: "Hisob",             path: "/admin/sozlamalar/hisob",             icon: User    },
        { title: "Ko'rinish",         path: "/admin/sozlamalar/korinish",          icon: Palette },
        { title: "Bildirishnomalar",  path: "/admin/sozlamalar/bildirishnomalar",  icon: Bell    },
        { title: "Ekran",             path: "/admin/sozlamalar/ekran",             icon: Monitor },
      ],
    },
  ],

  // 2. Xodim (Staff) — faqat asosiy modullar (moliya va hisobot yo'q)
  STAFF: [
    { title: "Dashboard",  path: "/staff",           icon: LayoutDashboard },
    { title: "Xonalar",    path: "/staff/xonalar",   icon: BedDouble       },
    { title: "Mehmonlar",  path: "/staff/mehmonlar", icon: Users           },
    { title: "Bronlar",    path: "/staff/bronlar",   icon: CalendarCheck   },
  ],
}

// Kichik/katta harfda kelsa ham ishlaydi
SIDEBAR_MENU.admin = SIDEBAR_MENU.ADMIN
SIDEBAR_MENU.staff = SIDEBAR_MENU.STAFF

// ─── Helper funksiya ───────────────────────────────────────────────────────────

export const getSidebarMenu = (role?: string | null): SidebarItem[] => {
  if (!role) return SIDEBAR_MENU.ADMIN
  const normalized = String(role).trim().toUpperCase()
  return SIDEBAR_MENU[normalized] ?? SIDEBAR_MENU.ADMIN
}
