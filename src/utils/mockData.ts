import { subDays } from 'date-fns';

export interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  fee: number;
  duration: number; // in minutes
  orderType: 'LIMIT' | 'MARKET' | 'STOP_LIMIT';
  annotation?: string;
}

export const SYMBOLS = ['SOL/USDC', 'BTC/USDC', 'ETH/USDC', 'JUP/USDC', 'PYTH/USDC'];

const generateTrade = (index: number, daysAgo: number): Trade => {
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const side = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const entryPrice = symbol.startsWith('SOL') ? 140 + Math.random() * 20 :
    symbol.startsWith('BTC') ? 60000 + Math.random() * 5000 :
      symbol.startsWith('ETH') ? 3000 + Math.random() * 500 : 2 + Math.random() * 5;

  const priceChangePercent = (Math.random() * 0.1) - 0.04; // -4% to +6%
  const exitPrice = entryPrice * (1 + (side === 'LONG' ? priceChangePercent : -priceChangePercent));
  const quantity = Math.random() * 100;
  const pnl = (exitPrice - entryPrice) * quantity * (side === 'LONG' ? 1 : -1);
  const fee = Math.abs(entryPrice * quantity * 0.0005); // 0.05% fee
  const duration = Math.floor(Math.random() * 1440); // Up to 1 day
  const timestamp = subDays(new Date(), daysAgo).getTime() + Math.random() * 86400000;

  return {
    id: `trade-${index}`,
    timestamp,
    symbol,
    side,
    entryPrice,
    exitPrice,
    quantity,
    pnl: pnl - fee,
    fee,
    duration,
    orderType: Math.random() > 0.7 ? 'MARKET' : Math.random() > 0.5 ? 'LIMIT' : 'STOP_LIMIT',
    annotation: Math.random() > 0.8 ? 'Good entry on support level' : undefined,
  };
};

export const generateMockTrades = (count: number): Trade[] => {
  return Array.from({ length: count }, (_, i) => generateTrade(i, Math.floor(i / (count / 30))))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const MOCK_TRADES = generateMockTrades(100);
