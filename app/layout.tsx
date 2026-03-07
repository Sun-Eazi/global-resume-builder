import type { Metadata, Viewport } from "next";
import brand from "@/config/brand";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: brand.seo.defaultTitle,
    template: brand.seo.titleTemplate,
  },
  description: brand.seo.defaultDescription,
  keywords: [...brand.seo.keywords],
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
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
