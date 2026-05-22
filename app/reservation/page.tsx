import { ReservationPage } from "@/common/components/pages/ReservationPage";
import { ReservationService } from "@/service/ReservationService";

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

  return <ReservationPage hours={hours} />;
}
