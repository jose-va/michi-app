import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shadcn/components/sonner";
import PageMenu from "@/common/components/layout/PageMenu";
import { AuthProvider } from "@/common/components/provider/AuthProvider";
import { cookies } from 'next/headers';
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Michi Sushi Granada",
  description:
    "Bienvenido a Michi Sushi, tu destino para disfrutar del auténtico sushi en el corazón de Granada.",
};

async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tu_cookie_http_only')?.value;

  if (!token) return null;

  const res = await fetch('https://api.tusitio.com/auth/me', {
    headers: { Cookie: `tu_cookie_http_only=${token}` },
  });
  return res.ok ? res.json() : null;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${montserrat.className} min-h-screen bg-[url("/background_michi.webp")] antialiased backdrop-blur-xs`}
      >
          <AuthProvider initialUser={user}>
            <PageMenu>{children}</PageMenu>
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
