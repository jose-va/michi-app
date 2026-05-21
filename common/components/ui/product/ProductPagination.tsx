"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/components/pagination";

import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
}

export function ProductPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();

  return (
    <Pagination className="mt-10 mb-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => router.push(`?page=${currentPage - 1}`)}
            className={cn(
              "cursor-pointer",
              currentPage == 0
                ? "pointer-events-none opacity-50"
                : "black-glassmorphism"
            )}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => router.push(`?page=${currentPage + 1}`)}
            className={cn(
              "cursor-pointer",
              currentPage == totalPages - 1
                ? "pointer-events-none opacity-50"
                : "black-glassmorphism"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
