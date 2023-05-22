"use client";
import React, { useEffect, useState } from "react";

export default function Header() {
  const [exchangeRate, setExchangeRate] = useState<number>(0);

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
