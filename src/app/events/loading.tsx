
import { EventCardSkeleton } from "@/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
           <div className="h-9 w-48 bg-gray-200 animate-pulse rounded-md" />
           <div className="h-5 w-64 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-t-md" />
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-t-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
