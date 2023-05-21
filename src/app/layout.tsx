"use client";
import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/Nav";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <Nav />
          {children}
        </ThemeProvider>
        <Script
          src="https://kit.fontawesome.com/110e54d917.js"
          data-nscript="afterInteractive"
        />
      </body>
    </html>
  );
}
