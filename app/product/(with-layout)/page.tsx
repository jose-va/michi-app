import ProductPage from "@/common/components/pages/product/ProductPage";
import SkeletonCards from "@/common/components/skeletons/SkeletonCards";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Carta",
  description:
    "Explora la carta de Michi Sushi: entrantes, sushi clásico, makis especiales, combinados y platos calientes. Consulta la carta y precios online.",
  alternates: {
    canonical: "/product",
  },
};

export default async function ProductDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    name?: string;
    allergens?: string[];
    page?: string;
  }>;
}) {
  const { category, name, allergens, page } = await searchParams;

  return (
    <section>
      <Suspense
        fallback={<SkeletonCards />}
        key={`${name}-${category}-${allergens}-${page}`}
      >
        <ProductPage
          category={category}
          name={name}
          allergens={allergens}
          page={page ? parseInt(page) : 0}
        />
      </Suspense>
    </section>
  );
}
