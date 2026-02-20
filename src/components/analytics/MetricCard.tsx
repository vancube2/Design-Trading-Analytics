import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    subValue,
    icon: Icon,
    trend,
    trendValue
}) => {
    return (
        <div className="card">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-surface-hover rounded-lg">
                    <Icon size={20} className="text-accent-purple" />
                </div>
                {trend && (
                    <div className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 
            ${trend === 'up' ? 'bg-primary-bull/10 text-primary-bull' :
                            trend === 'down' ? 'bg-secondary-bear/10 text-secondary-bear' : 'bg-text-secondary/10 text-text-secondary'}`}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                    </div>
                )}
            </div>
            <div>
                <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                    {subValue && <span className="text-text-secondary text-xs">{subValue}</span>}
                </div>
            </div>
        </div>
    );
};
