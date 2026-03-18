import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovation Republic · Startup Matchmaker",
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
  ],
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
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
