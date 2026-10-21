import Image from "next/image";
import {
  FOOTER_LEGAL,
  FOOTER_SCHEDULE,
  FOOTER_SCHEDULE_EMPTY_TEXT,
  FOOTER_SECTIONS,
  getFooterYear,
} from "./footer-links";
import FooterNavLink from "./FooterNavLink";

const FOOTER_TAGLINE = "Gastronomía japonesa y tapeo en el norte de granada.";

const FOOTER_LINK_CLASSNAME =
  "flex min-h-[44px] items-center text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function SiteFooter() {
  const year = getFooterYear(new Date());

  return (
    <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-7 py-12 md:grid md:grid-cols-4 md:gap-8">
        <div>
          <div className="h-20">
            <Image
              src="/logos/LOGO-HOR-WHITE_1.webp"
              alt="Logo Michi Sushi Granada"
              width={220}
              height={80}
              className="h-20 object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-zinc-300">{FOOTER_TAGLINE}</p>
        </div>

        <nav aria-label="Secciones">
          <h2 className="text-lg font-semibold text-white">Secciones</h2>
          <ul className="mt-2 flex flex-col">
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

        <nav aria-label="Información legal">
          <h2 className="text-lg font-semibold text-white">
            Información legal
          </h2>
          <ul className="mt-2 flex flex-col">
            {FOOTER_LEGAL.map((item) => (
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

        <section aria-label={FOOTER_SCHEDULE.title}>
          <h2 className="text-lg font-semibold text-white">
            {FOOTER_SCHEDULE.title}
          </h2>
          {FOOTER_SCHEDULE.rows.length === 0 ? (
            <p className="mt-2 text-zinc-300">{FOOTER_SCHEDULE_EMPTY_TEXT}</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {FOOTER_SCHEDULE.rows.map((row) => (
                <li key={row.days} className="flex flex-col gap-1">
                  <span className="font-medium text-zinc-200">
                    {row.days}
                  </span>
                  <span className="text-primary">{row.hours}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-400">
            © {year} Michi Sushi Granada. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-0">
            <span className="text-sm text-zinc-400">Diseñado por</span>
            <div className="h-[64px] w-[160px]">
              <Image
                src="/logos/LOGO-VILARE.webp"
                alt="Desarrollado por Vilare"
                width={160}
                height={64}
                className="h-[64px] w-[160px] object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
