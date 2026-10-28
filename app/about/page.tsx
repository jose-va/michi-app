import Image from "next/image";
import { montserrat,  centuryGothic} from "@/app/fonts/font";
import FadeInLetters from "@/common/components/FadeInLetters";
import CatLottie from "@/common/components/CatLottie";
import {
  ABOUT_KANJI,
  ABOUT_SIGNATURE,
  ABOUT_SIGNATURE_IMAGE_ALT,
  ABOUT_SIGNATURE_IMAGE_HEIGHT,
  ABOUT_SIGNATURE_IMAGE_SRC,
  ABOUT_SIGNATURE_IMAGE_WIDTH,
  ABOUT_TITLE,
  buildAboutImageUrl,
  getAboutParagraphs,
} from "@/common/utils/about-content";

export default function AboutPage() {
  const paragraphBaseIndexes: number[] = [];
  let runningChars = ABOUT_TITLE.length;
  for (const paragraph of getAboutParagraphs()) {
    paragraphBaseIndexes.push(runningChars);
    runningChars += paragraph.length;
  }
  
  return (
    <section className="relative px-0 pt-7 pb-4 md:py-10 lg:pb-28">
      <article
        lang="es"
        className={`${montserrat.className} relative mx-auto w-full max-w-prose overflow-hidden rounded-lg border border-white/10 bg-black/80 text-zinc-100 shadow-lg backdrop-blur-md`}
      >
        <div className="relative p-5 md:p-8">
          <header className="mb-4 flex items-center justify-between gap-4 border-b border-white/20 pb-4">
            <h1
              className={`${centuryGothic.className} text-xl font-normal tracking-[0.2em] uppercase md:text-3xl`}
            >
              <FadeInLetters text={ABOUT_TITLE} baseIndex={0} />
            </h1>
            <span
              aria-hidden="true"
              className={`${centuryGothic.className} text-3xl md:text-4xl`}
            >
              {ABOUT_KANJI}
            </span>
          </header>
          <div className="flex flex-col gap-4">
            {getAboutParagraphs().map((paragraph, paragraphIndex) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-justify hyphens-auto text-zinc-200 md:text-base"
              >
                <FadeInLetters
                  text={paragraph}
                  baseIndex={paragraphBaseIndexes[paragraphIndex] ?? 0}
                />
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
            <p className="mt-2 text-sm tracking-wide text-zinc-100 italic md:text-base">

            </p>
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
            className="object-cover object-top opacity-30 brightness-80"
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
