import { CategorySelect } from "@/common/components/layout/product/CategorySelect";
import ProductSearch from "@/common/components/layout/product/ProductSearch";
import UberSync from "@/common/components/layout/product/UberSync";
import AllergenSelect from "@/common/components/layout/product/AllergenSelect";
import CartaDownloadButton from "@/common/components/layout/product/CartaDownloadButton";
import { UserService } from "@/service/UserService";
import { ProductService } from "@/service/ProductService";
import ActivateButton from "@/common/components/layout/product/ActivateButton";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await UserService.getProfile();

  return (
    <>

      <div className="relative flex w-full flex-wrap items-center gap-4">
        <ProductSearch />
        <div className="flex items-center gap-3">
          <AllergenSelect />
          <CategorySelect /> 
          
        </div>

        <div className="ml-auto flex gap-3">  
          {user?.role === "ROLE_ADMIN" ? <ActivateButton /> : <CartaDownloadButton />}
          <UberSync />
        </div>
      </div>
      {children}
    </>
  );
}
