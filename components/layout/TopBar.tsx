import React from 'react';
import { Menu, Search, Calendar, Info } from 'lucide-react';
import IconButton from '../ui/IconButton';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onMenuClick }) => {
  return (
    <header className="h-16 lg:h-20 flex items-center justify-between px-6 lg:px-10 shrink-0">
      <div className="flex items-center space-x-4">
        <div className="lg:hidden">
          <IconButton icon={Menu} onClick={onMenuClick} className="bg-white/5" />
        </div>
        <div className="hidden lg:block">
           {/* Placeholder for desktop-only breadcrumb or left-aligned search */}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <IconButton icon={Search} className="opacity-40 hover:opacity-100" />
        <IconButton icon={Calendar} className="opacity-40 hover:opacity-100" />
        <IconButton icon={Info} className="opacity-40 hover:opacity-100" />
      </div>
    </header>
  );
};

export default TopBar;