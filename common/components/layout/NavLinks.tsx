"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shadcn/components/navigation-menu";

const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Ubicacion", href: "/location" },
  { label: "Reservar", href: "/reservation" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <NavigationMenuList className="ml-1 flex justify-center md:gap-4">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink
            asChild
            active={pathname === item.href}
            className={`${navigationMenuTriggerStyle()} text-[14.5px] font-bold text-white/90 hover:text-white md:text-[15px]`}
          >
            <Link href={item.href}>{item.label}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
}