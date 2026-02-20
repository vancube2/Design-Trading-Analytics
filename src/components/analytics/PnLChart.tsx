import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface PnLChartProps {
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-card border border-border-color p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-text-secondary text-xs mb-1">{label}</p>
                <p className={`text-sm font-bold ${payload[0].value >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                    PnL: ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {payload[1] && (
                    <p className="text-secondary-bear text-xs mt-1">
                        Drawdown: {payload[1].value.toFixed(2)}%
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export const PnLChart: React.FC<PnLChartProps> = ({ data }) => {
    return (
        <div className="card h-96 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-lg font-semibold">Cumulative PnL</h4>
                    <p className="text-text-secondary text-xs">Performance over the selected period</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary-bull rounded-full"></div>
                        <span className="text-xs text-text-secondary">PnL</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-secondary-bear/30 rounded-full"></div>
                        <span className="text-xs text-text-secondary">Drawdown</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary-bull)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary-bull)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDD" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--secondary-bear)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--secondary-bear)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            stroke="var(--text-secondary)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                        <Area
                            type="monotone"
                            dataKey="pnl"
                            stroke="var(--primary-bull)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPnL)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="drawdown"
                            stroke="var(--secondary-bear)"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fillOpacity={1}
                            fill="url(#colorDD)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
