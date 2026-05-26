"use client";

import { Pencil } from "lucide-react";
import { ProductDelete } from "./ProductDelete";
import ProductDeactivate from "./ProductDeactivate";
import ProductActivate from "./ProductActivate";
import { Product } from "@/common/types/product.types";
import { useRouter } from "next/navigation";

export default function AdminOptions({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <>
      <Pencil
        className="size-5 opacity-50 hover:cursor-pointer hover:opacity-100 md:size-5"
        onClick={() => router.push(`/product/update?id=${product.id}`)}
      />
      <ProductDelete id={product.id ?? ""} />
      {product.status ? (
        <ProductDeactivate id={product.id ?? ""} />
      ) : (
        <ProductActivate id={product.id ?? ""} />
      )}
    </>
  );
}
