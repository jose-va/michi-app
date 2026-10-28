import type { Page, Product } from "@/common/types/product.types";

/**
 * Tamaño de página del listado filtrado. El backend devuelve la búsqueda
 * sin paginar, así que se pagina en memoria con el mismo control visual
 * que el listado sin filtros para mantener el mismo ritmo con el pie.
 */
export const FILTERED_PRODUCTS_PAGE_SIZE = 8;

/**
 * Recorta una lista de productos a la página pedida con la forma `Page`
 * del listado sin filtros. La página se recorta al rango válido para no
 * dejar el listado vacío con un `page` obsoleto en la URL.
 */
export function paginateProducts(
  products: Product[],
  page: number,
  size: number = FILTERED_PRODUCTS_PAGE_SIZE,
): Page<Product> {
  const safeSize =
    Number.isInteger(size) && size > 0 ? size : FILTERED_PRODUCTS_PAGE_SIZE;
  const totalPages = Math.ceil(products.length / safeSize);
  const lastPage = Math.max(0, totalPages - 1);
  const safePage = Number.isInteger(page)
    ? Math.min(Math.max(page, 0), lastPage)
    : 0;

  return {
    content: products.slice(safePage * safeSize, (safePage + 1) * safeSize),
    totalPages,
    number: safePage,
  };
}
