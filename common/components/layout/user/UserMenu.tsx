import { Separator } from "@/shadcn/components/separator";
import { SheetClose } from "@/shadcn/components/sheet";
import { Star, CalendarSearch } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  return (
    <>
      <nav className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 hover:scale-102 hover:brightness-120">
          <CalendarSearch className="size-4" />
          <SheetClose asChild>
            <Link href="/reservation/preview">
              Reserva
            </Link>
          </SheetClose>
        </div>
        <Separator />
        <div className="flex items-center gap-2 hover:scale-102 hover:brightness-120">
          <Star className="size-4" />
          <SheetClose asChild>
            <Link href="/product/favorite">Productos favoritos</Link>
          </SheetClose>
        </div>
        <Separator />
      </nav>
    </>
  );
}
