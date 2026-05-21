import ProductFormPage from "@/common/components/forms/product/ProductFormPage";
import { ProductService } from "@/service/ProductService";

export default async function UpdateProductDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string
  }>;
}){
    const { id } = await searchParams;
    const product = id ? await ProductService.getProduct(id) : undefined;
    return <ProductFormPage product={product}/>
}
