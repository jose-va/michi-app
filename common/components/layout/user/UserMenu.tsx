import { Separator } from "@/shadcn/components/separator";
import { SheetClose } from "@/shadcn/components/sheet";
import { CalendarSearch } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  return (
    <>
      <nav className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 hover:scale-101 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <CalendarSearch className="size-4" />
          <SheetClose asChild>
            <Link href="/reservation/preview">
              Nueva reserva
            </Link>
          </SheetClose>
        </div>
        <Separator />
      </nav>
    </>
  );
}
