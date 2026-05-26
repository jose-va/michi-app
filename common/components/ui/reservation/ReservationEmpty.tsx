import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shadcn/components/empty";
import { CalendarOff } from "lucide-react";


export function ReservationEmpty() {
  return (
    <Empty className="black-glassmorphism h-50 w-full md:w-100 my-5 mx-auto border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-transparent">
          <CalendarOff className="size-8"/>
        </EmptyMedia>
        <EmptyTitle>No hay reservas</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Todavía no se ha hecho ninguna reserva...
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}