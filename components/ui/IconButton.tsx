import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  size?: number;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, onClick, className = '', size = 18 }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all active:scale-90 ${className}`}
    >
      <Icon size={size} />
    </button>
  );
};

export default IconButton;