import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";

import Nav from "@/components/Nav";
import Script from "next/script";
import ThemeProvide from "@/app/ThemeProvider";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "김치프리미엄 김프(kimchi premium) - 김프사이트 - kimp.site",
  description:
    "김프 김치프리미엄 역프 및 암호화폐, 비트코인 시세 변동을 실시간으로 제공합니다. 김프 사이트 kimp.site",
  keywords:
    "김프, 김치프리미엄, 김프사이트, kimp, kimp.site 김프,김프가,김치프리미엄,암호화폐,가상화폐,비트코인,이더리움,비트,이더,코인,역프,재정거래,업비트,바이낸스,차트,김치프리미엄,청산,kimp,gimp,crypto,cryptocurrency,bitcoin,ethereum,btc,eth,coin,upbit,bithumb,binance,liquidation",
  openGraph: {
    title: "김치프리미엄 및 암호화폐 실시간 시세 확인, 김프사이트",
    description:
      "김프 김치프리미엄 역프 및 암호화폐, 비트코인 시세 변동을 실시간으로 제공합니다. 김프 역프 사이트 김프사이트 kimp.site",
    locale: "ko_KR",
    type: "website",
    url: "https://kimp.site",
    siteName: "김프사이트 - kimp.site",
  },
};
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
