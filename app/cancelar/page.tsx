import { CancelReservationPage } from "@/common/components/pages/reservation/CancelReservationPage";

export const metadata = {
  title: "Cancelar reserva",
  referrer: "no-referrer" as const,
};

export default async function CancelarPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <CancelReservationPage reservationId={id ?? ""} token={token} />
    </div>
  );
}
