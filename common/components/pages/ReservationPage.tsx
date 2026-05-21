"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/card";
import { Form } from "@/shadcn/components/form";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/shadcn/components/button";
import { formSchema, ReservationFormValues } from "@/common/types/reservation-form.types";
import DateForm from "@/common/components/forms/reservation/DateForm";
import AvailabilityForm from "@/common/components/forms/reservation/AvailabilityForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createReservation } from "@/lib/server-actions";
import { format } from "date-fns";

export function ReservationPage() {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  let step = searchParams.get("step") || "1";

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      guests: "",
      location: "INSIDE",
      startTime: "",
      name: "",
      phone: "",
      email: null,
      observations: null,
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    try {
      await createReservation(data);
    } catch (error) {
      console.error("Error al crear reserva: ", error);
    }
  };

  const handleNextStep = async () => {
    const valid = await form.trigger(["date", "guests"]);
    if (!valid) return;

    const params = new URLSearchParams(searchParams);
    params.set("step", "2");
    params.set("date", format(form.getValues("date"), "yyyy-MM-dd"));
    params.set("guests", form.getValues("guests"));

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mr-8 flex items-center justify-center p-4">
      <Card className="w-md black-glassmorphism">
        <CardHeader>
          <CardTitle className="flex w-full justify-between">
            {step == "1" ? "Reservar una mesa" : "Ver disponibilidad"}
            {step == "2" && (
              <ArrowLeftIcon
                className="transition-all hover:scale-115 hover:cursor-pointer"
                onClick={() => router.replace(`${pathname}?step=1`)}
              />
            )}
          </CardTitle>

          <CardDescription>
            {step == "1"
              ? "Seleccione la fecha y número de comensales"
              : "Seleccione una de las horas disponibles"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="form-reservation" onSubmit={form.handleSubmit(onSubmit)}>
              {step == "1" ? (
                <DateForm form={form} />
              ) : (
                <AvailabilityForm form={form} />
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {step === "1" && (
            <Button
              type="button"
              onClick={handleNextStep}
              className="transition-all duration-300 hover:scale-105"
            >
              Ver disponibilidad
            </Button>
          )}
          {step === "2" && (
            <div className="flex gap-2">
              <Button
                type="submit"
                form="form-reservation"
                className="transition-all duration-300 hover:scale-105 hover:brightness-125"
              >
                Confirmar reserva
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
