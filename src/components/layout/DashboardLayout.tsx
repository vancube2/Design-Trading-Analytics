import React from 'react';
import { LayoutDashboard, BookOpen, BarChart3, PieChart, Clock, Settings, Wallet } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded-lg mb-1
      ${active ? 'bg-accent-purple text-white' : 'text-text-secondary hover:bg-surface-hover hover:text-white'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

export const DashboardLayout: React.FC<{
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}> = ({ children, activeTab, setActiveTab }) => {

    return (
        <div className="flex h-screen bg-bg-dark text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border-color flex flex-col p-4 bg-surface-card">
                <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                    <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                        <BarChart3 size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">DERIVERSE<span className="text-accent-purple">.</span></span>
                </div>

                <nav className="flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
                    <SidebarItem icon={BarChart3} label="Performance" active={activeTab === 'Performance'} onClick={() => setActiveTab('Performance')} />
                    <SidebarItem icon={BookOpen} label="Trading Journal" active={activeTab === 'Journal'} onClick={() => setActiveTab('Journal')} />
                    <SidebarItem icon={PieChart} label="Portfolio" active={activeTab === 'Portfolio'} onClick={() => setActiveTab('Portfolio')} />
                    <SidebarItem icon={Clock} label="History" active={activeTab === 'History'} onClick={() => setActiveTab('History')} />
                </nav>

                <div className="mt-auto pt-4 border-t border-border-color">
                    <SidebarItem icon={Settings} label="Settings" onClick={() => { }} />
                    <div className="bg-bg-dark/50 p-3 rounded-xl mt-4 border border-border-color">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet size={16} className="text-primary-bull" />
                            <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Wallet Connect</span>
                        </div>
                        <div className="text-sm font-mono truncate text-text-secondary">0x71...f92a</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative">
                <header className="h-16 border-b border-border-color flex items-center justify-between px-8 bg-surface-card/50 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-semibold">{activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-surface-card rounded-lg border border-border-color text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-bull animate-pulse"></span>
                            Mainnet-Beta
                        </div>
                        <button className="px-4 py-2 bg-accent-purple hover:bg-accent-purple/80 transition-colors rounded-lg font-medium">
                            Export Stats
                        </button>
                    </div>
                </header>

                <div className="p-8 pb-16 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};
