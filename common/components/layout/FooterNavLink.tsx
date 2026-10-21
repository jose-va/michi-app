"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentFooterLink } from "./footer-links";

interface FooterNavLinkProps {
  href: string;
  label: string;
  className: string;
}

export default function FooterNavLink({
  href,
  label,
  className,
}: FooterNavLinkProps) {
  const pathname = usePathname();
  const isCurrent = isCurrentFooterLink(href, pathname);

  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
