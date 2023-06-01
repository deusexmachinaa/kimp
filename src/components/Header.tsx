"use client";
import { AuthContext } from "@/app/AuthProvider";
import { updateProfile } from "firebase/auth";
import { useTheme } from "next-themes";
import React, { useContext, useEffect, useState } from "react";
import { create } from "zustand";

export type exchangeState = {
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
};
// Define your store
export const useExchangeStore = create<exchangeState>((set) => ({
  exchangeRate: 0,
  setExchangeRate: (rate: number) => set({ exchangeRate: rate }),
}));

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [nickname, setNickname] = useState("");
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  const handleClick = () => {
    setIsRotating(true);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAnimationEnd = () => {
    setIsRotating(false);
  };
  const exchangeRate = useExchangeStore((state) => state.exchangeRate);
  const setExchangeRate = useExchangeStore((state) => state.setExchangeRate);

  useEffect(() => {
    setNickname(currentUser?.displayName || "");
  }, [currentUser]);

  useEffect(() => {
    fetch(
      "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD"
    )
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data[0].basePrice);
      });
  }, []);
  // 닉네임 업데이트 함수
  const updateNickname = async () => {
    const newNickname = prompt("변경할 닉네임을 입력해주세요");
    if (newNickname) {
      try {
        await updateProfile(authContext?.currentUser!, {
          displayName: newNickname,
        });
        setNickname(newNickname);
      } catch (error) {
        console.error("Error updating nickname:", error);
      }
    }
  };
  return (
    <header className="p-2 border-b dark:border-neutral-700 ">
      <div className="w-full max-w-screen-lg m-auto text-xs flex items-center justify-between">
        {/* TODO: Fetch and display the current exchange rate */}
        <span>
          환율(USD/KRW) <b>{exchangeRate}</b>
        </span>
        <div className="flex">
          <span
            className="text-sm text-primary cursor-pointer underline whitespace-nowrap overflow-ellipsis overflow-x-hidden mx-3"
            title="닉네임 변경하려면 클릭하세요"
            onClick={updateNickname}
          >
            {nickname}
          </span>
          <button
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            className={`text-xl w-5 h-5 justify-center flex items-center bubble hover:bg-gray-200 hover:dark:bg-neutral-700 rounded-full p-2 ${
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
      </div>
    </header>
  );
}
