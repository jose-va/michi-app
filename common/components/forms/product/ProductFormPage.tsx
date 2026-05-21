"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shadcn/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/card";
import {
  productFormSchema,
  ProductFormValues,
} from "@/common/types/product-form.types";
import { Form } from "@/shadcn/components/form";
import { Product } from "@/common/types/product.types";
import ProductForm from "./ProductForm";
import { createProduct, updateProduct } from "@/lib/server-actions";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProducFormPage({ product }: { product?: Product }) {
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      japaneseName: product?.japaneseName ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      category: product?.category ?? "",
      allergens: product?.allergens ?? [],
      pieces: product?.pieces ?? 0,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (product?.id) {
      const updated = await updateProduct(product.id, data as Product);
      if (updated) toast.success("¡Se ha actualizado el producto!");
      else toast.error("No se ha podido actualizar el producto");
    } else {
      const created = await createProduct(data);
      if (created) toast.success("¡Se ha creado un nuevo producto!");
      else toast.error("No se ha podido crear el producto");
    }
  };

  return (
    <div className="mr-8 flex items-center justify-center p-4">
      <Card className="black-glassmorphism w-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>
              {product ? "Modificar producto" : "Crear producto"}
            </CardTitle>
            <ArrowLeftIcon
              className="transition-all hover:scale-115 hover:cursor-pointer"
              onClick={() => router.back()}
            />
          </div>
          <CardDescription className="max-w-3xs">
            {product
              ? "Rellene los siguientes campos para la modificación del producto"
              : "Rellene los siguientes campos para la incorporación de un producto en la carta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="form-product" onSubmit={form.handleSubmit(onSubmit)}>
              <ProductForm form={form} />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              form="form-product"
              className="transition-all duration-300 hover:scale-105 hover:brightness-125"
            >
              {product ? "Modificar" : "Crear"}
            </Button>
            <Button
              type="button"
              form="form-product"
              className="transition-all duration-300 hover:scale-105 hover:brightness-125"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
