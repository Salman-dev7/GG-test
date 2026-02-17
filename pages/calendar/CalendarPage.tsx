import React, { useState, useMemo } from 'react';
import { format, endOfMonth, eachDayOfInterval, isToday, addDays, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { Habit, Checkin } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPageProps {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: any;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ habits, checkins }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getDayRate = (date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    const dayCheckins = checkins.filter(c => c.dateISO === iso && c.completed).length;
    const scheduled = habits.filter(h => h.schedule.includes(format(date, 'EEE'))).length;
    if (scheduled === 0) return 0;
    return dayCheckins / scheduled;
  };

  return (
    <div className="h-full flex flex-col px-6 lg:px-12 pb-10 overflow-y-auto no-scrollbar">
      <header className="flex justify-between items-center mb-10 shrink-0">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">{format(currentMonth, 'MMMM')}</h1>
          <p className="text-[12px] font-black uppercase tracking-[0.2em] opacity-40">{format(currentMonth, 'yyyy')} CHRONOLOGY</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100">
             <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100">
             <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-[#0E0E0E] rounded-[48px] border border-white/5 p-8 lg:p-12 mb-10">
        <div className="grid grid-cols-7 gap-y-6 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-[10px] font-black opacity-20 uppercase tracking-widest">{d}</span>
          ))}
          {calendarDays.map(day => {
            const rate = getDayRate(day);
            const isT = isToday(day);
            const isSameMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <div key={day.toISOString()} className="flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[13px] font-bold transition-all relative
                    ${isT ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0A0A0A]' : ''}
                    ${!isSameMonth ? 'opacity-5' : ''}
                    ${rate > 0.8 ? 'bg-pink-500 text-white shadow-xl' : 
                      rate > 0.4 ? 'bg-pink-500/50 text-white' : 
                      rate > 0 ? 'bg-pink-500/20 text-pink-300' : 'text-white/20 hover:bg-white/5'}
                  `}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0E0E0E] p-6 rounded-[36px] border border-white/5 flex flex-col items-center justify-center">
           <span className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Consistency</span>
           <span className="text-3xl font-extrabold">92%</span>
        </div>
        <div className="bg-[#0E0E0E] p-6 rounded-[36px] border border-white/5 flex flex-col items-center justify-center">
           <span className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Best Streak</span>
           <span className="text-3xl font-extrabold">24d</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;