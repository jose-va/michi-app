"use client";

import { Product } from "@/common/types/product.types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import {
  getAllergenIcon,
  getAllergenTitle,
} from "../../../mappers/allergen.mapper";
import { getCategoryBadge } from "@/common/mappers/badge.mapper";
import { getCategoryTitle } from "@/common/mappers/category.mapper";

import { useUser } from "../../provider/UserProvider";
import { cn } from "@/lib/utils";
import AdminOptions from "./AdminOptions";
import UserOptions from "./UserOptions";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const user = useUser();
  const favoriteProducts = user?.role === "ROLE_USER" ? user.favoriteProducts : [];
  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <Card
        className={cn(
          "black-glassmorphism hover:shadow-4xl mt-6 h-full rounded-lg border duration-500 hover:-translate-y-2",
          !product.status && "opacity-60 grayscale"
        )}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-sm">{product.name}</CardTitle>
            <span className="text-xs font-extralight">
              {product.pieces == 1 && `${product.pieces.toString()} pieza`}
              {product.pieces > 1 && `${product.pieces.toString()} piezas`}
            </span>
          </div>
          <CardDescription>
            <Badge className={getCategoryBadge(product.category)}>
              {getCategoryTitle(product.category)}
            </Badge>
          </CardDescription>
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
          <p className="text-pretty">{product.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-1">
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
          <span className="border-l border-white/40 pr-1 pl-3 font-semibold">
            {product.price.toFixed(2)}€
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
