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
import ProductForm from "../../forms/product/ProductForm";
import { createProduct, updateProduct, uploadProductImage } from "@/lib/server-actions";
import {
  getProductImageSrc,
  validateProductImageFile,
} from "@/common/utils/product-image";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { bodoni, montserrat } from "@/app/fonts/font";

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

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoSelect = (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setPhotoError(null);
      return;
    }
    const validation = validateProductImageFile(file.name, file.size);
    if (!validation.ok) {
      setPhotoFile(null);
      setPhotoError(validation.error);
      return;
    }
    setPhotoFile(file);
    setPhotoError(null);
  };

  const savePhoto = async (productName: string): Promise<boolean> => {
    if (!photoFile) return true;
    const validation = validateProductImageFile(
      photoFile.name,
      photoFile.size,
    );
    if (!validation.ok) {
      setPhotoError(validation.error);
      return false;
    }
    const photoData = new FormData();
    photoData.set("name", productName);
    photoData.set("photo", photoFile);
    return uploadProductImage(photoData);
  };

  const onSubmit = async (data: ProductFormValues) => {
  if (product?.id) {
    const updated = await updateProduct(product.id, data as Product);
    if (updated) {
      const photoSaved = await savePhoto(data.name);
      if (photoSaved) {
        toast.success("¡Se ha actualizado el producto!");
      } else {
        toast.success("Producto actualizado, pero no se ha podido guardar la imagen.");
      }
      router.push(`/product?search=${data.name}`);
    } else {
      toast.error("No se ha podido actualizar el producto");
    }
  } else {
    const created = await createProduct(data);
    if (created) {
      const photoSaved = await savePhoto(data.name);
      if (photoSaved) {
        toast.success("¡Se ha creado un nuevo producto!");
      } else {
        toast.success("Producto creado, pero no se ha podido guardar la imagen.");
      }
      router.push(`/product?search=${data.name}`);
    } else {
      toast.error("No se ha podido crear el producto");
    }
  }
};

  return (
    <div className="flex items-center justify-center py-6 md:py-8">
      <Card className="black-glassmorphism w-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className={`${montserrat.className}`}>
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
              <ProductForm
                form={form}
                existingImageSrc={product ? getProductImageSrc(product.name) : null}
                existingImageAlt={
                  product ? `Fotografía de ${product.name}` : "Fotografía del producto"
                }
                photoFile={photoFile}
                photoError={photoError}
                onPhotoSelect={handlePhotoSelect}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              form="form-product"
              className="bg-primary transition-all duration-300 hover:scale-105 hover:bg-primary! hover:brightness-125"
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
