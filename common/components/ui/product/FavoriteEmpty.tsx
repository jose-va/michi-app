import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shadcn/components/empty";
import { Star } from "lucide-react";


export function FavoriteEmpty() {
  return (
    <Empty className="black-glassmorphism h-50 w-full md:w-100 my-5 mx-auto border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-transparent">
          <Star className="size-8"/>
        </EmptyMedia>
        <EmptyTitle>No hay favoritos</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Todavía no ha agregado ningún producto a su listado de favoritos
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}