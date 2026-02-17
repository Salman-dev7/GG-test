import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick, accentColor }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center space-x-4 px-4 py-3 rounded-[20px] transition-all duration-300
        ${isActive ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}
      `}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? accentColor : undefined }} />
      <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
      {isActive && (
        <div className="ml-auto w-1 h-5 rounded-full" style={{ backgroundColor: accentColor }}></div>
      )}
    </button>
  );
};

export default SidebarItem;