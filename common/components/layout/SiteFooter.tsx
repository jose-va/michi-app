import Image from "next/image";
import {
  FOOTER_LEGAL,
  FOOTER_SECTIONS,
  getFooterYear,
} from "./footer-links";
import FooterContactIcons from "./FooterContactIcons";
import FooterNavLink from "./FooterNavLink";

const FOOTER_TAGLINE = "Gastronomía japonesa y tapeo.";

const FOOTER_LINK_CLASSNAME =
  "flex min-h-[44px] items-center text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const FOOTER_LEGAL_LINK_CLASSNAME =
  "flex min-h-0 items-center whitespace-nowrap px-1.5 py-1 text-[13px] leading-tight text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function SiteFooter() {
  const year = getFooterYear(new Date());

  return (
    <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-7 py-6 text-left">
        <div className="flex flex-col items-start">
          <div className="h-20">
            <Image
              src="/logos/LOGO-HOR-WHITE.webp"
              alt="Logo Michi Sushi Granada"
              width={220}
              height={80}
              className="h-20 object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-zinc-300">{FOOTER_TAGLINE}</p>
        </div>

        <div
          aria-hidden="true"
          className="w-full max-w-xs border-t border-white/10"
        />
        <nav aria-label="Secciones" className="flex flex-col items-start">
          <h2 className="text-lg font-semibold text-white">Secciones</h2>
          <ul className="mt-1 flex flex-col items-start">
            {FOOTER_SECTIONS.map((item) => (
              <li key={item.href}>
                <FooterNavLink
                  href={item.href}
                  label={item.label}
                  className={FOOTER_LINK_CLASSNAME}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div aria-hidden="true" className="w-full max-w-xs border-t border-white/10" />

        <FooterContactIcons />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <nav aria-label="Información legal" className="flex justify-start">
              <ul className="-ml-1 flex flex-wrap items-center justify-start mb-2">
                {FOOTER_LEGAL.map((item, index) => (
                  <li key={item.href} className="flex items-center leading-none">
                    <FooterNavLink
                      href={item.href}
                      label={item.label}
                      className={FOOTER_LEGAL_LINK_CLASSNAME}
                    />
                    {index < FOOTER_LEGAL.length - 1 && (
                      <span aria-hidden="true" className="mx-1 text-zinc-600">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-sm text-zinc-400">
              © {year} Michi Sushi Granada.
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-zinc-400">Desarrollador</span>
            <a
              href="https://www.linkedin.com/in/vilare/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vilare en LinkedIn (se abre en una pestaña nueva)"
              className="group flex h-14 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Image
                src="/logos/VILARE.svg"
                alt="Desarrollado por Vilare"
                width={160}
                height={64}
                className="h-14 w-auto cursor-pointer object-contain transition group-hover:brightness-125 group-hover:scale-110"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
