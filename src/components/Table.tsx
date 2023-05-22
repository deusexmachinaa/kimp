"use client";
import { ApiResponseType, MarketData, tableData } from "@/app/types";
import { useEffect, useRef, useState } from "react";

export default function Table() {
  const [showSpan, setShowSpan] = useState(false);
  const [market, setMarket] = useState<MarketData[]>([]);
  const [upbitTableData, setUpbitTableData] = useState<tableData[]>([]);
  const [priceUpdated, setPriceUpdated] = useState(
    Array(upbitTableData.length).fill(false)
  );
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState(true);
  const sortedRef = useRef(false);
  const [search, setSearch] = useState("");

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
        // console.log(krwMarkets);

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
              signed_change_rate: data.signed_change_rate,
              tradeVolume: data.acc_trade_price_24h,
            };

            tableDataArr.push(newData);
          }
        });
        // console.log(tableDataArr);

        setUpbitTableData(tableDataArr);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // console.log(upbitTableData);
  }, []);

  useEffect(() => {
    // WebSocket 연결 및 실시간 업데이트
    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");

    socket.onopen = () => {
      // 업데이트를 원하는 티커들의 코드를 배열로 전달합니다.
      socket.send(
        JSON.stringify([
          { ticket: "unique_ticket" },
          {
            type: "ticker",
            codes: market.map((item) => item.market),
            isOnlyRealtime: true,
          },
        ])
      );
    };

    socket.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newData = JSON.parse(reader.result as string);

        setUpbitTableData((prevData) => {
          const updatedData = [...prevData];
          const indexToUpdate = updatedData.findIndex(
            (data) => "KRW-" + data.code === newData.code
          );

          if (indexToUpdate !== -1) {
            // Check if price has updated
            const priceHasUpdated =
              updatedData[indexToUpdate].currentPrice !== newData.trade_price;

            updatedData[indexToUpdate] = {
              ...updatedData[indexToUpdate],
              currentPrice: newData.trade_price,
              signed_change_rate: newData.signed_change_rate,
              tradeVolume: newData.acc_trade_price_24h,
            };

            if (priceHasUpdated) {
              // Set the priceUpdated state for this item to true
              setPriceUpdated((prev) => {
                const newPriceUpdated = [...prev];
                newPriceUpdated[indexToUpdate] = true;
                return newPriceUpdated;
              });

              // After 1 second, set the priceUpdated state for this item back to false
              setTimeout(() => {
                setPriceUpdated((prev) => {
                  const newPriceUpdated = [...prev];
                  newPriceUpdated[indexToUpdate] = false;
                  return newPriceUpdated;
                });
              }, 1000);

              if (!sortedRef.current) {
                const itemToUpdate = updatedData.splice(indexToUpdate, 1)[0];
                updatedData.unshift(itemToUpdate);
              }
            }
          }

          return updatedData;
        });
      };
      reader.readAsText(event.data);
    };

    return () => {
      socket.close();
      console.log("socket closed");
    };
  }, [market]);

  // 정렬 기능
  const sortData = (field: keyof tableData) => {
    let newOrder = order;

    if (sortBy === field) {
      newOrder = !order;
      setOrder(newOrder);
    } else {
      setSortBy(field);
      setOrder(true);
      newOrder = true;
    }

    setUpbitTableData((prev) =>
      [...prev].sort((a, b) => {
        if (typeof a[field] === "number" && typeof b[field] === "number") {
          return newOrder
            ? (a[field] as number) - (b[field] as number)
            : (b[field] as number) - (a[field] as number);
        }
        if (typeof a[field] === "string" && typeof b[field] === "string") {
          return newOrder
            ? (a[field] as string).localeCompare(b[field] as string)
            : (b[field] as string).localeCompare(a[field] as string);
        }
        return 0;
      })
    );
    sortedRef.current = true;
  };

  //주의 마크 span
  const toggleSpan = () => {
    setShowSpan(!showSpan);
  };

  return (
    <table className="w-full max-w-screen-lg mt-4 text-xs table-fixed sm:text-sm">
      <thead className="text-xs">
        <tr className="text-right border-b border-b-gray-500 dark:border-b-neutral-700 [&>th]:text-neutral-500">
          <th
            className="py-2 cursor-pointer text-left text-neutral-400 dark:text-neutral-400 select-none"
            onClick={() => sortData("name")}
          >
            이름
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th
            className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400 select-none"
            onClick={() => sortData("currentPrice")}
          >
            현재가(KRW)
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th className="py-2 cursor-pointer text-right !text-black dark:!text-white select-none">
            김프
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-black dark:text-white "></i>
            </span>
          </th>
          <th
            className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400 select-none"
            onClick={() => sortData("signed_change_rate")}
          >
            전일 대비
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th
            className="py-2 cursor-pointer text-right text-neutral-400 dark:text-neutral-400 select-none"
            onClick={() => sortData("tradeVolume")}
          >
            거래액(일)
            <span className="ml-1 text-[10px] relative ">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {upbitTableData.map((data, index) => (
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
              <p className={`${priceUpdated[index] ? "updated" : ""}`}>
                {data.currentPrice.toLocaleString()}
              </p>
              <p className="text-gray-500 transition-opacity dark:text-gray-400">
                {/* 여기에 이전 가격 또는 다른 정보를 넣을 수 있습니다. */}
              </p>
            </td>
            <td className="text-teal-700 dark:text-teal-600">
              {/* 김프 정보를 제공하는 API 또는 알고리즘이 필요합니다. */}
            </td>
            <td
              className={
                data.signed_change_rate > 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-green-600 dark:text-green-500"
              }
            >
              {(data.signed_change_rate * 100).toFixed(2)}%
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
