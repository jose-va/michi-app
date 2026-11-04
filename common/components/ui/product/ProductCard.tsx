"use client";

import { Product } from "@/common/types/product.types";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/components/tooltip";
import { Badge } from "@/shadcn/components/badge";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { normalizeFeatured } from "@/common/utils/product-featured";
import { useState } from "react";
import {
  getAllergenIcon,
  getAllergenTitle,
} from "../../../mappers/allergen.mapper";
import { getCategoryBadge } from "@/common/mappers/badge.mapper";
import { getCategoryTitle } from "@/common/mappers/category.mapper";
import { getProductImageSrc } from "@/common/utils/product-image";
import { formatPriceES } from "@/common/utils/product-price";

import { useUser } from "../../provider/UserProvider";
import { cn } from "@/lib/utils";
import AdminOptions from "./AdminOptions";
import UserOptions from "./UserOptions";
import { ImageZoom } from "../ImageZoom";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const user = useUser();
  const [imageFailed, setImageFailed] = useState(false);
  const favoriteProducts =
    user?.role === "ROLE_USER" ? user.favoriteProducts : [];
  const isFeatured = normalizeFeatured(product.featured);
  const featuredIcon = (
    <Tooltip>
      <TooltipTrigger asChild>
        <BadgeCheck
          role="img"
          aria-label="Producto destacado"
          className="size-6 text-yellow-400 stroke-[2.5]"
        />
      </TooltipTrigger>
      <TooltipContent>Producto destacado</TooltipContent>
    </Tooltip>
  );
  const formatted = formatPriceES(product.price);
  const priceBadge = () =>
    formatted ? (
      <Badge
        variant="secondary"
        className="bg-yellow-400 font-semibold text-yellow-950"
        aria-label={`Precio ${formatted}`}
      >
        {formatted}
      </Badge>
    ) : null;
  return (
    <div
      className="animate-fade-in-up opacity-0 motion-reduce:animate-none motion-reduce:opacity-100"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <Card
        className={cn(
          "black-glassmorphism hover:shadow-4xl relative mt-4 h-full rounded-lg border duration-500 hover:-translate-y-2",
          !imageFailed && "pt-0",
          !product.status && "opacity-60 grayscale"
        )}
      >
        {imageFailed ? (
          <div className="flex flex-wrap items-center gap-2 px-4">
            <Badge className={getCategoryBadge(product.category)}>
              {getCategoryTitle(product.category)}
            </Badge>
            {isFeatured && featuredIcon}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-t-lg">
            <ImageZoom
              src={getProductImageSrc(product.name)}
              alt={`Fotografía de ${product.name}`}
              width={400}
              height={225}
              className="h-44 w-full object-cover"
              onError={() => setImageFailed(true)}
            />
            <Badge
              className={cn(
                "absolute top-2 left-2 shadow-lg",
                getCategoryBadge(product.category)
              )}
            >
              {getCategoryTitle(product.category)}
            </Badge>
            {isFeatured && (
              <span className="absolute top-2 right-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.9)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                {featuredIcon}
              </span>
            )}
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-sm">{product.name}</CardTitle>
          {(formatted || product.pieces > 0) && (
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {priceBadge()}
              {product.pieces > 0 && (
                <span
                  className={cn(
                    "text-sm font-extralight",
                    formatted && "border-l border-white/30 pl-3"
                  )}
                >
                  {product.pieces == 1
                    ? `${product.pieces.toString()} pieza`
                    : `${product.pieces.toString()} piezas`}
                </span>
              )}
            </div>
          )}
          <CardAction className="flex items-center justify-center gap-3 md:gap-2">
            {user?.role === "ROLE_ADMIN" && <AdminOptions product={product} />}
            {user?.role === "ROLE_USER" && (
              <UserOptions
                user={user.id}
                product={product.id ?? ""}
                favorite={favoriteProducts.includes(product.id ?? "")}
              />
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 font-extralight">
          {product.description?.trim() && (
            <p className="text-pretty">{product.description}</p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          {product.allergens?.length ? (
            <div className="flex min-h-[25px] items-center gap-1">
              {product.allergens.map((allergen) => (
                <Tooltip key={allergen}>
                  <TooltipTrigger asChild>
                    <Image
                      src={getAllergenIcon(allergen)}
                      alt={allergen}
                      width={25}
                      height={25}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="capitalize">
                    {getAllergenTitle(allergen)}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : (
            <p className="flex min-h-[25px] items-center text-xs text-zinc-400">
              Este plato no contiene alérgenos
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
