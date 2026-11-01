import { Navigate, Outlet, useLocation } from "react-router-dom"

// Token bor-yo'qligini tekshiradi
export function AuthGuard() {
  const location = useLocation()
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

// Foydalanuvchi roli to'g'ri kelishini tekshiradi
export function RoleGuard({ allowedRoles }: { allowedRoles: string[] }) {
  const location = useLocation()
  const role = localStorage.getItem("role")?.toUpperCase() ?? ""

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
