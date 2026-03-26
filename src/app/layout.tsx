import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "情绪管理与智能坐垫干预系统",
  description: "基于智能坐垫的情绪健康监测与干预平台，提供实时心率监测、情绪分析、健康报告等功能。",
  keywords: ["智能坐垫", "情绪管理", "健康监测", "心率监测", "压力管理", "中医体质"],
  authors: [{ name: "Emotion Health Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "情绪管理与智能坐垫干预系统",
    description: "基于智能坐垫的情绪健康监测与干预平台",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
