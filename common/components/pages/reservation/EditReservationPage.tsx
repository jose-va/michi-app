"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, Loader2Icon, Pencil } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

import { Form } from "@/shadcn/components/form";
import { Button } from "@/shadcn/components/button";
import {
  formSchema,
  ReservationFormValues,
} from "@/common/types/reservation-form.types";
import type { Reservation } from "@/common/types/reservation.types";
import type { Hours } from "@/common/types/hour.types";
import DateForm from "@/common/components/forms/reservation/DateForm";
import AvailabilityForm from "@/common/components/forms/reservation/AvailabilityForm";
import { updateReservation } from "@/lib/server-actions";
import { useUser } from "../../provider/UserProvider";
import {
  buildEditInitialValues,
  EDIT_NOT_MODIFIABLE_MESSAGE,
  EDIT_SUCCESS_TOAST_MESSAGE,
  isEditHourStillAvailable,
  isSaveBlockedByState,
  mapUpdateError,
  resolveUpdateErrorMessage,
  type UpdateErrorStatus,
} from "@/common/utils/reservation-edit";

// El local cierra los domingos: si hoy es domingo, se propone el lunes
// (igual que en la creación; solo se usa cuando la reserva no trae día).
const getDefaultDate = () => {
  const today = new Date();
  return today.getDay() === 0 ? addDays(today, 1) : today;
};

const STEP_COPY = {
  "1": {
    title: "Modificar su reserva",
    description: "Seleccione la fecha y número de comensales",
  },
  "2": {
    title: "Ver disponibilidad",
    description: "Seleccione una de las horas disponibles",
  },
} as const;

// RF-27: mismo panel lateral que la creación (imagen, rótulo y repliegue).
const SIDE_IMAGE_SRC = "/images/Foto sushi.webp";
const SIDE_IMAGE_ALT = "Plato de sushi de Michi Sushi Granada";

// RF-2/RF-3/RF-4/RF-21/RF-24: valores iniciales desde la reserva (día,
// comensales, teléfono, observaciones) y desde la persona usuaria actual —o
// desde el propietario si un admin edita una reserva ajena— sin reglas
// propias: la validación (`formSchema`) y las horas son las de la creación.
export function EditReservationPage({
  reservation,
  isAdmin,
  hours,
}: {
  reservation: Reservation;
  isAdmin: boolean;
  hours: Hours;
}) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // RF-15: la reserva no CONFIRMED bloquea el guardado desde la carga, sin
  // formulario interactuable. Sin bloqueo de 2h en el cliente (RF-17): la
  // cercanía la decide el backend al guardar y el admin va exento allí.
  const blocked = isSaveBlockedByState(reservation.state);

  const step: "1" | "2" = searchParams.get("step") === "2" ? "2" : "1";
  const copy = STEP_COPY[step];
  const [imageFailed, setImageFailed] = useState(false);

  const initial = buildEditInitialValues(
    reservation,
    { id: user?.id, name: user?.name, email: user?.email },
    new Date(),
    isAdmin,
  );

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initial.date ?? getDefaultDate(),
      guests: initial.guests,
      location:
        reservation.location === "INSIDE" ||
        reservation.location === "OUTSIDE"
          ? reservation.location
          : "INSIDE",
      // Sin marca sobre la hora original (RF-20): se exige elegir una de
      // las horas actuales.
      startTime: "",
      phone: initial.phone,
      observations: initial.observations,
      name: initial.name,
      email: initial.email,
      user: reservation.user ?? "",
    },
  });

  // RF-20: si la hora elegida deja de estar entre las recargadas al cambiar
  // día o comensales, se limpia y se exige elegir otra de las actuales.
  const selectedStartTime = form.watch("startTime");
  useEffect(() => {
    if (
      selectedStartTime !== "" &&
      !isEditHourStillAvailable(hours, selectedStartTime)
    ) {
      form.setValue("startTime", "");
    }
  }, [hours, selectedStartTime, form]);

  const onSubmit = async (data: ReservationFormValues) => {
    const loadingId = toast.loading("Modificando su reserva…");
    try {
      const payload: Reservation = {
        ...reservation,
        id: reservation.id,
        date: format(data.date, "yyyy-MM-dd"),
        guests: Number(data.guests),
        location: data.location,
        startTime: data.startTime,
        phone: data.phone,
        observations: data.observations,
        name: data.name,
        email: data.email,
        // La reserva sigue siendo del propietario (RF-24).
        user: reservation.user ?? "",
      };
      const id = reservation.id ?? "";
      const result = await updateReservation(id, payload);

      toast.dismiss(loadingId);

      // RF-19: éxito → navegar a `/` con el toast visible tras navegar.
      if (result.ok) {
        toast.success(EDIT_SUCCESS_TOAST_MESSAGE);
        router.push("/");
        return;
      }

      // RF-10/RF-16/RF-18/RF-25/RF-26: aviso en español y datos conservados
      // (solo se muestra el mensaje; el formulario queda intacto).
      const body =
        result.code != null
          ? `${result.code} ${result.backendMessage ?? ""}`
          : (result.backendMessage ?? "");
      const mapped = mapUpdateError(
        result.status as UpdateErrorStatus,
        body,
      );
      toast.error(resolveUpdateErrorMessage(mapped));
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error al modificar la reserva: ", error);
      toast.error("No se ha podido guardar la reserva. Inténtelo de nuevo.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  const goToStep2 = async () => {
    const valid = await form.trigger(["date", "guests"]);
    if (!valid) return;

    const params = new URLSearchParams(searchParams);
    params.set("date", format(form.getValues("date"), "yyyy-MM-dd"));
    params.set("guests", form.getValues("guests"));
    params.set("step", "2");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const goToStep1 = () => {
    const params = new URLSearchParams(searchParams);
    params.set("step", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectedDate = form.watch("date");
  const selectedGuests = form.watch("guests");
  const summary = [
    selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es }),
    selectedGuests &&
      `${selectedGuests} ${Number(selectedGuests) === 1 ? "comensal" : "comensales"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  if (blocked) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-6 md:py-8">
        <section className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md">
          <div className="flex gap-4">
            <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <Pencil className="size-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-white">
                Modificar su reserva
              </h1>
              <p role="alert" className="text-sm text-zinc-300">
                {EDIT_NOT_MODIFIABLE_MESSAGE}
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

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center py-6 md:py-8">
      <section className="black-glassmorphism grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-lg border border-white/10 md:grid-cols-[2fr_3fr]">
        {/* Panel lateral (RF-27): misma disposición, rótulo y repliegue que la creación */}
        {!imageFailed && (
          <div
            data-testid="reservation-side-image"
            className="relative h-48 w-full md:h-auto md:min-h-140"
          >
            <Image
              src={SIDE_IMAGE_SRC}
              alt={SIDE_IMAGE_ALT}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              quality={90}
              onError={() => setImageFailed(true)}
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-5 pt-16">
              <p className="text-lg leading-tight font-semibold text-white">
                Modificación de reserva
              </p>
              <p className="text-sm text-white/80">
                A continuación, rellene el formulario.
              </p>
            </div>
          </div>
        )}
        <div
          className={`flex flex-col ${
            imageFailed ? "md:col-span-2" : "md:border-l md:border-white/10"
          }`}
        >
          <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">Paso {step} de 2</p>
              <h1 className="text-xl leading-tight font-semibold">
                {copy.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {copy.description}
              </p>
            </div>

            {step === "2" && (
              <button
                type="button"
                onClick={goToStep1}
                aria-label="Volver al paso anterior"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring shrink-0 rounded-lg p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
            )}
          </header>

          <div className="flex-1 px-6 py-6 md:px-8">
            <Form {...form}>
              <form
                id="form-reservation-edit"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {step === "1" ? (
                  <DateForm form={form} />
                ) : (
                  <AvailabilityForm form={form} hours={hours} />
                )}
              </form>
            </Form>
          </div>

          <footer className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="text-muted-foreground text-sm first-letter:uppercase">
              {summary || "Elija fecha y comensales"}
            </p>

            {step === "1" ? (
              <Button
                type="button"
                onClick={goToStep2}
                className="bg-primary hover:bg-primary! w-full hover:brightness-110 md:w-auto"
              >
                Ver disponibilidad
              </Button>
            ) : (
              <Button
                type="submit"
                form="form-reservation-edit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="bg-primary hover:bg-primary! w-full hover:brightness-110 md:w-auto"
              >
                {isSubmitting && (
                  <Loader2Icon aria-hidden className="animate-spin" />
                )}
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </Button>
            )}
          </footer>
        </div>
      </section>
    </div>
  );
}
