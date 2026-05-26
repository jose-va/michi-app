import { Reservation } from "@/common/types/reservation.types";
import { Badge } from "@/shadcn/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/card";
import { Phone } from "lucide-react";

export default function ReservationCard({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <Card className="black-glassmorphism hover:shadow-4xl mt-6 h-full rounded-lg border duration-500 hover:-translate-y-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {reservation.name} - {reservation.startTime}
            </CardTitle>
            <Badge>
              {reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}
            </Badge>
          </div>
          <CardDescription>
            <span className="font-extralight">{reservation.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 font-extralight">
          <span className="text-pretty">{reservation.observations}</span>
        </CardContent>
        <CardFooter>
          <span className="flex items-center gap-2 font-light">
            <Phone className="size-4" /> {reservation.phone}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
