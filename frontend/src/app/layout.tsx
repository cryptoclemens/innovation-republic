import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Innovation Republic · Startup Matchmaker",
    template: "%s · Innovation Republic",
  },
  description:
    "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum. Beschreiben Sie Ihre Herausforderung – wir finden die passenden Lösungsanbieter.",
  keywords: [
    "Startup",
    "KMU",
    "Matchmaker",
    "DACH",
    "Innovation",
    "B2B",
    "Lösungsanbieter",
    "Deutschland",
    "Österreich",
    "Schweiz",
  ],
  authors: [{ name: "Innovation Republic e.V." }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: "en_US",
    siteName: "Innovation Republic",
    title: "Innovation Republic · Startup Matchmaker",
    description:
      "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum. Beschreiben Sie Ihre Herausforderung – wir finden die passenden Lösungsanbieter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Innovation Republic · Startup Matchmaker",
    description:
      "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Innovation Republic e.V.",
              description:
                "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum",
              url: "https://innovation-republic.de",
              sameAs: [
                "https://github.com/cryptoclemens/innovation-republic",
              ],
              knowsAbout: [
                "B2B Matching",
                "Startup Ecosystem",
                "DACH Region",
                "SME Innovation",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
