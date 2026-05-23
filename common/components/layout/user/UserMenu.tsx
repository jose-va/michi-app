import { Separator } from "@/shadcn/components/separator";
import { Star, CalendarSearch } from "lucide-react";
import Link from "next/link";


export default function UserMenu() {
  return (
    <>
      <nav className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
            <CalendarSearch className="size-4"/>
            <Link href="/admin/reservation">Reserva</Link>
        </div>
        <Separator />
        <div className="flex gap-2 items-center">
            <Star className="size-4"/>
            <Link href="/product/favorite">Productos favoritos</Link>
        </div>
        <Separator />
      </nav>
    </>
  );
}
