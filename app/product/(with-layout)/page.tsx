import ProductPage from "@/common/components/pages/ProductPage";
import ProductSkeleton from "@/common/components/skeletons/ProductSkeleton";
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
    <div>
      <Suspense
        fallback={<ProductSkeleton />}
        key={`${name}-${category}-${allergens}-${page}`}
      >
        <ProductPage
          category={category}
          name={name}
          allergens={allergens}
          page={page ? parseInt(page) : 0}
        />
      </Suspense>
    </div>
  );
}
