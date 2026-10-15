import { Navigate, Outlet } from "react-router-dom"

// Token bor-yo'qligini tekshiradi
export function AuthGuard() {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

// Foydalanuvchi roli to'g'ri kelishini tekshiradi
export function RoleGuard({ allowedRoles }: { allowedRoles: string[] }) {
  const role = localStorage.getItem("role")?.toUpperCase() ?? ""

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
