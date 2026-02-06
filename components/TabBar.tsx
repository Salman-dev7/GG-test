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
    { id: 'Settings', icon: Settings, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-[calc(env(safe-area-inset-bottom,20px)+6px)] pt-3 glass border-t border-white/10 flex justify-between items-center rounded-t-[28px]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center transition-all duration-400 active:scale-90 ${
              isActive ? 'scale-105' : 'text-slate-400 opacity-50'
            }`}
            style={{ color: isActive ? accentColor : undefined }}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-current/10' : ''}`}>
               <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[8px] mt-0.5 font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabBar;