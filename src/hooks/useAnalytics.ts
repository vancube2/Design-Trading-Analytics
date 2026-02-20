import { useMemo } from 'react';
import type { Trade } from '../utils/mockData';
import { format, isWithinInterval } from 'date-fns';

export const useAnalytics = (trades: Trade[], dateRange: { start: Date; end: Date } | null, selectedSymbol: string | 'All') => {
    const filteredTrades = useMemo(() => {
        return trades.filter(t => {
            const dateMatch = dateRange ? isWithinInterval(new Date(t.timestamp), { start: dateRange.start, end: dateRange.end }) : true;
            const symbolMatch = selectedSymbol === 'All' ? true : t.symbol === selectedSymbol;
            return dateMatch && symbolMatch;
        });
    }, [trades, dateRange, selectedSymbol]);

    const stats = useMemo(() => {
        const totalPnL = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
        const totalVolume = filteredTrades.reduce((acc, t) => acc + (t.entryPrice * t.quantity), 0);
        const totalFees = filteredTrades.reduce((acc, t) => acc + t.fee, 0);
        const winRate = (filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length) * 100 || 0;
        const avgTradeDuration = filteredTrades.reduce((acc, t) => acc + t.duration, 0) / filteredTrades.length || 0;

        const longTrades = filteredTrades.filter(t => t.side === 'LONG');
        const shortTrades = filteredTrades.filter(t => t.side === 'SHORT');
        const longShortRatio = (longTrades.length / shortTrades.length) || 0;

        const winningTrades = filteredTrades.filter(t => t.pnl > 0);
        const losingTrades = filteredTrades.filter(t => t.pnl < 0);

        const grossProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
        const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));
        const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

        const largestGain = Math.max(...filteredTrades.map(t => t.pnl), 0);
        const largestLoss = Math.min(...filteredTrades.map(t => t.pnl), 0);

        const avgWin = winningTrades.reduce((acc, t) => acc + t.pnl, 0) / winningTrades.length || 0;
        const avgLoss = losingTrades.reduce((acc, t) => acc + t.pnl, 0) / losingTrades.length || 0;

        // PnL Over Time (Cumulative)
        let cumulativePnL = 0;
        const pnlHistory = [...filteredTrades].sort((a, b) => a.timestamp - b.timestamp).map(t => {
            cumulativePnL += t.pnl;
            return {
                timestamp: t.timestamp,
                formattedDate: format(t.timestamp, 'MMM dd HH:mm'),
                pnl: cumulativePnL,
                tradePnL: t.pnl
            };
        });

        // Drawdown Calculation
        let peak = 0;
        let maxDrawdown = 0;
        const pnlWithDrawdown = pnlHistory.map(h => {
            if (h.pnl > peak) peak = h.pnl;
            const dd = peak === 0 ? 0 : ((peak - h.pnl) / peak) * 100;
            if (dd > maxDrawdown) maxDrawdown = dd;
            return { ...h, drawdown: -dd };
        });

        // Time-based Analysis
        const hourlyPnL: Record<number, number> = {};
        const sessionStats = {
            Asia: { pnl: 0, trades: 0 },
            Europe: { pnl: 0, trades: 0 },
            America: { pnl: 0, trades: 0 }
        };

        // Order Type Analysis
        const orderTypeStats: Record<string, { pnl: number, trades: number, winRate: number }> = {};
        const dailyPnL: Record<string, number> = {};

        filteredTrades.forEach(t => {
            const date = new Date(t.timestamp);
            const hour = date.getHours();
            const dateStr = format(date, 'yyyy-MM-dd');

            hourlyPnL[hour] = (hourlyPnL[hour] || 0) + t.pnl;
            dailyPnL[dateStr] = (dailyPnL[dateStr] || 0) + t.pnl;

            // Session mapping (UTC-ish)
            if (hour >= 0 && hour < 8) {
                sessionStats.Asia.pnl += t.pnl;
                sessionStats.Asia.trades++;
            } else if (hour >= 8 && hour < 16) {
                sessionStats.Europe.pnl += t.pnl;
                sessionStats.Europe.trades++;
            } else {
                sessionStats.America.pnl += t.pnl;
                sessionStats.America.trades++;
            }

            // Order Type stats
            if (!orderTypeStats[t.orderType]) {
                orderTypeStats[t.orderType] = { pnl: 0, trades: 0, winRate: 0 };
            }
            orderTypeStats[t.orderType].pnl += t.pnl;
            orderTypeStats[t.orderType].trades++;
        });

        // Finalize Win Rates for Order Types
        Object.keys(orderTypeStats).forEach(type => {
            const typeTrades = filteredTrades.filter(t => t.orderType === type);
            const wins = typeTrades.filter(t => t.pnl > 0).length;
            orderTypeStats[type].winRate = (wins / typeTrades.length) * 100;
        });

        return {
            totalPnL,
            totalVolume,
            totalFees,
            winRate,
            avgTradeDuration,
            tradeCount: filteredTrades.length,
            longShortRatio,
            largestGain,
            largestLoss,
            avgWin,
            avgLoss,
            profitFactor,
            pnlHistory: pnlWithDrawdown,
            maxDrawdown,
            hourlyPnL,
            dailyPnL,
            orderTypeStats,
            sessionStats
        };
    }, [filteredTrades]);

    return { filteredTrades, stats };
};
