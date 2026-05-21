"use client";

import { Search } from "lucide-react";
import { Input } from "@/shadcn/components/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("name", value.toLocaleLowerCase());

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="filter-input w-full max-w-sm gap-1.5 focus-within:ring-1 focus-within:ring-white/20 focus-within:text-white">
      <Search className="text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Buscar productos..."
        className="border-0 bg-transparent! focus-visible:ring-0 text-md dark:hover:bg-black/20 hover:cursor-text"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
