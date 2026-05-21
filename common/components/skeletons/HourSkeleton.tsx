import { Skeleton } from "@/shadcn/components/skeleton";

export default function HourSkeleton() {
  return (
    <div className="mt-3 grid grid-cols-5 place-items-center gap-3">
      {Array.from({ length: 10 }).map((value, index) => (
        <Skeleton key={index} className="h-6 w-15" />
      ))}
    </div>
  );
}
