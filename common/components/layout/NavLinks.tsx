"use client";
import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuList,
} from "@/shadcn/components/navigation-menu";

const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Ubicacion", href: "/location" },
  { label: "Reservar", href: "/reservation" },
];

export default function NavLinks() {

  return (
    <NavigationMenuList className="ml-1 flex justify-center md:gap-4">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link
            href={item.href}
            className="text-[14.5px] font-bold text-white/90 hover:text-white md:text-[15px]"
          >
            {item.label}
          </Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
}