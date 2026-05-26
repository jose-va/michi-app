import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/shadcn/components/sonner";
import PageMenu from "@/common/components/layout/PageMenu";
import { UserProvider } from "@/common/components/provider/UserProvider";
import { UserService } from "@/service/UserService";
import { montserrat } from "./fonts/font";

export const metadata: Metadata = {
  title: "Michi Sushi Granada",
  description:
    "Bienvenido a Michi Sushi, tu destino para disfrutar del auténtico sushi en el corazón de Granada.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await UserService.getProfile();
  return (
    <html lang="es" className="dark" suppressHydrationWarning>  
      <body
        className={`${montserrat.className} min-h-screen bg-[url("/background_michi.webp")] antialiased backdrop-blur-xs`}
      >
        <UserProvider initialUser={user}>
          <PageMenu>{children}</PageMenu>
        </UserProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
