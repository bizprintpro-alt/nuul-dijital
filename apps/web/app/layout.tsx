import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuul.mn - Дижитал шийдэл",
  description:
    "Домэйн бүртгэл, хостинг, вэбсайт бүтээх - бүгдийг нэг дороос",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="antialiased">{children}</body>
    </html>
  );
}
