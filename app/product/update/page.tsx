import ProductFormPage from "@/common/components/pages/product/ProductFormPage";
import { ProductService } from "@/service/ProductService";
import { UserService } from "@/service/UserService";
import { redirect } from "next/navigation";

export default async function UpdateProductDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
  }>;
}) {
  const user = await UserService.getProfile();
  if (!user || user.role !== "ROLE_ADMIN") redirect("/");

  const { id } = await searchParams;
  const product = id ? await ProductService.getProduct(id) : undefined;
  return <ProductFormPage product={product} />;
}
