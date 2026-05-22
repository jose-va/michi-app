import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shadcn/components/navigation-menu";
import { TooltipProvider } from "@/shadcn/components/tooltip";
import UserMenu from "./UserMenu";

const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicación", href: "/location" },
];

export default function PageMenu({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="fixed z-10 flex h-16 w-full items-center border-white/10 bg-black/40 px-6 shadow-2xl backdrop-blur-md">
        <Link href="/">
          <Image
            src="/logo_michi.webp"
            alt="Logo Michi"
            width={70}
            height={70}
            className="mt-2 mr-2 cursor-pointer transition-all duration-500 hover:scale-115"
            loading="eager"
          />
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="ml-auto flex justify-center gap-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    href={item.href}
                    className="text-[15px] font-bold text-white/90 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <UserMenu />
      </header>

      <main className="flex-1 px-14 pb-8">
        <div className="pt-16">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </main>
    </>
  );
}
