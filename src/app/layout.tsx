import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { themeInitScript } from "@/components/theme/theme-init";
import "./globals.css";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "A-Inman Languages | Idiomas que conectan oportunidades",
    template: "%s | A-Inman Languages",
  },
  description:
    "Academia virtual de inglés, portugués y español para extranjeros. Clases personalizadas, grupos reducidos, preparación para certificaciones y servicios de traducción e interpretación.",
  metadataBase: new URL("https://a-inman-languages.local"),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/brand/ail-isotype-dark.png" }],
  },
  openGraph: {
    title: "A-Inman Languages",
    description: "Idiomas que conectan oportunidades. Clases 100% online.",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <Script
          id="ail-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript() }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
