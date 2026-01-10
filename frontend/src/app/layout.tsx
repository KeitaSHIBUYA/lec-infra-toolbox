import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// サイトのベースURL（本番環境に合わせて変更してください）
const siteUrl = "https://lec-infra.com";

export const metadata: Metadata = {
  title: "lec-infra | インフラエンジニアのためのツール集",
  description:
    "SRE・インフラエンジニアの実務に役立つ計算機や便利ツールをまとめたサイトです。",
  keywords: [
    "SRE",
    "インフラエンジニア",
    "ツール",
    "GCP",
    "コスト計算",
    "CIDR",
    "サブネット",
    "Cron",
  ],
  authors: [{ name: "Keita SHIBUYA" }],
  creator: "Keita SHIBUYA",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "lec-infra",
    title: "lec-infra | インフラエンジニアのためのツール集",
    description:
      "SRE・インフラエンジニアの実務に役立つ計算機や便利ツールをまとめたサイトです。Google Cloud コスト計算、CIDR / サブネット計算など。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "lec-infra Toolbox - SRE・インフラエンジニアのためのツール集",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lec-infra | インフラエンジニアのためのツール集",
    description:
      "SRE・インフラエンジニアの実務に役立つ計算機や便利ツールをまとめたサイトです。",
    images: ["/og-image.png"],
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
    <html lang="ja" className="h-full" suppressHydrationWarning>
      <head>
        {/* Google AdSense*/}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3621315317489637"
          crossOrigin="anonymous"
        ></script>
      </head>
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
