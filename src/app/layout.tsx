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
      <body className={inter.className}>
        <ThemeProvide>{children}</ThemeProvide>
      </body>
    </html>
  );
}
