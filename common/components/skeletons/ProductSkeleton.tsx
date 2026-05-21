import CardSkeleton from "./CardSkeleton";

export default function SkeletonCard() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((value, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
