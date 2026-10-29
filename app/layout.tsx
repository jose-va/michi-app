import type { Metadata, Viewport } from "next";
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
  icons: {
    icon: [
      {
        url: "/logos/logo_michi.webp",
        type: "image/webp",
      },
    ],
    apple: "/icons/apple-touch-icon-180.png",
  },
  appleWebApp: {
    capable: true,
    title: "Michi Sushi",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#100d0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await UserService.getProfile();
  return (
    <html lang="es" className="dark" suppressHydrationWarning>  
      <body
        className={`${montserrat.className} min-h-screen bg-[#100d0b] antialiased`}
      >
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 scale-105 bg-[url('/background/background_michi.webp')] bg-cover bg-center blur-xs brightness-80" />
        <UserProvider initialUser={user}>
          <PageMenu user={user}>{children}</PageMenu>
        </UserProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
