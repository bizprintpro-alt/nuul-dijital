import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuul.mn — Таны дижитал үүл",
  description:
    "Домэйн бүртгэл, хостинг, вэбсайт бүтээх, AI чатбот, CRM - бүгдийг нэг дороос",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cabinet antialiased">{children}</body>
    </html>
  );
}
