import type { User } from "@/common/types/user.types";
import type { Reservation } from "@/common/types/reservation.types";
import type { Product } from "@/common/types/product.types";
import { ReservationService } from "@/service/ReservationService";
import { ProductService } from "@/service/ProductService";
import { getTodayKey } from "@/common/utils/profile-day";
import { selectActiveReservation } from "@/common/utils/profile-reservations";
import { resolveFavoriteProducts } from "@/common/utils/profile-favorites";
import { Badge } from "@/shadcn/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import UserOptions from "@/common/components/ui/product/UserOptions";
import FavoriteProductPhoto from "./FavoriteProductPhoto";

function ActiveReservationDetail({
  reservation,
}: {
  reservation: Reservation;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p>
        <span className="font-medium">Fecha:</span> {reservation.date}
      </p>
      <p>
        <span className="font-medium">Hora:</span> {reservation.startTime}
      </p>
      <p>
        <span className="font-medium">Comensales:</span> {reservation.guests}
      </p>
      <p>
        <span className="font-medium">Titular:</span> {reservation.name}
      </p>
      <p>
        <span className="font-medium">Contacto:</span> {reservation.phone}
        {reservation.email ? ` · ${reservation.email}` : null}
      </p>
      {reservation.observations ? (
        <p>
          <span className="font-medium">Observaciones:</span>{" "}
          {reservation.observations}
        </p>
      ) : null}
      {reservation.location ? (
        <p>
          <span className="font-medium">Ubicación:</span>{" "}
          <Badge>{reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}</Badge>
        </p>
      ) : null}
    </div>
  );
}

function FavoriteDetail({ product, user }: { product: Product; user: User }) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <FavoriteProductPhoto name={product.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-medium">{product.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {product.japaneseName}
        </p>
      </div>
      <span className="shrink-0">
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
  const reservations = await ReservationService.getReservations(
    getTodayKey(new Date(), "Europe/Madrid"),
    user.role,
  );
  const active =
    reservations === null
      ? null
      : selectActiveReservation(reservations, user.id);
  const products = await ProductService.all();
  const favorites = resolveFavoriteProducts(products, user.favoriteProducts);

  return (
    <Tabs defaultValue="mi-reserva" className="flex min-w-0 flex-col gap-2">
      <TabsList variant="line">
        <TabsTrigger value="mi-reserva">Mi reserva</TabsTrigger>
        <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
      </TabsList>
      <TabsContent value="mi-reserva">
        {reservations === null ? (
          <p>No se ha podido cargar la información</p>
        ) : active === null ? (
          <p>Todavía no has realizado ninguna reserva</p>
        ) : (
          <ActiveReservationDetail reservation={active} />
        )}
      </TabsContent>
      <TabsContent value="favoritos">
        {favorites.length === 0 ? (
          <p>No tienes productos favoritos</p>
        ) : (
          <ul className="flex min-w-0 flex-col gap-4">
            {favorites.map((product) => (
              <FavoriteDetail
                key={product.id ?? product.name}
                product={product}
                user={user}
              />
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
