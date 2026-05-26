import { Button } from "@/shadcn/components/button";
import GoogleMaps from "../../ui/location/GoogleMaps";
import Link from "next/link";
import { bodoni, montserrat } from "@/app/fonts/font";

export default function LocationPage() {
  return (
    <section className="flex flex-col gap-4">
      <span
        className={`${montserrat.className} mx-auto flex font-bold text-3xl md:text-4xl text-white/90`}
      >
        Estamos en...
      </span>
      <div className="mx-auto h-90 w-full md:w-150">
        <GoogleMaps />
      </div>
      <Button asChild className="mx-auto hover:scale-105 hover:brightness-110">
        <Link href="/reservation">Reserva ahora</Link>
      </Button>
    </section>
  );
}
