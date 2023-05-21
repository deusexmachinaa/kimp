"use client";
import React from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="p-2 border-b dark:border-neutral-700">
      <div className="w-full max-w-screen-lg m-auto text-xs">
        {/* TODO: Fetch and display the current exchange rate */}
        <span>
          환율(USD/KRW) <b>1328.5</b>
        </span>
      </div>
    </header>
  );
}
