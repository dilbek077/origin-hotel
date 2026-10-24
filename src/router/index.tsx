import { Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { AuthGuard, RoleGuard } from "./guards"
import { RouteError, PageLoading } from "@/shared/ui"
import { lazyWithRetry } from "@/shared/lib"
import MainLayout from "@/layouts/MainLayout"
import LoginPage from "@/pages/authentication/LoginPage"
import LandingPage from "@/pages/LandingPage"

// Sahifani Suspense bilan o'rash
const withSuspense = (Component: React.LazyExoticComponent<any>, message?: string) => (
  <Suspense fallback={<PageLoading message={message} />}>
    <Component />
  </Suspense>
)

// ─── Lazy sahifalar ────────────────────────────────────────────────────────────

// Admin sahifalari
const AdminDashboardPage  = lazyWithRetry(() => import("@/pages/Dashboard"))
const AdminRoomsPage      = lazyWithRetry(() => import("@/pages/Rooms"))
const AdminGuestsPage     = lazyWithRetry(() => import("@/pages/Guests"))
const AdminBookingsPage   = lazyWithRetry(() => import("@/pages/Bookings"))
const AdminFinancePage    = lazyWithRetry(() => import("@/pages/Finance"))
const AdminReportsPage    = lazyWithRetry(() => import("@/pages/Reports"))
const AdminSettingsPage   = lazyWithRetry(() => import("@/pages/Settings"))

// Xodim sahifalari (Staff — cheklangan ruxsat)
const StaffDashboardPage  = lazyWithRetry(() => import("@/pages/Dashboard"))
const StaffRoomsPage      = lazyWithRetry(() => import("@/pages/Rooms"))
const StaffGuestsPage     = lazyWithRetry(() => import("@/pages/Guests"))
const StaffBookingsPage   = lazyWithRetry(() => import("@/pages/Bookings"))

// ─── Router ────────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Asosiy Landing sahifa
  {
    path: "/",
    errorElement: <RouteError />,
    element: <LandingPage />,
  },

  // Auth (login) sahifasi
  {
    errorElement: <RouteError />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  // Himoyalangan sahifalar (token bo'lishi shart)
  {
    element: <AuthGuard />,
    errorElement: <RouteError />,
    children: [
      {
        // Admin — barcha sahifalarga ruxsat
        element: <RoleGuard allowedRoles={["ADMIN"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/admin",
                element: withSuspense(AdminDashboardPage, "Dashboard yuklanmoqda..."),
              },
              {
                path: "/admin/xonalar",
                element: withSuspense(AdminRoomsPage, "Xonalar yuklanmoqda..."),
              },
              {
                path: "/admin/mehmonlar",
                element: withSuspense(AdminGuestsPage, "Mehmonlar yuklanmoqda..."),
              },
              {
                path: "/admin/bronlar",
                element: withSuspense(AdminBookingsPage, "Bronlar yuklanmoqda..."),
              },
              {
                path: "/admin/bronlar/kelish-ketish",
                element: withSuspense(AdminBookingsPage, "Kelish-ketish ro‘yxati yuklanmoqda..."),
              },
              {
                path: "/admin/moliya",
                element: withSuspense(AdminFinancePage, "Moliya yuklanmoqda..."),
              },
              {
                path: "/admin/hisobotlar",
                element: withSuspense(AdminReportsPage, "Hisobotlar yuklanmoqda..."),
              },
              {
                path: "/admin/sozlamalar",
                element: withSuspense(AdminSettingsPage, "Sozlamalar yuklanmoqda..."),
              },
              {
                path: "/admin/sozlamalar/:tab",
                element: withSuspense(AdminSettingsPage, "Sozlamalar yuklanmoqda..."),
              },
            ],
          },
        ],
      },

      // Xodim (Staff) — cheklangan sahifalar
      {
        element: <RoleGuard allowedRoles={["STAFF"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/staff",
                element: withSuspense(StaffDashboardPage, "Dashboard yuklanmoqda..."),
              },
              {
                path: "/staff/xonalar",
                element: withSuspense(StaffRoomsPage, "Xonalar yuklanmoqda..."),
              },
              {
                path: "/staff/mehmonlar",
                element: withSuspense(StaffGuestsPage, "Mehmonlar yuklanmoqda..."),
              },
              {
                path: "/staff/bronlar",
                element: withSuspense(StaffBookingsPage, "Bronlar yuklanmoqda..."),
              },
              {
                path: "/staff/bronlar/kelish-ketish",
                element: withSuspense(StaffBookingsPage, "Kelish-ketish ro‘yxati yuklanmoqda..."),
              },
            ],
          },
        ],
      },
    ],
  },

  // Noma'lum sahifalardan loginga qaytarish
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])

export default router
