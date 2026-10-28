"use client";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shadcn/components/navigation-menu";

export const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicacion", href: "/location" },
  { label: "Conócenos", href: "/about" },
];

export default function NavLinks() {
  return (
    <NavigationMenuList className="ml-1 flex justify-center md:gap-4">
      {navItems.map((item) => (
        <NavigationMenuItem
          key={item.href}
          className={item.href === "/about" ? "hidden lg:block" : undefined}
        >
          <NavigationMenuLink
            href={item.href}
            className={`${navigationMenuTriggerStyle()} text-[14.5px] font-bold text-white/90 hover:text-white md:text-[15px]`}
          >
            {item.label}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
}