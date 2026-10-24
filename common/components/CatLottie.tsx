"use client";

import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import catMovement from "@/common/assets/cat-movement.json";

// Gatito decorativo al pie de la página Conócenos.
// Animación "Cat Movement" de Abdul Latif (LottieFiles, Lottie Simple License).

export default function CatLottie() {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div aria-hidden="true" className="mx-auto w-32 md:w-40">
      <Lottie
        src={catMovement}
        autoplay={!reducedMotion}
        loop={!reducedMotion}
      />
    </div>
  );
}
