import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lec-infra | インフラエンジニアのためのツール集",
  description:
    "SRE・インフラエンジニアの実務に役立つ計算機や便利ツールをまとめたサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}
      >
        <ThemeProvider>
          {/* 上部にヘッダー */}
          <Header />

          {/* メインコンテンツ（各ページの中身がここに入る） */}
          <main className="flex-grow">{children}</main>

          {/* 最下部にフッター */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
