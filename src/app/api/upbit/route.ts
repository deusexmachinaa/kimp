// app/api/upbit/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 외부 API 요청
    const response1 = await fetch("https://api.upbit.com/v1/market/all");
    const fetchedData1 = await response1.json();
    const krwMarkets = fetchedData1.filter((marketData: any) =>
      marketData.market.startsWith("KRW-")
    );

    const query = krwMarkets.map((item: any) => item.market).join(",");
    const response2 = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${query}`
    );
    const fetchedData2 = await response2.json();

    // 데이터를 클라이언트에 전달
    return NextResponse.json({ krwMarkets, tickerData: fetchedData2 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
