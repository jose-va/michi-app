import { ProductService } from "@/service/ProductService";
import { centuryGothic } from "@/app/fonts/font";
import { getCategoryTitle } from "@/common/mappers/category.mapper";
import { paginateProducts } from "@/common/utils/product-pagination";
import ProductCard from "../../ui/product/ProductCard";
import { ProductPagination } from "../../ui/product/ProductPagination";
import { ProductEmpty } from "../../ui/product/ProductEmpty";

export default async function ProductPage({
  category,
  name,
  allergens,
  page = 0,
  size,
  favorites
}: {
  category?: string;
  name?: string;
  allergens?: string | string[],
  page?: number,
  size?: number,
  favorites?: string[];
}) {
  const allergensList = allergens ? (Array.isArray(allergens) ? allergens : [allergens]) : undefined;
  const hasFilters = category || name || allergensList?.length;

  if (hasFilters) {
    const products = await ProductService.searchProducts({ name, category, allergens: allergensList });
    if (!products.length) return <ProductEmpty />;

    const filteredPage = paginateProducts(products, page, size);

    return (
      <>
        {category ? (
          <h2 className={`${centuryGothic.className} mt-8 mb-2 text-3xl text-white md:text-4xl`}>{getCategoryTitle(category)}</h2>
        ) : null}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPage.content.map((product, index) => (
            <ProductCard key={product.id} product= {{...product}} index={index}/>
          ))}
        </div>
        <ProductPagination currentPage={filteredPage.number} totalPages={filteredPage.totalPages} />
      </>
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

