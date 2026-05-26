import { Separator } from "@/shadcn/components/separator";
import { Shrimp, CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { SheetClose } from "@/shadcn/components/sheet";

export default function AdminMenu() {
  return (
    <>
      <nav className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 hover:scale-102 hover:brightness-120">
          <CalendarCheck2 className="size-4" />
          <SheetClose asChild>
            <Link href="/reservation/preview">Reservas</Link>
          </SheetClose>
        </div>

        <Separator />

        <div className="flex items-center gap-2 hover:scale-102 hover:brightness-120">
          <Shrimp className="size-4" />
          <SheetClose asChild>
            <Link href="/product/create">Crear producto</Link>
          </SheetClose>
        </div>

        <Separator />
      </nav>
    </>
  );
}
