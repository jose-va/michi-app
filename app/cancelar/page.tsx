import { CancelReservationPage } from "@/common/components/pages/reservation/CancelReservationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancelar reserva | Panel",
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
  },
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
