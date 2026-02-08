import React from 'react';
import { TabType } from '../types';
import { Calendar, Layout, List, Settings } from 'lucide-react';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  accentColor: string;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, accentColor }) => {
  const tabs: { id: TabType; icon: any; label: string }[] = [
    { id: 'Today', icon: Layout, label: 'Today' },
    { id: 'Habits', icon: List, label: 'Habits' },
    { id: 'Calendar', icon: Calendar, label: 'History' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[160] pointer-events-none flex justify-center pb-[env(safe-area-inset-bottom,0px)]">
      <nav className="pointer-events-auto h-16 w-full glass border-t border-white/10 flex items-center px-6 justify-between">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center transition-all duration-500 ${
                isActive ? 'scale-110 -translate-y-1' : 'text-slate-400 opacity-40'
              }`}
              style={{ color: isActive ? accentColor : undefined }}
            >
              <tab.icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[7px] mt-1 font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabBar;