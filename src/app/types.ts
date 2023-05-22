export type MarketData = {
  market: string;
  korean_name: string;
  english_name: string;
};
export type tableData = {
  name: string; //한국이름
  code: string; //코드
  currentPrice: number; //현재가
  signed_change_rate: number; //전일대비
  tradeVolume: number; // 거래량
  binancePrice?: number; //바이낸스 가격
  binanceVolume?: number; //바이낸스 거래량
};

export type ApiResponseType = {
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
export type BinanceResponseData = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};
export type BinancePriceData = {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
};
