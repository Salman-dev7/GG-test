
import React, { useState, useMemo } from 'react';
import { format, endOfMonth, eachDayOfInterval, isToday, addDays } from 'date-fns';
import { Habit, Checkin } from '../types';
import GlassCard from './GlassCard';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface CalendarViewProps {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: (habitId: string, dateISO: string, completed: boolean) => void;
  // Added onMenuClick to interface
  onMenuClick?: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ habits, checkins, onMenuClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const streak = useMemo(() => {
    let count = 0;
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    while (true) {
        const iso = format(d, 'yyyy-MM-dd');
        const hasCheckin = checkins.some(c => c.dateISO === iso && c.completed);
        if (hasCheckin) {
            count++;
            d = addDays(d, -1);
        } else {
            break;
        }
    }
    return count;
  }, [checkins]);

  const getDayCompletionRate = (date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    const dayCheckins = checkins.filter(c => c.dateISO === iso && c.completed);
    const dayName = format(date, 'EEE');
    const scheduledToday = habits.filter(h => h.schedule.includes(dayName)).length;
    
    if (scheduledToday === 0) return 0;
    return dayCheckins.length / scheduledToday;
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          {/* Added menu button for mobile layout */}
          <button 
            onClick={onMenuClick}
            className="w-8 h-8 lg:hidden rounded-full glass flex items-center justify-center text-current active:scale-90 transition-transform"
          >
            <Menu size={16} />
          </button>
          <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="p-1.5 glass rounded-lg">
             <ChevronLeft size={16} />
          </button>
        </div>
        <div className="text-center">
            <h1 className="text-base font-bold">{format(currentMonth, 'MMMM')}</h1>
            <p className="text-[8px] opacity-50 font-black tracking-widest">{format(currentMonth, 'yyyy')}</p>
        </div>
        <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="p-1.5 glass rounded-lg">
           <ChevronRight size={16} />
        </button>
      </header>

      <GlassCard className="p-4">
        <div className="grid grid-cols-7 gap-y-3 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <span key={d} className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{d}</span>
          ))}
          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const rate = getDayCompletionRate(day);
            const isT = isToday(day);
            return (
              <div key={day.toISOString()} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative ${
                  isT ? 'border-[1.5px] border-slate-900' : ''
                } ${
                  rate > 0.8 ? 'bg-pink-400 text-white shadow-sm' : 
                  rate > 0.4 ? 'bg-pink-300 text-white' : 
                  rate > 0 ? 'bg-pink-100 text-pink-500' : 'text-slate-500'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <GlassCard className="flex flex-col items-center justify-center p-6 bg-white/60">
           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Streak</span>
           <span className="text-[42px] font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-pink-600 leading-none">
             {streak}
           </span>
           <span className="text-sm font-bold text-slate-800 mt-1">DAYS</span>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
           <GlassCard className="p-3 flex flex-col items-center">
              <span className="text-[7px] font-bold text-slate-400 mb-0.5 uppercase">Best Streak</span>
              <span className="text-lg font-bold">14 Days</span>
           </GlassCard>
           <GlassCard className="p-3 flex flex-col items-center">
              <span className="text-[7px] font-bold text-slate-400 mb-0.5 uppercase">Success Rate</span>
              <span className="text-lg font-bold">88%</span>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
