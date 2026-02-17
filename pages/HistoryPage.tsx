import React from 'react';
import { Habit, Checkin } from '../types';

const HistoryPage: React.FC<{ habits: Habit[]; checkins: Checkin[]; onToggle: any }> = () => {
  return (
    <div className="h-full px-6 lg:px-10">
      <h1 className="text-4xl font-extrabold tracking-tight mb-1">History</h1>
      <p className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40 mb-10">Historical Data</p>
      
      <div className="h-64 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center opacity-20 italic">
        Chronology Visualization Pipeline Loading...
      </div>
    </div>
  );
};

export default HistoryPage;