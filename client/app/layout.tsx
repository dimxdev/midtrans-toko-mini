import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toko Mini",
  description: "Belajar integrasi payment gateway Midtrans dengan Next.js & NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-300 items-center justify-between px-4 py-4 sm:px-8">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Toko Mini
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-jet">
              <Link href="/" className="hover:text-ink">
                Produk
              </Link>
              <Link href="/orders" className="hover:text-ink">
                Riwayat Pesanan
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
