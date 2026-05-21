import CategoryTab from "@/common/components/ui/category/CategoryTab";
import { CategorySelect } from "@/common/components/ui/category/CategorySelect";
import ProductSearch from "@/common/components/ui/product/ProductSearch";
import UberSync from "@/common/components/ui/product/UberSync";
import AllergenSelect from "@/common/components/ui/product/AllergenSelect";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <CategoryTab /> */}

      <div className="mt-6 flex h-9 w-full items-center gap-5">
        <ProductSearch />
        <CategorySelect />
        <AllergenSelect />
        
        <UberSync />
      </div>
      {children}
    </section>
  );
}
