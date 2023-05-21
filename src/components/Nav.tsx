import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const handleClick = () => {
    setIsRotating(true);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAnimationEnd = () => {
    setIsRotating(false);
  };

  return (
    <nav className="h-20 p-2 border-b dark:border-neutral-700">
      <div className="flex items-center justify-between h-full max-w-screen-lg m-auto ">
        <Link href={"/"} className="font-extrabold text-pink-500 sm:text-4xl">
          KIMPGG
        </Link>
        <button
          onClick={handleClick}
          onAnimationEnd={handleAnimationEnd}
          className={`text-2xl w-10 h-10 justify-center flex items-center bubble hover:bg-gray-200 hover:dark:bg-neutral-700 rounded-full p-2 ${
            isRotating ? "animate-rotate" : ""
          }`}
        >
          {theme === "dark" ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </button>
      </div>
    </nav>
  );
}
