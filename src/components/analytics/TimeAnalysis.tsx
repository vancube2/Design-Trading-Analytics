import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Clock, Sun, Moon, Sunrise } from 'lucide-react';

interface TimeAnalysisProps {
    hourlyPnL: Record<number, number>;
    sessionStats: {
        Asia: { pnl: number, trades: number };
        Europe: { pnl: number, trades: number };
        America: { pnl: number, trades: number };
    };
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ hourlyPnL, sessionStats }) => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        pnl: hourlyPnL[i] || 0
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Session Cards */}
                <div className="card border-l-4 border-l-primary-bull">
                    <div className="flex items-center gap-2 mb-4">
                        <Sunrise size={18} className="text-primary-bull" />
                        <span className="font-bold">Asia Session</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Net PnL</p>
                            <h4 className={`text-xl font-mono font-bold ${sessionStats.Asia.pnl >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                                {sessionStats.Asia.pnl >= 0 ? '+' : ''}${sessionStats.Asia.pnl.toFixed(2)}
                            </h4>
                        </div>
                        <div className="text-right">
                            <p className="text-text-secondary text-[10px] uppercase font-bold">Trades</p>
                            <p className="text-sm font-mono">{sessionStats.Asia.trades}</p>
                        </div>
                    </div>
                </div>

                <div className="card border-l-4 border-l-accent-purple">
                    <div className="flex items-center gap-2 mb-4">
                        <Sun size={18} className="text-accent-purple" />
                        <span className="font-bold">Europe Session</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Net PnL</p>
                            <h4 className={`text-xl font-mono font-bold ${sessionStats.Europe.pnl >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                                {sessionStats.Europe.pnl >= 0 ? '+' : ''}${sessionStats.Europe.pnl.toFixed(2)}
                            </h4>
                        </div>
                        <div className="text-right">
                            <p className="text-text-secondary text-[10px] uppercase font-bold">Trades</p>
                            <p className="text-sm font-mono">{sessionStats.Europe.trades}</p>
                        </div>
                    </div>
                </div>

                <div className="card border-l-4 border-l-secondary-bear">
                    <div className="flex items-center gap-2 mb-4">
                        <Moon size={18} className="text-secondary-bear" />
                        <span className="font-bold">America Session</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Net PnL</p>
                            <h4 className={`text-xl font-mono font-bold ${sessionStats.America.pnl >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                                {sessionStats.America.pnl >= 0 ? '+' : ''}${sessionStats.America.pnl.toFixed(2)}
                            </h4>
                        </div>
                        <div className="text-right">
                            <p className="text-text-secondary text-[10px] uppercase font-bold">Trades</p>
                            <p className="text-sm font-mono">{sessionStats.America.trades}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <Clock size={20} className="text-accent-purple" />
                    <h4 className="text-lg font-semibold">Hourly Performance Distribution</h4>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="hour"
                                stroke="var(--text-secondary)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--text-secondary)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Bar dataKey="pnl">
                                {hourlyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? 'var(--primary-bull)' : 'var(--secondary-bear)'} opacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-text-secondary text-[10px] text-center mt-4 uppercase tracking-widest font-bold">
                    All times are shown in your local timezone
                </p>
            </div>
        </div>
    );
};
