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
    <html lang="de">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
