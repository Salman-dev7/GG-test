import React from 'react';

interface SidebarProfileProps {
  name: string;
  level: number;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ name, level }) => {
  return (
    <div className="px-6 flex items-center space-x-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center text-xl shadow-xl">
          👤
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0D0D0D] rounded-full shadow-lg"></div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-[15px] font-extrabold tracking-tight">{name}</h2>
        <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40">Level {level}</span>
      </div>
    </div>
  );
};

export default SidebarProfile;