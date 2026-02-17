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
      className={`
        bg-[#141414] rounded-[32px] border border-white/5 
        relative overflow-hidden transition-all duration-300
        ${onClick ? 'cursor-pointer active:scale-[0.99] hover:bg-[#1A1A1A]' : ''}
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;