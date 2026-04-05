import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuul.mn — Таны дижитал үүл",
  description: "Домэйн, хостинг, вэбсайт, AI чатбот, CRM - Монголын бизнесийн иж бүрэн дижитал платформ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-dm antialiased">{children}</body>
    </html>
  );
}
