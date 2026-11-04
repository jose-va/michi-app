"use client";

import { useState } from "react";
import Link from "next/link";
import { Reservation } from "@/common/types/reservation.types";
import { getCatAvatarUrl } from "@/common/utils/cat-avatar";
import { Badge } from "@/shadcn/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/card";
import { ReservationCancel } from "./ReservationCancel";
import { cn } from "@/lib/utils";
import { Phone, CalendarDays, Clock, Users } from "lucide-react";

export default function ReservationCard({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const dateLabel = new Date(`${reservation.date}T12:00:00`).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
    }
  );

  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <Card
        className={cn(
          "black-glassmorphism hover:shadow-4xl relative h-full rounded-lg border duration-500 hover:-translate-y-2 mt-2",
          reservation.state === "CANCELLED" && "opacity-60 grayscale"
        )}
      >
        <CardHeader>
          <p className="flex items-center gap-2 text-sm font-semibold text-white/90">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span className="text-michi-aqua font-semibold">{dateLabel}</span> · <Clock className="size-4" aria-hidden="true" /> {reservation.startTime}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              {!imageFailed && (
                <img
                  src={getCatAvatarUrl(`${reservation.name}-${index}`)}
                  alt={reservation.name}
                  className="size-12 rounded-full object-cover"
                  loading="lazy"
                  onError={() => setImageFailed(true)}
                />
              )}
              <CardTitle>{reservation.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 font-extralight">
          <div className="mb-4 flex items-center gap-2">
            <Badge>
              {reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}
            </Badge>
            <span className="flex items-center gap-1 text-white/90">
              <Users className="size-4" aria-hidden="true" />
              {reservation.guests}
            </span>
          </div>
          <span className="text-pretty flex text-white/90">
            {reservation.observations || "Sin observaciones"}
          </span>
        </CardContent>
        <CardFooter>
          {/* TODO: sustituye este href temporal por el enlace definitivo del teléfono */}
          <Link
            href={`tel:${reservation.phone}`}
            className="flex items-center gap-2 font-extralight hover:scale-101 text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone className="size-4" /> {reservation.phone}
          </Link>
        </CardFooter>
        {reservation.id && reservation.state !== "CANCELLED" && (
          <ReservationCancel id={reservation.id} name={reservation.name} date={reservation.date} startTime={reservation.startTime} triggerButtonClassName="absolute top-2 right-4" />
        )}
      </Card>
    </div>
  );
}
