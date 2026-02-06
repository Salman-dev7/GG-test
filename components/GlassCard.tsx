import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass rounded-[32px] p-3.5 relative overflow-hidden transition-all duration-300 active:scale-[0.98] ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Subtle internal top highlight for iOS realism */}
      <div className="absolute inset-0 pointer-events-none rounded-[32px] border-t-[0.5px] border-white/40 z-20"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;