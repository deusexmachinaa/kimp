// components/Market.tsx
import React from "react";

export default function Market() {
  return (
    <>
      <div className="flex items-center justify-center gap-10 text-center sm:w-1/2 sm:m-auto">
        <div className="relative w-full text-sm rounded-md dark:bg-neutral-800">
          <button className="w-full px-1 py-3 border border-gray-200 rounded-md dark:border-neutral-700 [&>*]:justify-center">
            <div className="flex items-center h-5 gap-2">
              {/* <img src="/images/krw.png" alt="KRW" className="w-5 h-5" /> */}
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
        <i className="absolute text-xs fa-solid fa-right-left"></i>
        <div className="relative w-full text-sm rounded-md dark:bg-neutral-800">
          <button className="w-full px-1 py-3 border border-gray-200 rounded-md dark:border-neutral-700 [&>*]:justify-center">
            <div className="flex items-center h-5 gap-2">
              {/* <img alt="binance usdt" fetchpriority="high" width="20" height="20" decoding="async" data-nimg="1" style="color:transparent" srcset="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=32&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75 2x" src="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75"> */}
              <span className="text-xs">바이낸스 USDT</span>
            </div>
          </button>
          <ul className="dark:bg-neutral-800 dark:border-neutral-700 flex flex-col gap-1 border border-gray-200 rounded-md mt-1 p-1 absolute bg-white w-full z-10 hidden">
            <li className="px-1 py-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 relative flex items-center justify-center bg-gray-200 dark:bg-neutral-700">
              <i className="absolute text-xs left-2 fa-solid fa-check"></i>
              <div className="flex items-center h-5 gap-2">
                {/* <img alt="binance usdt" fetchpriority="high" width="20" height="20" decoding="async" data-nimg="1" style="color:transparent" srcset="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=32&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75 2x" src="/_next/image?url=%2Fimages%2Fbinance.webp&amp;w=48&amp;q=75"> */}
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
      <div className="mt-4 text-right">
        <div className="relative inline-block">
          <i className="absolute -translate-y-1/2 top-1/2 fa-solid fa-magnifying-glass left-2"></i>
          <input
            placeholder="비트코인, btc"
            className="w-40 px-8 py-2 border border-gray-200 rounded-md dark:bg-neutral-800 focus:outline-none dark:border-neutral-700 sm:w-60"
            value=""
          />
        </div>
      </div>
    </>
  );
}
