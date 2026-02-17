import React from 'react';
import { TabType } from '../../types';
import { Layout, List, Calendar, Settings as SettingsIcon, X, Search, Timer, Layers } from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  accentColor: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, accentColor, isOpen, onClose }) => {
  const items = [
    { id: 'Today' as TabType, icon: Layout, label: 'Today' },
    { id: 'Habits' as TabType, icon: List, label: 'Habits' },
    { id: 'Tasks' as TabType, icon: Layers, label: 'Tasks' }, // Extended UI match
    { id: 'Calendar' as TabType, icon: Calendar, label: 'Categories' }, // Extended UI match
    { id: 'Settings' as TabType, icon: SettingsIcon, label: 'Timer' }, // Extended UI match
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[210] w-[260px] 
        bg-[#0D0D0D] border-r border-white/5
        transition-transform duration-500 ease-in-out
        lg:translate-x-0 lg:static lg:h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full py-8">
          <SidebarProfile name="Alex Miller" level={12} />
          
          <nav className="flex-1 px-4 space-y-2 mt-8">
            {items.map(item => (
              <SidebarItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => onTabChange(item.id)}
                accentColor={accentColor}
              />
            ))}
          </nav>

          <div className="px-6">
            <div className="p-4 rounded-[24px] bg-pink-500/5 border border-pink-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <span className="text-pink-500 text-xs font-bold">★</span>
                </div>
                <span className="text-[11px] font-bold text-pink-500 uppercase tracking-widest">PRO</span>
              </div>
              <span className="text-[10px] opacity-40">v1.2</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;