import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { FOOTER_CONTACT, FOOTER_CONTACT_TITLE } from "./footer-links";

const CONTACT_ICON_CLASSNAME =
  "group flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function ContactIcon({ icon }: { icon: string }) {
  if (icon === "phone") {
    return (
      <Phone size={22} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
    );
  }
  if (icon === "mail") {
    return (
      <Mail size={22} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
    );
  }
  if (icon === "whatsapp") {
    return (
      <Image
        src="/icons/Digital_Glyph_Green_RGB_2026.svg"
        alt=""
        width={22}
        height={22}
        className="h-[22px] w-[22px] shrink-0 transition group-hover:brightness-125"
        loading="lazy"
      />
    );
  }
  return (
    <Image
      src="/icons/Instagram_Glyph_Gradient.svg"
      alt=""
      width={22}
      height={22}
      className="h-[22px] w-[22px] shrink-0 transition group-hover:brightness-125"
      loading="lazy"
    />
  );
}

export default function FooterContactIcons() {
  return (
    <section
      aria-label={FOOTER_CONTACT_TITLE}
      className="flex flex-col items-start text-left"
    >
      <ul className="flex items-start justify-start gap-1 sm:gap-2">
        {FOOTER_CONTACT.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.label} (se abre en una pestaña nueva)`}
                className={CONTACT_ICON_CLASSNAME}
              >
                <ContactIcon icon={item.icon} />
              </a>
            ) : (
              <a
                href={item.href}
                aria-label={
                  item.display ? `${item.label}: ${item.display}` : item.label
                }
                className={CONTACT_ICON_CLASSNAME}
              >
                <ContactIcon icon={item.icon} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
