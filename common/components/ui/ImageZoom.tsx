"use client";

import Image, { type ImageProps } from "next/image";
import type React from "react";
import Zoom, { type UncontrolledProps } from "react-medium-image-zoom";

export interface ImageZoomProps extends ImageProps {
  /**
   * Props for `react-medium-image-zoom`.
   */
  rmiz?: Omit<UncontrolledProps, "children" | "zoomImg">;
  /**
   * Image props when zoomed. Defaults to the original `src`.
   */
  zoomInProps?: React.ComponentProps<"img">;
}

export const ImageZoom = ({
  alt = "",
  rmiz,
  zoomInProps,
  src,
  ...rest
}: ImageZoomProps) => {
  const originalSrc = typeof src === "string" ? encodeURI(src) : undefined;

  // srcSet y sizes vacíos para que el navegador cargue el original
  // y no las variantes reducidas de next/image
  const zoomImg = originalSrc
    ? { src: originalSrc, srcSet: "", sizes: "", ...zoomInProps }
    : zoomInProps;

  return (
    <Zoom wrapElement="span" zoomMargin={20} {...rmiz} zoomImg={zoomImg}>
      <Image alt={alt} src={src} {...rest} />
    </Zoom>
  );
};