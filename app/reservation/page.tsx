import { ReservationPage } from "@/common/components/pages/reservation/ReservationPage";
import { ReservationService } from "@/service/ReservationService";
import { bodoni, montserrat, playfair } from "../fonts/font";

export default async function ReservationDashboard({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; guests?: string; step?: string }>;
}) {
  const { date, guests, step } = await searchParams;

  const hours =
    step === "2" && date && guests
      ? await ReservationService.getAvailableHours(date, guests)
      : { insideHours: [], outsideHours: [] };

  return (
    <div  className="flex flex-col gap-4">
      <ReservationPage hours={hours} />

    </div>
  )
}
