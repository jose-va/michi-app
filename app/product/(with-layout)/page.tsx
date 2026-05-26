import ProductPage from "@/common/components/pages/product/ProductPage";
import SkeletonCards from "@/common/components/skeletons/SkeletonCards";
import { Suspense } from "react";

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
