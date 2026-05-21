import { Card, CardContent, CardHeader } from "@/shadcn/components/card";
import { Skeleton } from "@/shadcn/components/skeleton";

export default function CardSkeleton() {
  return (
    <Card className="mt-8 w-full max-w-xs">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}
