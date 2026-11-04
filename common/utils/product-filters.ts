/**
 * Devuelve una copia de los params sin `page`, para volver a la primera
 * página del listado al cambiar cualquier filtro.
 */
export function resetPageParam(
  searchParams: URLSearchParams | { toString(): string },
): URLSearchParams {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");
  return params;
}
