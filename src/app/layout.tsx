import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Comercial del Motor — Distribución de Piezas de Motor desde 1951",
    template: "%s | Comercial del Motor",
  },
  description:
    "Líderes en distribución de piezas de motor con más de 130.000 referencias. Pistones, cigüeñales, turbos, kits de distribución y mucho más. 11 almacenes en España.",
  keywords: ["piezas de motor", "recambios motor", "pistones", "cigüeñales", "turbos", "distribución"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    siteName: "Comercial del Motor",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';if(t==='dark')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="antialiased bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F0F0F0] transition-colors duration-200">
        <LanguageProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
