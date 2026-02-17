import React, { useState } from 'react';
import { TabType } from '../types';
import { 
  Layout, List, Calendar, Settings as SettingsIcon, 
  Menu, X, Search, Info, Layers, Timer, ChevronRight
} from 'lucide-react';

interface AppShellProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  accentColor: string;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ activeTab, setActiveTab, accentColor, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'Today' as TabType, icon: Layout, label: 'Today' },
    { id: 'Habits' as TabType, icon: List, label: 'Habits' },
    { id: 'Tasks' as TabType, icon: Layers, label: 'Tasks' },
    { id: 'Calendar' as TabType, icon: Calendar, label: 'History' },
    { id: 'Settings' as TabType, icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="h-screen w-screen flex bg-[#050505] text-white overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[210] w-[280px] 
        bg-[#0A0A0A] border-r border-white/5
        transition-transform duration-500 ease-in-out
        lg:translate-x-0 lg:static lg:h-full lg:flex lg:flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full py-8">
          {/* Profile Header */}
          <div className="px-6 flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl shadow-xl">
              👤
            </div>
            <div className="flex flex-col">
              <h2 className="text-[15px] font-bold tracking-tight">Alex Miller</h2>
              <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40">Lv. 12 Protocol</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3.5 rounded-[22px] transition-all duration-300 group
                    ${isActive ? 'bg-white/5 text-white' : 'text-white/30 hover:text-white/70 hover:bg-white/[0.02]'}
                  `}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? accentColor : undefined }} />
                  <span className={`text-[13px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1 h-5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="px-6 mt-auto">
             <div className="p-4 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-40">
                  <Timer size={14} />
                </div>
                <div>
                   <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Focus Session</p>
                   <p className="text-[12px] font-black leading-none mt-1">Ready</p>
                </div>
                <ChevronRight size={14} className="ml-auto opacity-20" />
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* TopBar */}
        <header className="h-20 lg:h-24 flex items-center justify-between px-6 lg:px-12 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-[14px] bg-white/5 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30">Aura Protocol</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors opacity-40 hover:opacity-100">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors opacity-40 hover:opacity-100">
              <Info size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;