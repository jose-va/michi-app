"use client";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shadcn/components/navigation-menu";
import { geistSans } from "@/app/fonts/font";

export const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicación", href: "/location" },
  { label: "Conócenos", href: "/about" },
];

export default function NavLinks() {
  return (
    <NavigationMenuList className="flex justify-center md:gap-6">
      {navItems.map((item) => (
        <NavigationMenuItem
          key={item.href}
          className={item.href === "/about" ? "hidden lg:block" : undefined}
        >
          <NavigationMenuLink
            href={item.href}
            className={`${geistSans.className} ${navigationMenuTriggerStyle()} text-sm font-medium uppercase tracking-wide text-white/90 hover:text-white`}
          >
            {item.label}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
}