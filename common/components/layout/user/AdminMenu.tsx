import { Separator } from "@/shadcn/components/separator";
import { Shrimp, CalendarCheck2 } from "lucide-react";
import Link from "next/link";


export default function AdminMenu() {
  return (
    <>
      <nav className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
            <CalendarCheck2 className="size-4"/>
            <Link href="/admin/reservation">Reservas</Link>
        </div>
        <Separator />
        <div className="flex gap-2 items-center">
            <Shrimp className="size-4"/>
            <Link href="/product/create">Crear producto</Link>
        </div>
        <Separator />
      </nav>
    </>
  );
}
