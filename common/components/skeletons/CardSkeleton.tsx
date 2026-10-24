import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/components/card";
import { Skeleton } from "@/shadcn/components/skeleton";

export default function CardSkeleton() {
  return (
    <Card className="black-glassmorphism mt-6 h-full w-full pt-0" aria-hidden="true">
      <div className="overflow-hidden rounded-t-lg">
        <Skeleton className="h-44 w-full rounded-none" />
      </div>
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-6 w-1/3" />
      </CardFooter>
    </Card>
  );
}
