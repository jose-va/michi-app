import { ProductService } from "@/service/ProductService";
import ProductCard from "../ui/product/ProductCard";
import { ProductPagination } from "../ui/product/ProductPagination";
import { ProductEmpty } from "../ui/product/ProductEmpty";

export default async function ProductPage({
  category,
  name,
  allergens,
  page = 0,
}: {
  category?: string;
  name?: string;
  allergens?: string[],
  page?: number,
  size?: number
}) {
  const hasFilters = category || name || allergens?.length;

  if (hasFilters) {
    const products = await ProductService.searchProducts({ name, category, allergens });
    if (!products.length) return <ProductEmpty />;

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product= {{...product}} index={index}/>
        ))}
      </div>
    );
  }

  const data = await ProductService.getProducts(page);
  if (!data) return <ProductEmpty />

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.content.map((product, index) => (
          <ProductCard key={product.id} product= {{...product}} index={index}/>
        ))}
      </div>
      <ProductPagination currentPage={data.number} totalPages={data.totalPages} />
    </>
  );
}

