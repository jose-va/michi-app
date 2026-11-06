import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/shadcn/components/sonner";
import PageMenu from "@/common/components/layout/PageMenu";
import { UserProvider } from "@/common/components/provider/UserProvider";
import ServiceWorkerRegister from "@/common/components/pwa/ServiceWorkerRegister";
import { UserService } from "@/service/UserService";
import { montserrat } from "./fonts/font";

export const metadata: Metadata = {
  metadataBase: new URL("https://michisushigranada.es"),
  title: {
    default: "Michi Sushi Granada | Sushi y tapeo japonés",
    template: "%s | Michi Sushi Granada",
  },
  description:
    "Sushi y tapeo japonés en Granada. Consulta la carta, pide a domicilio y reserva tu mesa online en Michi Sushi.",
  openGraph: {
    title: "Michi Sushi Granada",
    description:
      "Sushi y tapeo japonés en Granada. Consulta la carta, pide a domicilio y reserva tu mesa online en Michi Sushi.",
    siteName: "Michi Sushi Granada",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Michi Sushi Granada",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "16x16 32x32 48x48",
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
        <div
  aria-hidden="true"
  className="pointer-events-none fixed top-0 left-0 -z-10 h-lvh w-screen scale-105 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(12,10,9,0.45)_100%),url('/background/background_michi.webp')] bg-cover bg-center blur-[5px] brightness-80"
/>
        <UserProvider initialUser={user}>
          <ServiceWorkerRegister />
          <PageMenu user={user}>{children}</PageMenu>
        </UserProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
