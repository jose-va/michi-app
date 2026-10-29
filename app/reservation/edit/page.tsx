import Link from "next/link";
import { Loader2Icon, Pencil } from "lucide-react";

import { Button } from "@/shadcn/components/button";
import {
  EDIT_INVALID_ID_MESSAGE,
  EDIT_NOT_MODIFIABLE_MESSAGE,
  isSaveBlockedByState,
  mapEditLoadError,
  parseEditId,
} from "@/common/utils/reservation-edit";
import { getReservationForEdit } from "@/lib/server-actions";
import type { GetReservationForEditResult } from "@/lib/server-actions";
import { UserService } from "@/service/UserService";
import { ReservationService } from "@/service/ReservationService";
import { EditReservationPage } from "@/common/components/pages/reservation/EditReservationPage";

export const metadata = {
  title: "Modificar reserva",
};

// Aviso en español que bloquea la modificación (RF-9, RF-12, RF-13, RF-22,
// RF-23): sin datos de la reserva, sin códigos y con carga no interactuable
// (sin botones ni formulario, solo el enlace de vuelta).
function EditBlockedNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-6 md:py-8">
      <section className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md">
        <div className="flex gap-4">
          <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <Pencil className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-white">Modificar su reserva</h1>
            <p role="alert" className="text-sm text-zinc-300">
              {message}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            className="bg-transparent text-white"
          >
            <Link href="/">Volver a la página principal</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// RF-8: indicador de carga en español con contenido no interactuable hasta
// disponer del formulario (el formulario precargado llega en T4-T7).
export function EditLoadingNotice() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-6 md:py-8">
      <section
        aria-busy="true"
        className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md"
      >
        <div className="flex gap-4">
          <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <Loader2Icon className="size-5 animate-spin" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-white">Modificar su reserva</h1>
            <p role="status" className="text-sm text-zinc-300">
              Cargando los datos de su reserva…
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function EditReservationRoute({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string | string[];
    date?: string;
    guests?: string;
    step?: string;
  }>;
}) {
  const params = await searchParams;

  // RF-22: id ausente/vacío/repetido/no válido → aviso sin pedir al backend.
  const parsed = parseEditId(params?.id);
  if (!parsed.ok) {
    return <EditBlockedNotice message={EDIT_INVALID_ID_MESSAGE} />;
  }

  // RF-23: sin sesión → aviso sin pedir al backend.
  const profile = await UserService.getProfile();
  if (!profile) {
    return <EditBlockedNotice message={mapEditLoadError("UNAUTHENTICATED")} />;
  }

  // RF-1 (+RF-13 con User-Id/User-Role y cookie reenviada en el servicio).
  // El JSX queda fuera del try/catch: React no captura errores de
  // renderizado con try/catch (se reserva a un error boundary).
  let result: GetReservationForEditResult | null = null;
  try {
    result = await getReservationForEdit(parsed.id);
  } catch {
    result = null;
  }
  // Fallo inesperado del servidor: aviso y bloqueo (RF-9).
  if (result === null) {
    return <EditBlockedNotice message={mapEditLoadError("NETWORK")} />;
  }
  // RF-12 (NOT_FOUND), RF-13 (FORBIDDEN), RF-9 (NETWORK): aviso y bloqueo.
  if (!result.ok) {
    return <EditBlockedNotice message={mapEditLoadError(result.kind)} />;
  }

  // RF-15: la reserva no CONFIRMED bloquea el guardado desde la carga, sin
  // formulario interactuable. Sin bloqueo de 2h aquí (RF-17): la cercanía
  // la decide el backend al guardar y el admin va exento allí.
  if (isSaveBlockedByState(result.reservation.state)) {
    return <EditBlockedNotice message={EDIT_NOT_MODIFIABLE_MESSAGE} />;
  }

  // Misma obtención de horas que la creación (RF-6): solo con día y
  // comensales del segundo paso; si no, lista vacía.
  const { date, guests, step } = params;
  const hours =
    step === "2" && date && guests
      ? await ReservationService.getAvailableHours(date, guests)
      : { insideHours: [], outsideHours: [] };

  const isAdmin = profile?.role === "ROLE_ADMIN";

  return (
    <EditReservationPage
      reservation={result.reservation}
      isAdmin={isAdmin}
      hours={hours}
    />
  );
}
