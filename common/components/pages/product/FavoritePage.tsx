import { ProductService } from "@/service/ProductService";
import ProductCard from "../../ui/product/ProductCard";
import { ProductEmpty } from "../../ui/product/ProductEmpty";
import { FavoriteEmpty } from "../../ui/product/FavoriteEmpty";

export default async function FavoritePage({ favorites }: { favorites: string[] }) {
  const products = await ProductService.all();
  if (!products) return <ProductEmpty />;

  const favoriteProducts = products.filter(product => favorites.includes(product.id ?? ""));
  if (!favoriteProducts.length) return <FavoriteEmpty />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {favoriteProducts.map((product, index) => (
        <ProductCard key={product.id} product={{...product}} index={index} />
      ))}
    </div>
  );
}