"use client";

import { markFavorite, unmarkFavorite } from "@/lib/server-actions";
import { HeartPlus, HeartMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UserOptions({
  user,
  product,
  favorite,
}: {
  user: string;
  product: string;
  favorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(favorite);

  const handleMark = async () => {
    await markFavorite(user, product);
    setIsFavorite(true);
    toast.success("Producto añadido a favoritos");
  };

  const handleUnmark = async () => {
    await unmarkFavorite(user, product);
    setIsFavorite(false);
    toast.success("Producto eliminado de favoritos");
  };

  return (
    <>
      {isFavorite ? (
        <HeartMinus
          className="text-red-400 size-6 opacity-50 hover:cursor-pointer hover:opacity-100 md:size-5"
          onClick={handleUnmark}
        />
      ) : (
        <HeartPlus
          className="text-yellow-400 size-6 opacity-50 hover:cursor-pointer hover:opacity-100 md:size-5"
          onClick={handleMark}
        />
      )}
    </>
  );
}
