// Sahifa yuklanayotganda ko'rsatiladigan spinner
export function PageLoading({ message = "Yuklanmoqda..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

// Route xatosi bo'lganda ko'rsatiladigan sahifa
export function RouteError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6">
      <div className="text-center max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl">
        <h1 className="text-3xl font-black text-red-500 mb-2">Xatolik / Error</h1>
        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6">
          Sahifani yuklashda xatolik yuz berdi. Iltimos, qayta yuklab ko‘ring.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-sm cursor-pointer"
        >
          Qayta yuklash
        </button>
      </div>
    </div>
  );
}
