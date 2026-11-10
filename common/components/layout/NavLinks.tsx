"use client";
import { usePathname } from "next/navigation";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shadcn/components/navigation-menu";
import { cabinetGrotesk } from "@/app/fonts/font";

export const navItems: { label: string; href: string; className?: string }[] = [
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicación", href: "/location", className: "hidden min-[440px]:block" },
  { label: "Conócenos", href: "/about", className: "hidden lg:block" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <NavigationMenuList className="flex justify-center gap-1 md:gap-10">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <NavigationMenuItem key={item.href} className={item.className}>
            <NavigationMenuLink
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`${cabinetGrotesk.className} sake-underline relative inline-flex items-center px-2 py-2 text-sm font-medium tracking-[0.08em] text-white/90 uppercase transition-colors outline-none hover:bg-transparent hover:text-white focus:bg-transparent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 ${isActive ? "sake-underline-on text-white" : ""}`}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  );
}