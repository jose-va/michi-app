"use client";

import type { Reservation } from "@/common/types/reservation.types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import ReservationCard from "./ReservationCard";
import { ReservationEmpty } from "./ReservationEmpty";

export default function ReservationShiftTabs({
  lunch,
  dinner,
}: {
  lunch: Reservation[];
  dinner: Reservation[];
}) {
  const activeLunchCount = lunch.filter((r) => r.state !== "CANCELLED").length;
  const activeDinnerCount = dinner.filter(
    (r) => r.state !== "CANCELLED"
  ).length;
  return (
    <Tabs defaultValue="comida" className="flex flex-col">
      <TabsList variant="line">
        <TabsTrigger value="comida">Comida ({activeLunchCount})</TabsTrigger>
        <TabsTrigger value="cena">Cena ({activeDinnerCount})</TabsTrigger>
      </TabsList>
      <TabsContent value="comida">
        {lunch.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lunch.map((reservation, index) => (
              <ReservationCard
                key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
                index={index}
                reservation={reservation}
              />
            ))}
          </div>
        ) : (
          <ReservationEmpty />
        )}
      </TabsContent>
      <TabsContent value="cena">
        {dinner.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dinner.map((reservation, index) => (
              <ReservationCard
                key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
                index={index}
                reservation={reservation}
              />
            ))}
          </div>
        ) : (
          <ReservationEmpty />
        )}
      </TabsContent>
    </Tabs>
  );
}
