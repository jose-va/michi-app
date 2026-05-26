import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shadcn/components/empty";
import Image from "next/image";

export function ProductEmpty() {
  return (
    <Empty className="black-glassmorphism h-50 w-full md:w-100 my-5 mx-auto border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-transparent">
          <Image
            src="/icons/sushi.svg"
            alt="sushi_icon"
            width="50"
            height="50"
          />
        </EmptyMedia>
        <EmptyTitle>No hay productos</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          No se ha encontrado ningún producto, prueba con un nombre o categoría
          distinta.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
