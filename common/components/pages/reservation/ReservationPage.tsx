"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

import { Form } from "@/shadcn/components/form";
import { Button } from "@/shadcn/components/button";
import {
  formSchema,
  ReservationFormValues,
} from "@/common/types/reservation-form.types";
import DateForm from "@/common/components/forms/reservation/DateForm";
import AvailabilityForm from "@/common/components/forms/reservation/AvailabilityForm";
import { createReservation } from "@/lib/server-actions";
import { normalizeUserKey } from "@/common/utils/profile-reservations";
import { useUser } from "../../provider/UserProvider";
import { Hours } from "@/common/types/hour.types";

const SIDE_IMAGE_SRC =
  "/images/Dish Composition [5_4-2304x2880-watermarked] d88.webp";
const SIDE_IMAGE_ALT = "Local Michi Sushi Granada";

const STEP_COPY = {
  "1": {
    title: "Reservar una mesa",
    description: "Seleccione la fecha y número de comensales",
  },
  "2": {
    title: "Ver disponibilidad",
    description: "Seleccione una de las horas disponibles",
  },
} as const;

// El local cierra los domingos: si hoy es domingo, se propone el lunes
const getDefaultDate = () => {
  const today = new Date();
  return today.getDay() === 0 ? addDays(today, 1) : today;
};

export function ReservationPage({ hours }: { hours: Hours }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageFailed, setImageFailed] = useState(false);

  const step: "1" | "2" = searchParams.get("step") === "2" ? "2" : "1";
  const copy = STEP_COPY[step];

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: getDefaultDate(),
      guests: "",
      location: "INSIDE",
      startTime: "",
      phone: "",
      observations: "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      user: user?.id ?? "",
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    const loadingId = toast.loading("Creando su reserva…");
    try {
      // Quitamos `user`: la identidad la resuelve el servidor con la sesión.
      const { user: _ignored, ...values } = data;
      const result = await createReservation(values);

      toast.dismiss(loadingId);

      if (result.ok) {
        toast.success("¡Se ha creado su reserva!");
        router.push("/");
        return;
      }

      switch (result.error) {
        case "ALREADY_EXISTS": {
          const turno =
            Number(data.startTime.slice(0, 2)) < 18 ? "comer" : "cenar";
          toast.warning(`Ya tienes una reserva ese día para ${turno}`);
          break;
        }
        case "NO_TABLES":
        case "INVALID_TIME":
          toast.error("Esa hora ya no está disponible", {
            description: "Elige otra, por favor.",
          });
          // aquí: vuelve a pedir las horas y limpia la hora seleccionada
          break;
        default:
          toast.error("No se ha podido crear su reserva", {
            description: (
              <span>
                Contáctenos por{" "}
                <a
                  href="https://wa.me/34673821148"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  WhatsApp
                </a>
                .
              </span>
            ),
          });
      }
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error al crear la reserva: ", error);
      toast.error("No se ha podido crear su reserva, contáctenos por WhatsApp");
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

  const goToStep1 = () => router.replace(`${pathname}?step=1`);

  const selectedDate = form.watch("date");
  const selectedGuests = form.watch("guests");
  const summary = [
    selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es }),
    selectedGuests &&
      `${selectedGuests} ${Number(selectedGuests) === 1 ? "comensal" : "comensales"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center py-6 md:py-8">
      {/* Un único bloque: imagen + formulario pegados, con el mismo borde rounded-lg del resto de la web */}
      <section className="black-glassmorphism grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-lg border border-white/10 md:grid-cols-[2fr_3fr]">
        {/* Imagen */}
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
                Michi Sushi
              </p>
              <p className="text-sm text-white/80">
                Sushi para compartir en Granada
              </p>
            </div>
          </div>
        )}

        {/* Formulario */}
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
                id="form-reservation"
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
                form="form-reservation"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="bg-primary hover:bg-primary! w-full hover:brightness-110 md:w-auto"
              >
                {isSubmitting && (
                  <Loader2Icon aria-hidden className="animate-spin" />
                )}
                {isSubmitting ? "Creando reserva…" : "Confirmar reserva"}
              </Button>
            )}
          </footer>
        </div>
      </section>
    </div>
  );
}
