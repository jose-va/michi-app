import type { User } from "@/common/types/user.types";
import type { Product } from "@/common/types/product.types";
import { ReservationService } from "@/service/ReservationService";
import { ProductService } from "@/service/ProductService";
import { getTodayKey } from "@/common/utils/profile-day";
import { resolveFavoriteProducts } from "@/common/utils/profile-favorites";
import { Separator } from "@/shadcn/components/separator";
import { SheetClose } from "@/shadcn/components/sheet";
import { Badge } from "@/shadcn/components/badge";
import { getCategoryBadge } from "@/common/mappers/badge.mapper";
import { getCategoryTitle } from "@/common/mappers/category.mapper";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import { CalendarSearch, Shrimp } from "lucide-react";
import Link from "next/link";
import UserOptions from "@/common/components/ui/product/UserOptions";
import FavoriteProductPhoto from "./FavoriteProductPhoto";
import UserReservationsByDay from "./UserReservationsByDay";

function FavoriteDetail({ product, user }: { product: Product; user: User }) {
  return (
    <li className="flex min-w-0 items-center gap-3">
      <FavoriteProductPhoto name={product.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <p className="truncate font-medium">{product.name}</p>
          <span className="shrink-0 text-xs font-extralight">
            {product.pieces == 1 && `${product.pieces.toString()} pieza`}
            {product.pieces > 1 && `${product.pieces.toString()} piezas`}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-muted-foreground min-w-0 flex-1 truncate text-sm">
            {product.japaneseName}
          </p>
          <Badge
            className={cn(
              "px-2 py-0 text-[10px] mr-1",
              getCategoryBadge(product.category),
            )}
          >
            {getCategoryTitle(product.category)}
          </Badge>
        </div>
      </div>
      <span className="shrink-0 -translate-y-2.5">
        <UserOptions
          user={user.id}
          product={product.id ?? ""}
          favorite={user.favoriteProducts.includes(product.id ?? "")}
        />
      </span>
    </li>
  );
}

export default async function UserProfileTabs({ user }: { user: User }) {
  const today = getTodayKey(new Date(), "Europe/Madrid");
  const reservations = await ReservationService.getMyReservations(today);
  const products = await ProductService.all();
  const favorites = resolveFavoriteProducts(products, user.favoriteProducts);

  return (
    <Tabs defaultValue="mi-reserva" className="flex min-w-0 flex-col gap-2">
      <TabsList variant="line" className="mb-2">
        <TabsTrigger value="mi-reserva">Mi reserva</TabsTrigger>
        <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
      </TabsList>
      <TabsContent value="mi-reserva">
        <UserReservationsByDay
          today={today}
          initialDate={today}
          initialReservations={reservations}
        />
      
        <nav className="mt-4 flex flex-col gap-4">
          <Separator />
          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:scale-101 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <CalendarSearch className="size-4" />
            <SheetClose asChild>
              <Link href="/reservation/preview">Nueva reserva</Link>
            </SheetClose>
          </div>
          <Separator />
        </nav>
      </TabsContent>
      <TabsContent value="favoritos">
        {favorites.length === 0 ? (
          <p className="text-primary brightness-150">No tienes productos favoritos</p>
        ) : (
          <ul className="flex min-w-0 flex-col gap-5">
            {favorites.map((product) => (
              <FavoriteDetail
                key={product.id ?? product.name}
                product={product}
                user={user}
              />
            ))}
          </ul>
        )}
        <nav className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:scale-101 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Shrimp className="size-4" />
            <SheetClose asChild>
              <Link href="/product">Ver productos</Link>
            </SheetClose>
          </div>
          <Separator />
        </nav>
      </TabsContent>
    </Tabs>
  );
}
