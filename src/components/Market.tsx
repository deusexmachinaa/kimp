// components/Market.tsx
import Image from "next/image";
import React from "react";
import upbit from "/public/upbit.webp";
import binance from "/public/binance.webp";
import { create } from "zustand";

export type searchState = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};
// Define your store
export const useSearchStore = create<searchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
}));

export default function Market() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="relative flex items-center justify-between gap-10 mb-4 text-center sm:mb-0">
        <div className="relative w-full border border-gray-200 rounded-md dark:border-neutral-700 dark:bg-neutral-800 sm:w-40">
          <button className="w-full px-4 py-3 border border-gray-200 rounded-md dark:border-neutral-700 [&>*]:justify-center cursor-default">
            <div className="flex items-center h-5 gap-2">
              <Image alt="upbit krw" src={upbit} width={20} height={20} />
              <span className="text-xs">업비트 KRW</span>
            </div>
          </button>
          <ul className="dark:bg-neutral-800 dark:border-neutral-700 flex flex-col gap-1 border border-gray-200 rounded-md mt-1 p-1 absolute bg-white w-full z-10 hidden">
            <li className="px-1 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center bg-gray-200 dark:bg-neutral-700">
              <i className="absolute text-xs left-2 fa-solid fa-check"></i>
              <div className="flex items-center h-5 gap-2">
                {/* <img src="/images/krw.png" alt="KRW" className="w-5 h-5" /> */}
                <span className="text-xs">업비트 KRW</span>
              </div>
            </li>
            <li className="px-1 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center false">
              <div className="flex items-center h-5 gap-2">
                {/* <img src="/images/krw.png" alt="KRW" className="w-5 h-5" /> */}
                <span className="text-xs">업비트 BTC</span>
              </div>
            </li>
            <li className="px-1 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center false">
              <div className="flex items-center h-5 gap-2">
                {/* <img src="/images/krw.png" alt="KRW" className="w-5 h-5" /> */}
                <span className="text-xs">빗썸</span>
              </div>
            </li>
          </ul>
        </div>
        <i className="absolute text-xs -translate-x-1/2 fa-solid fa-right-left left-1/2"></i>
        <div className="relative w-full border border-gray-200 rounded-md dark:border-neutral-700 dark:bg-neutral-800 sm:w-40">
          <button className="w-full px-4 py-3 border border-gray-200 rounded-md dark:border-neutral-700 [&>*]:justify-center cursor-default">
            <div className="flex flex-row items-center h-5 gap-2">
              <Image alt="binance usdt" src={binance} width={20} height={20} />
              <span className="text-xs">바이낸스 USDT</span>
            </div>
          </button>
          <ul className="dark:bg-neutral-800 dark:border-neutral-700 flex flex-col gap-1 border border-gray-200 rounded-md mt-1 p-2 absolute bg-white w-full z-10 hidden">
            <li className="px-5 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center bg-gray-200 dark:bg-neutral-700">
              <i className="absolute text-xs left-2 fa-solid fa-check"></i>
              <div className="flex flex-row items-center h-5 gap-2">
                <Image
                  alt="binance usdt"
                  src={binance}
                  width={20}
                  height={20}
                />
                <span className="text-xs">바이낸스 USDT</span>
              </div>
            </li>
            <li className="px-1 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center false">
              <div className="flex items-center h-5 gap-2">
                {/* <img alt="binance busd" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" style="color:transparent" srcset="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=32&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75 2x" src="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75"> */}
                <span className="text-xs">바이낸스 BUSD</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="my-4 text-right">
        <div className="relative inline-block">
          <i className="absolute -translate-y-1/2 top-1/2 fa-solid fa-magnifying-glass left-2"></i>
          <input
            placeholder="비트코인, btc, ㅂㅌ"
            className="w-100 px-8 py-2 border border-gray-200 rounded-md dark:bg-neutral-800 focus:outline-none dark:border-neutral-700 sm:w-70"
            defaultValue=""
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
