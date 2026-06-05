import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rah-MART",
  description: "Platform katalog digital produk & jasa profesional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
