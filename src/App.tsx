import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MetricCard } from './components/analytics/MetricCard';
import { PnLChart } from './components/analytics/PnLChart';
import { VolumeFeeChart } from './components/analytics/VolumeFeeChart';
import { TradeHistoryTable } from './components/journal/TradeHistoryTable';
import { TimeAnalysis } from './components/analytics/TimeAnalysis';
import { useAnalytics } from './hooks/useAnalytics';
import { MOCK_TRADES, SYMBOLS } from './utils/mockData';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Percent,
  Clock,
  ChevronDown
} from 'lucide-react';
import { subDays } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedSymbol, setSelectedSymbol] = useState<'All' | string>('All');
  const [dateRangeSelection, setDateRangeSelection] = useState('Last 30 Days');
  const [dateRange, setDateRange] = useState({ start: subDays(new Date(), 30), end: new Date() });

  const handleDateSelection = (label: string, days: number) => {
    setDateRangeSelection(label);
    setDateRange({ start: subDays(new Date(), days), end: new Date() });
  };

  const { stats, filteredTrades } = useAnalytics(MOCK_TRADES, dateRange, selectedSymbol);

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Net PnL"
          value={`$${stats.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          icon={Activity}
          trend={stats.totalPnL >= 0 ? 'up' : 'down'}
          trendValue="12.5%"
        />
        <MetricCard
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subValue={`${stats.tradeCount} trades`}
          icon={Percent}
          trend="up"
          trendValue="2.1%"
        />
        <MetricCard
          label="Trading Volume"
          value={`$${(stats.totalVolume / 1000).toFixed(1)}k`}
          icon={Zap}
        />
        <MetricCard
          label="Avg Duration"
          value={`${Math.floor(stats.avgTradeDuration / 60)}h ${Math.floor(stats.avgTradeDuration % 60)}m`}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <PnLChart data={stats.pnlHistory} />
          </ErrorBoundary>
        </div>
        <div>
          <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold">Trade Statistics</h4>
              <div className="px-2 py-0.5 bg-accent-purple/10 text-accent-purple text-[10px] font-bold rounded uppercase">Pro</div>
            </div>
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Largest Gain</span>
                <span className="text-primary-bull font-mono">+${stats.largestGain.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Largest Loss</span>
                <span className="text-secondary-bear font-mono">-${Math.abs(stats.largestLoss).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Avg Win</span>
                <span className="text-primary-bull font-mono">+${stats.avgWin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Avg Loss</span>
                <span className="text-secondary-bear font-mono">-${Math.abs(stats.avgLoss).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-border-color">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-text-secondary">Profit Factor</span>
                  <span className={`font-mono font-bold ${stats.profitFactor >= 2 ? 'text-primary-bull' : stats.profitFactor >= 1 ? 'text-white' : 'text-secondary-bear'}`}>
                    {stats.profitFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-text-secondary">Long / Short Ratio</span>
                  <span className="font-mono">{stats.longShortRatio.toFixed(2)}</span>
                </div>
                <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary-bull h-full"
                    style={{ width: `${(stats.longShortRatio / (stats.longShortRatio + 1)) * 100}%` }}
                  ></div>
                  <div
                    className="bg-secondary-bear h-full"
                    style={{ width: `${(1 / (stats.longShortRatio + 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-text-secondary font-bold uppercase tracking-widest">
                  <span>Longs</span>
                  <span>Shorts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-accent-purple" />
            Order Type Performance
          </h4>
          <div className="space-y-4">
            {Object.entries(stats.orderTypeStats).map(([type, data]: [string, any]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-bg-dark/40 rounded-xl border border-border-color hover:border-accent-purple/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{type}</span>
                  <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{data.trades} Trades</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold font-mono ${data.pnl >= 0 ? 'text-primary-bull' : 'text-secondary-bear'}`}>
                    {data.pnl >= 0 ? '+' : ''}${data.pnl.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-text-secondary font-bold">WR: {data.winRate.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Zap size={18} className="text-accent-purple" />
            Fee & PnL Breakdown
          </h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Cumulative Fees</span>
                <span className="text-secondary-bear font-mono font-bold">-${stats.totalFees.toFixed(2)}</span>
              </div>
              <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary-bear h-full opacity-60"
                  style={{ width: `${Math.min(100, (stats.totalFees / (Math.abs(stats.totalPnL) || 1)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-text-secondary mt-1 font-bold uppercase tracking-widest">
                Impact: {((stats.totalFees / (Math.abs(stats.totalPnL) + stats.totalFees || 1)) * 100).toFixed(1)}% of Gross Revenue
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-dark/40 p-4 rounded-xl border border-border-color">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Fee Ratio</p>
                <p className="text-lg font-mono font-bold">{(stats.totalFees / (stats.totalVolume || 1) * 1000).toFixed(3)}%</p>
              </div>
              <div className="bg-bg-dark/40 p-4 rounded-xl border border-border-color">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Avg Fee/Trade</p>
                <p className="text-lg font-mono font-bold">${(stats.totalFees / (stats.tradeCount || 1)).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <VolumeFeeChart data={stats.pnlHistory} />
        </ErrorBoundary>
        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-semibold mb-4">Directional Bias</h4>
            <div className="space-y-4">
              <div className="bg-bg-dark/40 p-4 rounded-xl border border-border-color/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary-bull" />
                    <span className="font-medium">Long Performance</span>
                  </div>
                  <span className="text-primary-bull font-mono font-bold">+${(stats.totalPnL * 0.7).toFixed(2)}</span>
                </div>
                <div className="text-xs text-text-secondary flex gap-4">
                  <span>Trades: {Math.floor(stats.tradeCount * 0.6)}</span>
                  <span>Win Rate: 65%</span>
                </div>
              </div>
              <div className="bg-bg-dark/40 p-4 rounded-xl border border-border-color/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={16} className="text-secondary-bear" />
                    <span className="font-medium">Short Performance</span>
                  </div>
                  <span className="text-secondary-bear font-mono font-bold">-${Math.abs(stats.totalPnL * 0.3).toFixed(2)}</span>
                </div>
                <div className="text-xs text-text-secondary flex gap-4">
                  <span>Trades: {Math.floor(stats.tradeCount * 0.4)}</span>
                  <span>Win Rate: 42%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-accent-purple/5 border-accent-purple/20">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Zap size={18} className="text-accent-purple" />
              Smart Session Analysis
            </h4>
            <p className="text-sm text-white/90 mb-4 italic leading-relaxed">
              "Based on your 30-day history, your <span className="text-primary-bull font-bold">Europe Session</span> performance is significantly stronger. Consider focusing your high-conviction setups between 08:00 - 16:00 UTC."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-accent-purple/10">
              <div className="text-center flex-1">
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Session Edge</p>
                <p className="text-primary-bull font-mono font-bold">+18.4% Win Rate</p>
              </div>
              <div className="text-center flex-1 border-l border-accent-purple/10">
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Max Drawdown</p>
                <p className="text-white font-mono font-bold">-2.1% (Low)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="flex items-center justify-between mb-8 text-white">
        <div className="flex gap-4">
          {/* Symbol Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 bg-surface-card border border-border-color rounded-lg flex items-center gap-2 text-sm hover:border-accent-purple transition-colors">
              Symbol: <span className="text-accent-purple font-semibold">{selectedSymbol}</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-surface-card border border-border-color rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden text-white">
              <div
                className={`px-4 py-2 text-sm hover:bg-surface-hover cursor-pointer ${selectedSymbol === 'All' ? 'text-accent-purple bg-accent-purple/5' : ''}`}
                onClick={() => setSelectedSymbol('All')}
              >
                All Symbols
              </div>
              {SYMBOLS.map(s => (
                <div
                  key={s}
                  className={`px-4 py-2 text-sm hover:bg-surface-hover cursor-pointer ${selectedSymbol === s ? 'text-accent-purple bg-accent-purple/5' : ''}`}
                  onClick={() => setSelectedSymbol(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 bg-surface-card border border-border-color rounded-lg flex items-center gap-2 text-sm text-white hover:border-accent-purple transition-colors">
              Period: <span className="text-accent-purple font-semibold">{dateRangeSelection}</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-surface-card border border-border-color rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden text-white">
              <div
                className={`px-4 py-2 text-sm hover:bg-surface-hover cursor-pointer ${dateRangeSelection === 'Last 7 Days' ? 'text-accent-purple bg-accent-purple/5' : ''}`}
                onClick={() => handleDateSelection('Last 7 Days', 7)}
              >
                Last 7 Days
              </div>
              <div
                className={`px-4 py-2 text-sm hover:bg-surface-hover cursor-pointer ${dateRangeSelection === 'Last 30 Days' ? 'text-accent-purple bg-accent-purple/5' : ''}`}
                onClick={() => handleDateSelection('Last 30 Days', 30)}
              >
                Last 30 Days
              </div>
              <div
                className={`px-4 py-2 text-sm hover:bg-surface-hover cursor-pointer ${dateRangeSelection === 'All Time' ? 'text-accent-purple bg-accent-purple/5' : ''}`}
                onClick={() => handleDateSelection('All Time', 365)}
              >
                All Time
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-text-secondary font-mono">
          Last sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <ErrorBoundary>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Journal' && <TradeHistoryTable trades={filteredTrades} />}
        {activeTab === 'Performance' && <TimeAnalysis hourlyPnL={stats.hourlyPnL} sessionStats={stats.sessionStats} />}
      </ErrorBoundary>

      {(activeTab === 'Portfolio' || activeTab === 'History') && (
        <div className="card text-center py-20">
          <Activity size={48} className="mx-auto text-accent-purple mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
          <p className="text-text-secondary">This section is currently under development.</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
