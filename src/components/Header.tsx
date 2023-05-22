"use client";
import React, { useEffect } from "react";
import { create } from "zustand";

export type exchangeState = {
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
};
// Define your store
export const useStore = create<exchangeState>((set) => ({
  exchangeRate: 0,
  setExchangeRate: (rate: number) => set({ exchangeRate: rate }),
}));

export default function Header() {
  const exchangeRate = useStore((state) => state.exchangeRate);
  const setExchangeRate = useStore((state) => state.setExchangeRate);

  useEffect(() => {
    fetch(
      "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD"
    )
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data[0].basePrice);
      });
  }, []);
  return (
    <header className="p-2 border-b dark:border-neutral-700">
      <div className="w-full max-w-screen-lg m-auto text-xs">
        {/* TODO: Fetch and display the current exchange rate */}
        <span>
          환율(USD/KRW) <b>{exchangeRate}</b>
        </span>
      </div>
    </header>
  );
}
