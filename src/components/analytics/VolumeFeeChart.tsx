import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface VolumeFeeChartProps {
    data: any[];
}

export const VolumeFeeChart: React.FC<VolumeFeeChartProps> = ({ data }) => {
    // Group by date for volume/fee analysis
    const chartData = React.useMemo(() => {
        const dailyData: Record<string, { date: string, volume: number, fees: number }> = {};

        data.forEach(t => {
            const date = t.formattedDate.split(' ')[0] + ' ' + t.formattedDate.split(' ')[1];
            if (!dailyData[date]) {
                dailyData[date] = { date, volume: 0, fees: 0 };
            }
            // Calculate volume for this trade (simplified)
            dailyData[date].volume += Math.abs(t.tradePnL * 5); // Mock volume proportional to PnL
            dailyData[date].fees += Math.abs(t.tradePnL * 0.05); // Mock fees
        });

        return Object.values(dailyData).slice(-15); // Show last 15 periods
    }, [data]);

    return (
        <div className="card h-80 flex flex-col">
            <div className="mb-6">
                <h4 className="text-lg font-semibold">Volume & Fees</h4>
                <p className="text-text-secondary text-xs">Trading activity and protocol costs</p>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--text-secondary)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="var(--text-secondary)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="var(--text-secondary)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v.toFixed(0)}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar yAxisId="left" dataKey="volume" name="Volume" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="fees" name="Fees" fill="var(--secondary-bear)" radius={[4, 4, 0, 0]} opacity={0.6} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
