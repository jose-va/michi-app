"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shadcn/components/button";
import { cancelReservation } from "@/lib/server-actions";
import { getCancelErrorMessage } from "@/common/utils/cancel-error";
import { buildCancelWhatsappUrl } from "@/common/utils/whatsapp-contact";

export function CancelReservationPage({
  reservationId,
  token,
}: {
  reservationId: string;
  token?: string;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  if (!reservationId) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-6 md:py-8">
        <section className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md">
          <div className="flex gap-4">
            <div className="bg-michi-aqua/15 text-michi-aqua flex size-10 shrink-0 items-center justify-center rounded-full">
              <CalendarX2 className="size-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-white">
                Cancelar tu reserva
              </h1>
              <p className="text-sm text-zinc-300">
                No encontramos la reserva, contáctenos
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

  const handleCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    setError(null);
    setRetryable(false);
    setWhatsappUrl(null);
    const loadingId = toast.loading("Cancelando reserva…");
    try {
      const result = await cancelReservation(reservationId, token);
      toast.dismiss(loadingId);
      if (result.ok) {
        toast.success("Se ha cancelado su reserva");
        router.push("/");
        return;
      }
      if (result.status === 409) {
        setError("No se ha podido cancelar su reserva, contáctenos por WhatsApp");
        setWhatsappUrl(buildCancelWhatsappUrl("", undefined));
        setRetryable(false);
      } else {
        setError(getCancelErrorMessage(result));
        setRetryable(result.status === 500);
      }
    } catch {
      toast.dismiss(loadingId);
      setError("Error inesperado, inténtalo de nuevo por favor");
      setWhatsappUrl(null);
      setRetryable(true);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-6 md:py-8">
      <section className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md">
        <div className="flex gap-4">
          <div className="bg-michi-aqua/15 text-michi-aqua flex size-10 shrink-0 items-center justify-center rounded-full">
            <CalendarX2 className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-white">
              ¿Cancelar tu reserva?
            </h1>
            <p className="text-sm text-zinc-300">
              Esta acción no se puede deshacer. Si cancelas, tendrás que hacer
              una reserva nueva.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}

        {whatsappUrl && (
          <Button
            type="button"
            variant="secondary"
            asChild
            className="bg-white font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/Digital_Glyph_Green_RGB_2026.svg"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] shrink-0"
                loading="lazy"
              />
              Abrir Whatsapp
            </a>
          </Button>
        )}

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling || (!!error && !retryable)}
            aria-busy={isCancelling}
            className="bg-primary font-semibold hover:bg-primary! hover:brightness-110"
          >
            {isCancelling && (
              <Loader2Icon aria-hidden className="animate-spin" />
            )}
            {isCancelling
              ? "Cancelando reserva…"
              : retryable
                ? "Reintentar"
                : "Sí, cancelar reserva"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isCancelling}
            className="bg-transparent text-white"
          >
            <Link href="/">Volver</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
