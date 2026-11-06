import Image from "next/image";
import { montserrat, centuryGothic } from "@/app/fonts/font";
import CatLottie from "@/common/components/CatLottie";
import {
  ABOUT_KANJI,
  ABOUT_SIGNATURE_IMAGE_ALT,
  ABOUT_SIGNATURE_IMAGE_HEIGHT,
  ABOUT_SIGNATURE_IMAGE_SRC,
  ABOUT_SIGNATURE_IMAGE_WIDTH,
  ABOUT_TITLE,
  buildAboutImageUrl,
  getAboutParagraphs,
} from "@/common/utils/about-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  alternates: { canonical: "/about" },
};

const ABOUT_PARAGRAPH_STAGGER_MS = 120;

export default function AboutPage() {
  return (
    <section className="relative px-0 pt-0 pb-4 md:pb-10 lg:pb-28">
      <article
        lang="es"
        className={`${montserrat.className} relative mx-auto w-full max-w-prose overflow-hidden rounded-lg border border-white/10 bg-black/90 text-white shadow-lg backdrop-blur-md`}
      >
        <div className="relative p-5 md:p-8">
          <header className="mb-4 flex items-center justify-between gap-4 border-b border-white/20 pb-4">
            <h1
              className={`${centuryGothic.className} text-lg font-semibold tracking-widest uppercase md:text-2xl`}
            >
              {ABOUT_TITLE}
            </h1>
            <span
              aria-hidden="true"
              className={`${centuryGothic.className} hover:shadow-6xl shadow-3xl text-3xl transition-transform duration-300 hover:scale-110 hover:brightness-150 md:text-4xl`}
            >
              {ABOUT_KANJI}
            </span>
          </header>
          <div className="flex flex-col gap-4">
            {getAboutParagraphs().map((paragraph, paragraphIndex) => (
              <p
                key={paragraph}
                className="animate-fade-in text-justify text-sm leading-relaxed hyphens-auto text-zinc-100 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 md:text-base"
                style={{
                  animationDelay: `${paragraphIndex * ABOUT_PARAGRAPH_STAGGER_MS}ms`,
                  animationFillMode: "both",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <footer className="mt-4 border-t border-white/20 pt-4 text-center">
            <Image
              src={ABOUT_SIGNATURE_IMAGE_SRC}
              alt={ABOUT_SIGNATURE_IMAGE_ALT}
              width={ABOUT_SIGNATURE_IMAGE_WIDTH}
              height={ABOUT_SIGNATURE_IMAGE_HEIGHT}
              className="mx-auto h-auto w-36"
            />
          </footer>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <Image
            src={buildAboutImageUrl()}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 65ch, 100vw"
            className="object-cover object-top opacity-30 brightness-75"
          />
        </div>
      </article>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 -bottom-12 z-10 hidden lg:block"
      >
        <CatLottie />
      </div>
    </section>
  );
}
