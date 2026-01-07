
import { AdminStatsSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <AdminStatsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
             ))}
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
