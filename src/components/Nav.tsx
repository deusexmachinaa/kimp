"use client";
import { useCallback } from "react";
import Link from "next/link";
import Script from "next/script";

export default function Nav() {
  const handleMouseOver = useCallback((event: React.MouseEvent) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval: NodeJS.Timeout | null = null;
    let iteration = 0;

    interval = setInterval(() => {
      const titleElement = event.target as HTMLElement;

      titleElement.innerText = titleElement.innerText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return titleElement.getAttribute("data-value")?.[index] || "";
          }

          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= (titleElement.getAttribute("data-value") || "").length) {
        clearInterval(interval as NodeJS.Timeout);
      }

      iteration += 1 / 3;
    }, 30);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <nav className="h-20 p-2 border-b dark:border-neutral-700">
      <Script
        src="https://kit.fontawesome.com/110e54d917.js"
        data-nscript="afterInteractive"
      />
      <div className="flex items-center justify-between h-full max-w-screen-lg m-auto ">
        <Link
          href={"/"}
          onMouseOver={handleMouseOver}
          data-value="KIMP.SITE"
          className="font-extrabold text-pink-500 sm:text-4xl"
        >
          KIMP.SITE
        </Link>
      </div>
    </nav>
  );
}
