"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Table() {
  const [showSpan, setShowSpan] = useState(false);
  const [market, setMarket] = useState<MarketData[]>([]);
  const [tableData, setTableData] = useState<tableData[]>([]);

  type MarketData = {
    market: string;
    korean_name: string;
    english_name: string;
  };
  type tableData = {
    name: string; //한국이름
    code: string; //코드
    currentPrice: number; //현재가
    prev_closing_price: number; //이전 종가
    tradeVolume: number; // 거래량
  };

  type ApiResponseType = {
    market: string;
    trade_date: string;
    trade_time: string;
    trade_date_kst: string;
    trade_time_kst: string;
    trade_timestamp: number;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    prev_closing_price: number;
    change: string;
    change_price: number;
    change_rate: number;
    signed_change_price: number;
    signed_change_rate: number;
    trade_volume: number;
    acc_trade_price: number;
    acc_trade_price_24h: number;
    acc_trade_volume: number;
    acc_trade_volume_24h: number;
    highest_52_week_price: number;
    highest_52_week_date: string;
    lowest_52_week_price: number;
    lowest_52_week_date: string;
    timestamp: number;
  };

  useEffect(() => {
    // 초기 데이터 로드
    const fetchData = async () => {
      try {
        const response1 = await fetch("https://api.upbit.com/v1/market/all");
        const fetchedData1 = await response1.json();
        const krwMarkets = fetchedData1.filter((marketData: MarketData) =>
          marketData.market.startsWith("KRW-")
        );
        setMarket((prev) => krwMarkets);
        console.log(krwMarkets);

        // 첫 번째 fetch가 완료된 후에 실행됩니다.
        const query = krwMarkets.map((item: MarketData) => item.market);
        const response2 = await fetch(
          "https://api.upbit.com/v1/ticker?markets=" + query
        );
        const fetchedData2: ApiResponseType[] = await response2.json();
        let tableDataArr: tableData[] = [];

        fetchedData2.forEach((data: ApiResponseType) => {
          let marketData = krwMarkets.find(
            (market: MarketData) => market.market === data.market
          );

          if (marketData) {
            let newData: tableData = {
              name: marketData.korean_name,
              code: data.market.split("-")[1],
              currentPrice: data.trade_price,
              prev_closing_price: data.prev_closing_price,
              tradeVolume: data.acc_trade_price_24h,
            };

            tableDataArr.push(newData);
          }
        });
        console.log(tableDataArr);

        setTableData(tableDataArr);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    console.log(tableData);
  }, []);

  // useEffect(() => {
  //   // WebSocket 연결 및 실시간 업데이트
  //   const socket = new WebSocket("wss://api.upbit.com/websocket/v1");

  //   socket.onopen = () => {
  //     // 업데이트를 원하는 티커들의 코드를 배열로 전달합니다.
  //     socket.send(
  //       JSON.stringify([
  //         { ticket: "unique_ticket" },
  //         {
  //           type: "ticker",
  //           codes: market.map((item) => item.market),
  //           isOnlyRealtime: true,
  //         },
  //       ])
  //     );
  //   };

  //   socket.onmessage = (event) => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const newData = JSON.parse(reader.result as string);

  //       // setData((prevData) => {
  //       //   const updatedData = [...prevData]; // 이전 데이터를 복사

  //       //   // newData에 따라 updatedData를 업데이트하는 로직을 작성해야 합니다.
  //       //   // newData의 'code' 필드를 사용하여 updatedData에서 해당 티커를 찾고, 찾은 티커의 정보를 newData로 업데이트하면 됩니다.

  //       //   return updatedData; // 업데이트된 데이터를 state로 설정
  //       // });
  //     };

  //     reader.readAsText(event.data);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [market]);

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
        {tableData.map((data, index) => (
          <tr
            key={index}
            className="text-right border-b-gray-200 border-b tracking-tight [&>td]:py-1 dark:border-b-neutral-700"
          >
            <td className="text-left">
              <div className="flex items-center gap-1">
                <img
                  alt={`${data.code} 아이콘`}
                  width="15"
                  height="15"
                  decoding="async"
                  data-nimg="1"
                  className="rounded-full"
                  src={`https://static.upbit.com/logos/${data.code}.png`}
                />
                <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                  {data.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p className="inline-block text-gray-500 dark:text-gray-400">
                  {data.code}
                </p>
                {/* <div className="relative">
                  <i
                    className="text-yellow-400 fa-solid fa-circle-exclamation sm:hover:cursor-pointer"
                    onClick={toggleSpan}
                  ></i>
                  {showSpan && (
                    <span className="absolute -top-0.5 sm:top-0 block py-0.5 px-1 text-xs rounded-md py -right-20 dark:bg-neutral-700 bg-gray-200">
                      투자 유의 종목
                    </span>
                  )}
                </div> */}
              </div>
            </td>
            <td className="flex flex-col">
              <p>{data.currentPrice.toLocaleString()}</p>
              <p className="text-gray-500 transition-opacity dark:text-gray-400">
                {/* 여기에 이전 가격 또는 다른 정보를 넣을 수 있습니다. */}
              </p>
            </td>
            <td className="text-teal-700 dark:text-teal-600">
              {/* 김프 정보를 제공하는 API 또는 알고리즘이 필요합니다. */}
            </td>
            <td
              className={
                (data.currentPrice - data.prev_closing_price) /
                  data.prev_closing_price >
                0
                  ? "text-red-600 dark:text-red-500"
                  : "text-green-600 dark:text-green-500"
              }
            >
              {(
                ((data.currentPrice - data.prev_closing_price) /
                  data.prev_closing_price) *
                100
              ).toFixed(2)}
              %
            </td>
            <td className="flex flex-col">
              <p title={`${data.tradeVolume.toLocaleString()}원`}>
                {(data.tradeVolume / 100000000).toFixed(2)}억
              </p>
              <p className="text-gray-500 transition-opacity dark:text-gray-400">
                {/* 여기에 이전 거래량 또는 다른 정보를 넣을 수 있습니다. */}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
