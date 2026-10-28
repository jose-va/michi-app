import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
} from "@/shadcn/components/navigation-menu";
import { TooltipProvider } from "@/shadcn/components/tooltip";
import ProfileAuth from "./user/ProfileAuth";
import AdminProfileTabs from "./user/AdminProfileTabs";
import UserProfileTabs from "./user/UserProfileTabs";
import type { User } from "@/common/types/user.types";
import NavLinks from "./NavLinks";
import SiteFooter from "./SiteFooter";

export default function PageMenu({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed z-10 flex h-17 w-full items-center justify-between border-b border-white/10 bg-black/60 px-4 shadow-md backdrop-blur-md md:px-14">
        <div className="flex-1">
          <Link href="/">
            <Image
              src="/logos/logo_michi.webp"
              alt="Logo Michi"
              width={80}
              height={80}
              className="mt-2 cursor-pointer transition-all duration-500 hover:scale-115"
              loading="eager"
            />
          </Link>
        </div>

        <NavigationMenu>
          <NavLinks />
        </NavigationMenu>

        <div className="flex flex-1 justify-end">
          <ProfileAuth
            profileTabs={
              user === null ? null : user.role === "ROLE_USER" ? (
                <UserProfileTabs user={user} />
              ) : (
                <AdminProfileTabs user={user} />
              )
            }
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-24 pb-12">
        <TooltipProvider>{children}</TooltipProvider>
      </main>

      <SiteFooter />
    </div>
  );
}
