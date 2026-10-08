export type ImageLoadStatus = "loaded" | "failed";

/** Returns explicitly configured images that loaded, preserving source order. */
export function resolveGallery(
  initialSelection: readonly string[],
  loadStatus: Readonly<Record<string, ImageLoadStatus>>,
): string[] {
  return initialSelection.filter(
    (source) => loadStatus[source] === "loaded",
  );
}

/** Returns the next slide index, wrapping at the end; empty galleries have no index. */
export function getNextSlide(
  currentIndex: number,
  slideCount: number,
): number | undefined {
  if (slideCount <= 0) return undefined;
  return (currentIndex + 1) % slideCount;
}
