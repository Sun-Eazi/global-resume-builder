import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import brand from "@/config/brand";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.seo.defaultTitle,
    template: brand.seo.titleTemplate,
  },
  description: brand.seo.defaultDescription,
  keywords: brand.seo.keywords,
  authors: [{ name: brand.companyName }],
  creator: brand.companyName,
  metadataBase: new URL(brand.companyWebsite),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brand.companyWebsite,
    title: brand.seo.defaultTitle,
    description: brand.seo.defaultDescription,
    siteName: brand.appName,
    images: [{ url: brand.seo.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.seo.defaultTitle,
    description: brand.seo.defaultDescription,
    images: [brand.seo.ogImage],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.appName,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-dm-sans bg-[#0B0E1A] text-white antialiased">
        {children}
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(console.error);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
