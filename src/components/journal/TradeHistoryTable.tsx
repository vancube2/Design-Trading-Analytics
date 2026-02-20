import React, { useState } from 'react';
import type { Trade } from '../../utils/mockData';
import { format } from 'date-fns';
import { Search, Filter, MessageSquare, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';

interface TradeHistoryTableProps {
    trades: Trade[];
}

export const TradeHistoryTable: React.FC<TradeHistoryTableProps> = ({ trades }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredTrades = trades.filter(t =>
        t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.side.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.annotation && t.annotation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
    const paginatedTrades = filteredTrades.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h4 className="text-lg font-semibold">Trade History</h4>
                    <p className="text-text-secondary text-xs">Detailed log of all executions</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search symbol, side, notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-bg-dark border border-border-color rounded-lg text-sm focus:outline-none focus:border-accent-purple w-64"
                        />
                    </div>
                    <button className="p-2 bg-surface-hover border border-border-color rounded-lg text-text-secondary hover:text-white transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-color text-text-secondary text-xs uppercase tracking-widest font-bold">
                            <th className="px-4 py-4">Time</th>
                            <th className="px-4 py-4">Asset</th>
                            <th className="px-4 py-4">Side</th>
                            <th className="px-4 py-4">Quantity</th>
                            <th className="px-4 py-4 text-right">Entry / Exit</th>
                            <th className="px-4 py-4 text-right">Net PnL</th>
                            <th className="px-4 py-4 text-right">Fee</th>
                            <th className="px-4 py-4">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTrades.map((trade) => (
                            <tr key={trade.id} className="border-b border-border-color/30 hover:bg-surface-hover/30 transition-colors group">
                                <td className="px-4 py-4 text-sm text-text-secondary">
                                    {format(trade.timestamp, 'MMM dd, HH:mm:ss')}
                                </td>
                                <td className="px-4 py-4 font-bold text-sm">
                                    {trade.symbol}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${trade.side === 'LONG' ? 'bg-primary-bull/10 text-primary-bull' : 'bg-secondary-bear/10 text-secondary-bear'}`}>
                                        {trade.side}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm font-mono">
                                    {trade.quantity.toFixed(2)}
                                </td>
                                <td className="px-4 py-4 text-right text-sm">
                                    <div className="font-mono">${trade.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                    <div className="text-[10px] text-text-secondary font-mono">${trade.exitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                </td>
                                <td className={`px-4 py-4 text-right text-sm font-bold font-mono ${trade.pnl >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-4 text-right text-xs text-text-secondary font-mono">
                                    ${trade.fee.toFixed(2)}
                                </td>
                                <td className="px-4 py-4 max-w-[200px]">
                                    <div className="flex items-center gap-2">
                                        {trade.annotation ? (
                                            <span
                                                className="text-xs text-text-secondary italic truncate cursor-pointer hover:text-white transition-colors"
                                                onClick={() => {
                                                    const note = prompt('Edit note:', trade.annotation);
                                                    if (note !== null) trade.annotation = note;
                                                }}
                                            >
                                                {trade.annotation}
                                            </span>
                                        ) : (
                                            <button
                                                className="text-accent-purple/40 group-hover:text-accent-purple transition-colors"
                                                onClick={() => {
                                                    const note = prompt('Add trading note:');
                                                    if (note) trade.annotation = note;
                                                }}
                                            >
                                                <MessageSquare size={14} />
                                            </button>
                                        )}
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
                                            <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-xs text-text-secondary">
                    Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredTrades.length)}</span> of <span className="text-white font-bold">{filteredTrades.length}</span> trades
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-1.5 bg-surface-card border border-border-color rounded-lg disabled:opacity-30 hover:bg-surface-hover transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20' : 'bg-surface-card border border-border-color hover:bg-surface-hover'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-1.5 bg-surface-card border border-border-color rounded-lg disabled:opacity-30 hover:bg-surface-hover transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
