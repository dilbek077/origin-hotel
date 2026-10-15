// Sahifa yuklanayotganda ko'rsatiladigan spinner
export function PageLoading({ message = "Yuklanmoqda..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  )
}

// Route xatosi bo'lganda ko'rsatiladigan sahifa
export function RouteError() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-2">Xato!</h1>
        <p className="text-gray-600">Sahifani yuklab bo'lmadi. Iltimos, qayta urinib ko'ring.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Qayta yuklash
        </button>
      </div>
    </div>
  )
}
