import CategoryTab from "@/common/components/layout/product/CategoryTab";
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
      {/* <CategoryTab /> */}

      <div className="relative flex w-full flex-wrap items-center gap-4">
        <ProductSearch />
        <div className="flex items-center gap-3">
          <AllergenSelect />
          <CategorySelect />
          {user?.role !== "ROLE_ADMIN" && <CartaDownloadButton />}
        </div>

        {user?.role === "ROLE_ADMIN" && (
          <div className="ml-auto flex gap-3">
            <ActivateButton />
            <UberSync />
          </div>
        )}
      </div>
      {children}
    </>
  );
}
