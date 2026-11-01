import { L } from '@/localization/elements';
import { Skeleton } from '@/components/ui/skeleton';

// Match the management page structure while its route bundle is loading.
export function PageLoading({ message = "Yuklanmoqda..." }: { message?: string }) {
  return <L.div className="w-full space-y-6 p-6" role="status" aria-busy="true">
    <L.p className="sr-only">{message}</L.p>
    <L.div aria-hidden="true" className="space-y-6">
      <L.div className="flex items-center justify-between gap-6">
        <L.div className="w-2/3 space-y-3"><Skeleton className="h-8 w-48 max-w-full" /><Skeleton className="h-3 w-72 max-w-full" /></L.div>
        <Skeleton className="h-10 w-28" />
      </L.div>
      <L.div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <L.div key={index} className="space-y-5 rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-3 w-2/3" /><Skeleton className="h-7 w-3/4" /><Skeleton className="h-2 w-1/2" />
        </L.div>)}
      </L.div>
      <L.div className="grid gap-5 lg:grid-cols-3">
        <L.div className="space-y-6 rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <L.div className="flex h-48 items-end gap-3 border-b border-border pt-6">
            {[45, 65, 50, 80, 60, 95, 75, 90].map((height, index) => <Skeleton key={index} className="flex-1 rounded-b-none" style={{ height: `${height}%` }} />)}
          </L.div>
        </L.div>
        <L.div className="space-y-6 rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 4 }, (_, index) => <L.div key={index} className="flex items-center gap-3"><Skeleton className="size-9 shrink-0 rounded-full" /><L.div className="w-full space-y-2"><Skeleton className="h-3 w-4/5" /><Skeleton className="h-2 w-1/2" /></L.div></L.div>)}
        </L.div>
      </L.div>
    </L.div>
  </L.div>;
}

// Route xatosi bo'lganda ko'rsatiladigan sahifa
export function RouteError() {
  return (
    <L.div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6">
      <L.div className="text-center max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl">
        <L.h1 className="text-3xl font-black text-red-500 mb-2">Xatolik / Error</L.h1>
        <L.p className="text-gray-600 dark:text-slate-300 text-sm mb-6">
          Sahifani yuklashda xatolik yuz berdi. Iltimos, qayta yuklab ko‘ring.
        </L.p>
        <L.button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-sm cursor-pointer"
        >
          Qayta yuklash
        </L.button>
      </L.div>
    </L.div>
  );
}
