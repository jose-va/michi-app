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
import ProfileAuth from "./user/ProfileAuth";

const navItems = [
  { label: "Carta", href: "/product" },
  { label: "Ubicacion", href: "/location" },
  { label: "Reservar", href: "/reservation" },
];

export default function PageMenu({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="fixed z-10 flex h-17 w-full items-center justify-between border-b border-white/10 bg-black/60 px-4 shadow-md backdrop-blur-md md:px-14">
        <div className="flex-1">
          <Link href="/">
            <Image
              src="/logo_michi.webp"
              alt="Logo Michi"
              width={70}
              height={70}
              className="mt-2 cursor-pointer transition-all duration-500 hover:scale-115"
              loading="eager"
            />
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="ml-1 flex justify-center md:gap-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    href={item.href}
                    className="text-[14.5px] font-bold text-white/90 hover:text-white md:text-[15px]"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 justify-end">
          <ProfileAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pt-24">
        <TooltipProvider>{children}</TooltipProvider>
      </main>
    </>
  );
}
