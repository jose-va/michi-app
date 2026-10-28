import AdminReservations from "@/common/components/pages/reservation/AdminReservations";
import SkeletonCards from "@/common/components/skeletons/SkeletonCards";
import {
  formatDayLabel,
  getTodayKey,
  resolveSelectedDateKey,
} from "@/common/utils/reservation-day";
import { UserService } from "@/service/UserService";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ReservationPreview({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const user = await UserService.getProfile();
  if (!user) redirect("/");

  if (user.role === "ROLE_ADMIN") {
    // Carga diferida tras la guarda: el navegador de días solo existe para administración (RF-10).
    const { default: ReservationDayNavigator } = await import(
      "@/common/components/ui/reservation/ReservationDayNavigator"
    );
    const params = await searchParams;
    const raw = Array.isArray(params?.date) ? params.date[0] : params?.date;
    const today = getTodayKey(new Date(), "Europe/Madrid");
    const selected = resolveSelectedDateKey(raw, today);
    return (
      <>
        <ReservationDayNavigator
          date={selected}
          today={today}
          label={formatDayLabel(selected)}
        />
        <Suspense fallback={<SkeletonCards />} key={selected}>
          <AdminReservations date={selected} />
        </Suspense>
      </>
    );
  }
  if (user.role === "ROLE_USER") redirect("/reservation");
  // Guarda final: sin rol contemplado no se renderiza nada; redirigir a la
  // raíz como sin sesión (RF-10: no administración no ve navegador ni listado).
  redirect("/");
}
