import React from 'react';
import { TabType } from '../types';
import { 
  Layout, 
  List, 
  Calendar, 
  Settings as SettingsIcon, 
  Trophy, 
  Zap,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  accentColor: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, accentColor, isOpen, onClose }) => {
  const navItems: { id: TabType; icon: any; label: string }[] = [
    { id: 'Today', icon: Layout, label: 'Today' },
    { id: 'Habits', icon: List, label: 'Habits' },
    { id: 'Calendar', icon: Calendar, label: 'History' },
    { id: 'Settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[180] lg:hidden animate-in fade-in duration-500"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[200] w-[210px] lg:w-[260px] 
        glass border-r border-white/10 
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:translate-x-0 lg:static lg:h-full lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header / Profile */}
        <div className="p-4 lg:p-6 pt-10 lg:pt-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-[16px] lg:rounded-[20px] ios-shadow flex items-center justify-center text-xl lg:text-2xl bg-gradient-to-br from-white/20 to-transparent border border-white/30 transition-transform group-hover:scale-105 active:scale-95 cursor-pointer">
                  👤
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white/10 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-[12px] lg:text-[14px] font-black tracking-tight leading-none mb-0.5">Alex Miller</h2>
                <div className="flex items-center space-x-1">
                  <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-slate-400">Level 12</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 glass rounded-full opacity-60 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1 glass rounded-xl lg:rounded-2xl p-2 lg:p-3 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <Zap size={14} className="text-orange-400 mb-0.5" />
              <span className="text-[10px] lg:text-[12px] font-black">420</span>
              <span className="text-[6px] lg:text-[7px] uppercase font-black opacity-40">Aura pts</span>
            </div>
            <div className="flex-1 glass rounded-xl lg:rounded-2xl p-2 lg:p-3 flex flex-col items-center justify-center transition-transform hover:scale-105">
              <Trophy size={14} className="text-yellow-400 mb-0.5" />
              <span className="text-[10px] lg:text-[12px] font-black">#4</span>
              <span className="text-[6px] lg:text-[7px] uppercase font-black opacity-40">Ranking</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 lg:px-4 py-2 space-y-1">
          <p className="px-3 mb-2 text-[7px] lg:text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Main Menu</p>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-[16px] lg:rounded-[20px] transition-all duration-300
                  ${isActive ? 'bg-white/10 scale-[1.02] ios-shadow' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}
                `}
                style={{ color: isActive ? accentColor : undefined }}
              >
                <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                <span className="text-[10px] lg:text-[12px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="p-6 text-center opacity-20">
          <p className="text-[6px] lg:text-[7px] font-black uppercase tracking-[0.3em]">Aura Shell Pro</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;