export type MarketData = {
  market: string;
  korean_name: string;
  english_name: string;
};
export type tableData = {
  name: string; //한국이름
  code: string; //코드
  currentPrice: number; //현재가
  prev_closing_price: number; //전일종가
  signed_change_rate: number; //전일대비
  tradeVolume: number; // 거래량
  binancePrice?: number; //바이낸스 가격
  binanceVolume?: number; //바이낸스 거래량
  KimchiPremium?: number; //프리미엄
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

export type Message = {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  createdAt: Date;
};

export interface upbitWebSocketResponseType {
  code: string; // e.g., "KRW-AVAX"
  acc_ask_volume: number;
  acc_bid_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  ask_bid: string;
  change: string;
  change_price: number;
  change_rate: number;
  high_price: number;
  low_price: number;
  market_state: string;
  opening_price: number;
  prev_closing_price: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_price: number;
  trade_volume: number;
  trade_timestamp: number;
  timestamp: number;
  market_warning: string;
  stream_type: string;
}
