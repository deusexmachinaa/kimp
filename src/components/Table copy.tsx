"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Table() {
  const [showSpan, setShowSpan] = useState(false);
  const [data, setData] = useState<CoinData[]>([]);
  const [market, setMarket] = useState<MarketData[]>([]);

  type MarketData = {
    market: string;
    korean_name: string;
    english_name: string;
  };
  type CoinData = {
    name: string;
    code: string;
    currentPrice: number;
    priceChange: string;
    tradeVolume: number;
  };

  useEffect(() => {
    fetch("https://api.upbit.com/v1/market/all")
      .then((response) => response.json())
      .then((data) => {
        const krwMarkets = data.filter((marketData: MarketData) =>
          marketData.market.startsWith("KRW-")
        );
        // krwMarkets 에는 market 값이 'KRW-'로 시작하는 코인들의 데이터만 포함됩니다.

        // 이제 krwMarkets 을 사용하여 필요한 티커를 조회할 수 있습니다.
        // ...
        setMarket((prev) => krwMarkets);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");

    // WebSocket이 연결되면 실행되는 코드
    socket.onopen = () => {
      console.log("WebSocket is connected.");

      // 업비트 웹소켓 서버에 메시지를 보내 데이터를 요청
      const codes = market.map((item) => item.market);
      socket.send(
        JSON.stringify([
          { ticket: "unique_ticket" },
          { type: "ticker", codes: codes, isOnlyRealtime: true },
        ])
      );
    };

    // WebSocket이 메시지를 받으면 실행되는 코드
    socket.onmessage = (event) => {
      const reader = new FileReader();

      reader.onload = function () {
        // Blob 데이터가 완전히 읽혀진 후에 로그를 출력합니다.
        console.log("WebSocket message received:", reader.result);
        setData(JSON.parse(reader.result as string)); // Data를 state에 저장
      };

      // Blob 데이터를 텍스트로 변환합니다.
      reader.readAsText(event.data);
    };

    // 컴포넌트가 언마운트되면 WebSocket 연결을 종료
    return () => {
      socket.close();
    };
  }, [market]);

  //주의 마크
  const toggleSpan = () => {
    setShowSpan(!showSpan);
  };
  return (
    <table className="w-full max-w-screen-lg mt-4 text-xs table-fixed sm:text-sm">
      <thead className="text-xs">
        <tr className="text-right border-b border-b-gray-500 dark:border-b-neutral-700 [&>th]:text-neutral-500">
          <th className="py-2 cursor-pointer text-left text-neutral-400 dark:text-neutral-400">
            이름
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400">
            현재가(KRW)
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th className="py-2 cursor-pointer text-right !text-black dark:!text-white">
            김프
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-black dark:text-white "></i>
            </span>
          </th>
          <th className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400">
            전일 대비
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400">
            거래액(일)
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {/* <tr className="text-right border-b-gray-200 border-b tracking-tight [&>td]:py-1 dark:border-b-neutral-700">
          <td className="text-left">
            <div className="flex items-center gap-1">
              <img
                alt="KAVA 아이콘"
                width="15"
                height="15"
                decoding="async"
                data-nimg="1"
                className="rounded-full"
                src="https://static.upbit.com/logos/KAVA.png"
              />
              <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                카바
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="inline-block text-gray-500 dark:text-gray-400">
                KAVA
              </p>
              <div className="relative">
                <i
                  className="text-yellow-400 fa-solid fa-circle-exclamation sm:hover:cursor-pointer"
                  onClick={toggleSpan}
                ></i>
                {showSpan && (
                  <span className="absolute -top-0.5 sm:top-0 block py-0.5 px-1 text-xs rounded-md py -right-20 dark:bg-neutral-700 bg-gray-200">
                    투자 유의 종목
                  </span>
                )}
              </div>
            </div>
          </td>
          <td className="flex flex-col">
            <p>2,270</p>
            <p className="text-gray-500 transition-opacity dark:text-gray-400">
              1,403
            </p>
          </td>
          <td className="text-teal-700 dark:text-teal-600">+61.81%</td>
          <td className="text-red-600 dark:text-red-500">-1.73%</td>
          <td className="flex flex-col">
            <p>186억</p>
            <p className="text-gray-500 dark:text-gray-400">155억</p>
          </td>
        </tr> */}
      </tbody>
    </table>
  );
}
