"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Market from "@/components/Market";
import Nav from "@/components/Nav";
import Table from "@/components/Table";
import Script from "next/script";
import React from "react";

export default function HomePage() {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390086553135895"
        crossOrigin="anonymous"
      />
      <Header />
      <Nav />
      <article className="max-w-screen-lg min-h-screen px-2 py-4 m-auto">
        {/* TODO: Add more markets */}
        <Market />
        <Table />
      </article>
      <Footer />
    </>
  );
}
