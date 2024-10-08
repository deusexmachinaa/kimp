"use client";
import {
  upbitWebSocketResponseType,
  BinancePriceData,
  MarketData,
  tableData,
} from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { useExchangeStore, useOptionsStore } from "./Header";
import { useSearchStore } from "./Market";
import getChosungs from "./chosung";

// WebSocket hook with type support
function useWebSocket(url: string, market: MarketData[], updateTableData: (data: upbitWebSocketResponseType) => void) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retries = 0;

    const connectWebSocket = () => {
      ws = new WebSocket(url);
      console.log("WebSocket connecting...");

      ws.onopen = () => {
        console.log("WebSocket connected");
        retries = 0;
        ws?.send(
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

      ws.onmessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newData: upbitWebSocketResponseType = JSON.parse(reader.result as string);
          updateTableData(newData); // Update table data with WebSocket message
        };
        reader.readAsText(event.data);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed. Code: ${event.code}`);
        retries += 1;
        if (retries < 5) {
          const retryTimeout = Math.min(1000 * 2 ** retries, 10000); // Exponential backoff
          console.log(`WebSocket reconnecting in ${retryTimeout / 1000} seconds...`);
          setTimeout(connectWebSocket, retryTimeout);
        } else {
          console.error("WebSocket connection failed after 5 attempts");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws?.close();
      };

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, [url, market]);

  return socket;
}

export default function Table() {
  const [showSpan, setShowSpan] = useState(false);
  const [market, setMarket] = useState<MarketData[]>([]);
  const [tableData, setTableData] = useState<tableData[]>([]);
  const [binancePriceData, setBinancePriceData] = useState<BinancePriceData[]>(
    []
  );
  const [priceUpdated, setPriceUpdated] = useState(
    Array(tableData.length).fill(false)
  );
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState(true);
  const sortedRef = useRef(false);
  const [search, setSearch] = useState("");
  const exchangeRate = useExchangeStore((state) => state.exchangeRate);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const doRenewal = useOptionsStore((state) => state.doRenewal);

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getChosungs(item.name).includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!doRenewal) {
      sortedRef.current = true;
      return;
    }
    sortedRef.current = false;
  }, [doRenewal]);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/upbit"); // Next.js API 호출
        const data = await response.json();
        const { krwMarkets, tickerData } = data;
  
        let tableDataArr: tableData[] = [];
  
        tickerData.forEach((data: any) => {
          let marketData = krwMarkets.find((market: any) => market.market === data.market);
  
          if (marketData) {
            let newData: tableData = {
              name: marketData.korean_name,
              code: data.market.split("-")[1],
              currentPrice: data.trade_price,
              signed_change_rate: data.signed_change_rate,
              tradeVolume: data.acc_trade_price_24h,
              prev_closing_price: data.prev_closing_price,
            };
  
            tableDataArr.push(newData);
          }
        });
  
        setTableData(tableDataArr);
        setMarket((prev) => krwMarkets);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  //바이낸스 데이터 로드
  useEffect(() => {
    const fetchBinanceData = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr"
        );
        console.log("fetchBinanceData");
        const allData: BinancePriceData[] = await response.json();
        const binanceData = tableData
          .map((item) => {
            const data = allData.find(
              (data) => data.symbol === `${item.code}USDT`
            );
            if (data) {
              const symbol = item.code;
              const lastPrice = data.lastPrice;
              const quoteVolume = data.quoteVolume;
              return { symbol, lastPrice, quoteVolume };
            }
          })
          .filter((item): item is BinancePriceData => Boolean(item));

        setTableData((prevData) => {
          const updatedData = [...prevData];

          updatedData.forEach((item) => {
            const binanceItem = binanceData.find(
              (data) => data.symbol === item.code
            );

            if (binanceItem) {
              item.binancePrice = Number(binanceItem.lastPrice);
              item.binanceVolume = Number(binanceItem.quoteVolume);
              item.KimchiPremium =
                Number(binanceItem.lastPrice) !== 0
                  ? (item.currentPrice /
                      (Number(binanceItem.lastPrice) * exchangeRate) -
                      1) *
                    100
                  : undefined;
            }
          });

          return updatedData;
        });
        setBinancePriceData(binanceData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBinanceData();
  }, [market]);

  // //업비트 웹소켓//
  // useEffect(() => {
  //   // WebSocket 연결 및 실시간 업데이트
  //   const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
  //   console.log("socket opened");
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

  //       setTableData((prevData) => {
  //         const updatedData = [...prevData];
  //         const indexToUpdate = updatedData.findIndex(
  //           (data) => "KRW-" + data.code === newData.code
  //         );

  //         if (indexToUpdate !== -1) {
  //           // Check if price has updated
  //           const priceHasUpdated =
  //             updatedData[indexToUpdate].currentPrice !== newData.trade_price;

  //           updatedData[indexToUpdate] = {
  //             ...updatedData[indexToUpdate],
  //             currentPrice: newData.trade_price,
  //             signed_change_rate: newData.signed_change_rate,
  //             tradeVolume: newData.acc_trade_price_24h,
  //             KimchiPremium: updatedData[indexToUpdate].binancePrice
  //               ? (newData.trade_price /
  //                   (updatedData[indexToUpdate].binancePrice! * exchangeRate) -
  //                   1) *
  //                 100
  //               : undefined,
  //           };

  //           if (priceHasUpdated) {
  //             // Set the priceUpdated state for this item to true
  //             setPriceUpdated((prev) => {
  //               const newPriceUpdated = [...prev];
  //               newPriceUpdated[indexToUpdate] = true;
  //               return newPriceUpdated;
  //             });

  //             // After 1 second, set the priceUpdated state for this item back to false
  //             setTimeout(() => {
  //               setPriceUpdated((prev) => {
  //                 const newPriceUpdated = [...prev];
  //                 newPriceUpdated[indexToUpdate] = false;
  //                 return newPriceUpdated;
  //               });
  //             }, 1000);

  //             if (!sortedRef.current) {
  //               const itemToUpdate = updatedData.splice(indexToUpdate, 1)[0];
  //               updatedData.unshift(itemToUpdate);
  //             }
  //           }
  //         }

  //         return updatedData;
  //       });
  //     };
  //     reader.readAsText(event.data);
  //   };

  //   return () => {
  //     socket.close();
  //     console.log("socket closed");
  //   };
  // }, [market]);

// WebSocket 데이터를 테이블에 업데이트하는 함수
  const updateTableData = (newData : upbitWebSocketResponseType) => {
    // console.log(newData);
    setTableData((prevData) => {
      const updatedData = [...prevData];
      const indexToUpdate = updatedData.findIndex(
        (data) => "KRW-" + data.code === newData.code
      );

      if (indexToUpdate !== -1) {
        const priceHasUpdated =
          updatedData[indexToUpdate].currentPrice !== newData.trade_price;

        updatedData[indexToUpdate] = {
          ...updatedData[indexToUpdate],
          currentPrice: newData.trade_price,
          signed_change_rate: newData.signed_change_rate,
          tradeVolume: newData.acc_trade_price_24h,
          KimchiPremium: updatedData[indexToUpdate].binancePrice
            ? (newData.trade_price /
                (updatedData[indexToUpdate].binancePrice! * exchangeRate) - 1) *
              100
            : undefined,
        };
      }

      return updatedData;
    });
  };

  // Use the custom WebSocket hook
  useWebSocket("wss://api.upbit.com/websocket/v1", market, updateTableData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/upbit");
        const data = await response.json();
        const { krwMarkets, tickerData } = data;
        let tableDataArr: tableData[] = [];

        tickerData.forEach((data: any) => {
          let marketData = krwMarkets.find(
            (market: any) => market.market === data.market
          );

          if (marketData) {
            let newData: tableData = {
              name: marketData.korean_name,
              code: data.market.split("-")[1],
              currentPrice: data.trade_price,
              signed_change_rate: data.signed_change_rate,
              tradeVolume: data.acc_trade_price_24h,
              prev_closing_price: data.prev_closing_price,
            };

            tableDataArr.push(newData);
          }
        });

        setTableData(tableDataArr);
        setMarket(krwMarkets);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // 정렬 기능
  const sortData = (field: keyof tableData) => {
    console.log("sorting");

    let newOrder = order;

    if (sortBy === field) {
      newOrder = !order;
      setOrder(newOrder);
    } else {
      setSortBy(field);
      setOrder(true);
      newOrder = true;
    }

    setTableData((prev) =>
      [...prev].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        // Check for "KimchiPremium"
        if (field === "KimchiPremium") {
          const aIsInvalid =
            aValue === undefined ||
            (typeof aValue === "number" && isNaN(aValue));
          const bIsInvalid =
            bValue === undefined ||
            (typeof bValue === "number" && isNaN(bValue));

          if (aIsInvalid && bIsInvalid) return 0;
          if (aIsInvalid) return 1;
          if (bIsInvalid) return -1;
        }

        // Handle numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return newOrder ? aValue - bValue : bValue - aValue;
        }

        // Handle strings
        if (typeof aValue === "string" && typeof bValue === "string") {
          return newOrder
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      })
    );

    sortedRef.current = true;
  };

  /*
{
  "e": "24hrTicker",  // 이벤트 유형
  "E": 123456789,     // 이벤트 시간
  "s": "BNBBTC",      // 심볼
  "p": "0.0015",      // 가격 변화
  "P": "250.00",      // 가격 변화율(%)
  "w": "0.0018",      // 가중평균 가격
  "x": "0.0009",      // 첫 거래 가격
  "c": "0.0025",      // 마지막 거래 가격
  "Q": "10",          // 마지막 거래 수량
  "b": "0.0024",      // 최고 구매가
  "B": "10",          // 최고 구매가에 대한 수량
  "a": "0.0026",      // 최저 판매가
  "A": "100",         // 최저 판매가에 대한 수량
  "o": "0.0010",      // 시가
  "h": "0.0025",      // 고가
  "l": "0.0010",      // 저가
  "v": "10000",       // 거래량
  "q": "18",          // 총 거래 가격
  "O": 123456789,     // 통계 시작 시간
  "C": 123456789,     // 통계 종료 시간
  "F": 100,           // 첫 거래 번호
  "L": 200,           // 마지막 거래 번호
  "n": 100            // 거래 수
}
*/
  //바이낸스 웹소켓//
  useEffect(() => {
    // WebSocket 연결 및 실시간 업데이트
    const binanceSockets: WebSocket[] = [];

    // 각 티커에 대한 웹소켓 연결을 생성합니다.
    tableData.forEach((item) => {
      const binanceSocket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${item.code.toLowerCase()}usdt@trade`
      );

      binanceSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const binancePrice = Number(data.p); // last trade price
        // const binanceVolume = Number(data.q); // last trade quantity

        // Update the binancePrice and binanceVolume properties of the relevant item in tableData
        setTableData((prevData) => {
          const updatedData = [...prevData];
          const itemToUpdate = updatedData.find(
            (item) => item.code + "USDT" === data.s.toUpperCase()
          );

          if (itemToUpdate) {
            itemToUpdate.binancePrice = binancePrice;
            itemToUpdate.KimchiPremium =
              (itemToUpdate.currentPrice / (binancePrice * exchangeRate) - 1) *
              100;

            // itemToUpdate.binanceVolume! += binanceVolume;
          }

          return updatedData;
        });
      };

      binanceSockets.push(binanceSocket);
    });
    return () => {
      binanceSockets.forEach((socket) => socket.close());
      console.log("binance sockets closed");
    };
  }, [market]);

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
            현재가
            <span className="ml-1 text-[10px] relative">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
          <th
            className="py-2 cursor-pointer text-right !text-black dark:!text-white select-none"
            onClick={() => sortData("KimchiPremium")}
          >
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
            거래액(24h)
            <span className="ml-1 text-[10px] relative ">
              <i className="absolute -top-[2px] fa-solid fa-caret-up text-neutral-400 dark:text-neutral-400"></i>
              <i className="absolute -bottom-[2px] fa-solid fa-caret-down text-neutral-400 dark:text-neutral-400 "></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((data, index) => (
          <tr
            key={index}
            className="text-right border-b-gray-200 border-b tracking-tight dark:border-b-neutral-700 [&>td]:py-1"
          >
            <td className="text-left ">
              {/* 이름 */}
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
              <div className="flex items-center gap-1 ">
                <p className="inline-block text-gray-500 dark:text-gray-400">
                  {data.code}
                </p>
              </div>
            </td>
            <td className="flex flex-col">
              {/* 현재가 */}
              <p title={`${data.currentPrice.toLocaleString()}원`}>
                {data.currentPrice.toLocaleString()}원
              </p>
              <p
                title={`${data.binancePrice?.toLocaleString() ?? 0}달러`}
                className="text-gray-500 transition-opacity dark:text-gray-400"
              >
                {data.binancePrice
                  ? Math.round(
                      data.binancePrice * exchangeRate
                    ).toLocaleString() + "원"
                  : "-"}
              </p>
            </td>
            <td className="text-teal-700 dark:text-teal-600">
              {/* 김프 */}
              {data.KimchiPremium ? data.KimchiPremium.toFixed(2) + "%" : "-"}
            </td>
            <td
              title={`${data.prev_closing_price.toLocaleString()}원`}
              className={
                data.signed_change_rate > 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-green-600 dark:text-green-500"
              }
            >
              {/* 전일대비 */}
              <p>{(data.signed_change_rate * 100).toFixed(2)}%</p>
              <p className="text-gray-500 transition-opacity dark:text-gray-400">
                {data.prev_closing_price.toLocaleString()}원
              </p>
            </td>
            <td className="flex flex-col">
              {/* 거래액 */}
              <p title={`${data.tradeVolume.toLocaleString()}원`}>
                {Number(
                  (data.tradeVolume / 100_000_000).toFixed(2)
                ).toLocaleString()}
                억원
              </p>
              <p
                title={`${data.binanceVolume?.toLocaleString()}달러\n${(
                  exchangeRate * data.binanceVolume!
                ).toLocaleString()}원`}
                className="text-gray-500 transition-opacity dark:text-gray-400"
              >
                {data.binanceVolume
                  ? (data.binanceVolume * exchangeRate) / 1_000_000_000_000 >= 1
                    ? (
                        (data.binanceVolume * exchangeRate) /
                        1_000_000_000_000
                      ).toFixed(2) + "조원"
                    : Math.round(
                        (data.binanceVolume * exchangeRate) / 100_000_000
                      ).toLocaleString() + "억원"
                  : "-"}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
