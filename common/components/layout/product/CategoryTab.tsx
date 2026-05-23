"use client";

import { getCategoryTitle } from "@/common/mappers/category.mapper";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { categories } from "@/common/mappers/category.mapper";

export default function CategoryTab() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleCategory(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("category", value.toLocaleLowerCase());

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <section>
      <Tabs
        defaultValue="categories"
        onValueChange={handleCategory}
        className="mt-5 w-full rounded-sm border border-white/10 bg-black/50 shadow-xl backdrop-blur-sm"
      >
        <TabsList variant="line" className="grid grid-cols-8 gap-y-2">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {getCategoryTitle(category)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  );
}
