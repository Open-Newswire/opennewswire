import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="rounded-md border">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b last:border-b-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-28 pt-4" />
      <div className="rounded-md border">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b last:border-b-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
