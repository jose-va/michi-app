import { Skeleton } from "@/shadcn/components/skeleton";
import CardSkeleton from "./CardSkeleton";

export default function SkeletonCards() {
  return (
    <div role="status" aria-label="Cargando productos">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((value, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      <div className="mt-10 mb-5 flex justify-center" aria-hidden="true">
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}
