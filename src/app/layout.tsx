import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";

import Nav from "@/components/Nav";
import Script from "next/script";
import ThemeProvide from "@/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390086553135895"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <body className={inter.className}>
        <ThemeProvide>{children}</ThemeProvide>
      </body>
    </html>
  );
}
