
import React, { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { Habit, Checkin } from '../types';
import GlassCard from './GlassCard';
import { MoreHorizontal, Calendar as CalendarIcon, BarChart2, Plus, Search, Menu } from 'lucide-react';

interface HabitsViewProps {
  habits: Habit[];
  checkins: Checkin[];
  onRefresh: () => void;
  onToggle: (habitId: string, dateISO: string, completed: boolean) => void;
  onAddClick: () => void;
  // Added onMenuClick to interface
  onMenuClick?: () => void;
}

const HabitsView: React.FC<HabitsViewProps> = ({ habits, checkins, onAddClick, onMenuClick }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    const d = addDays(now, diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getWeekProgress = (habit: Habit) => {
    const scheduledCount = habit.schedule.length;
    if (scheduledCount === 0) return 0;
    const weekCheckins = checkins.filter(c => {
      if (c.habitId !== habit.id || !c.completed) return false;
      const parts = c.dateISO.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d >= weekStart && d < addDays(weekStart, 7);
    });
    return Math.min(100, Math.round((weekCheckins.length / scheduledCount) * 100));
  };

  const getDayCheckin = (habitId: string, dayIdx: number) => {
    const targetDate = format(addDays(weekStart, dayIdx), 'yyyy-MM-dd');
    return checkins.some(c => c.habitId === habitId && c.dateISO === targetDate && c.completed);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <header className="flex justify-between items-center">
        {/* Added menu button for mobile layout */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onMenuClick}
            className="w-9 h-9 lg:hidden rounded-full glass flex items-center justify-center text-current active:scale-90 transition-transform"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-[22px] font-extrabold tracking-tight">Habits</h1>
        </div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full glass flex items-center justify-center ios-shadow text-slate-800"><Search size={15} /></button>
          <button onClick={onAddClick} className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center ios-shadow text-white"><Plus size={15} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4">
        {habits.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center glass rounded-2xl opacity-60">
            <p className="font-medium text-xs">No habits yet.</p>
            <button onClick={onAddClick} className="mt-1 text-[10px] font-bold text-purple-600">Start your journey</button>
          </div>
        ) : (
          habits.map(habit => {
            const progress = getWeekProgress(habit);
            return (
              <GlassCard key={habit.id} className="p-4 overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">{habit.name}</h3>
                    <p className="text-[8px] text-purple-600 font-bold uppercase tracking-widest mt-0.5">
                      {habit.schedule.length === 7 ? 'Every day' : habit.schedule.join(' • ')}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base shadow-md" style={{ backgroundColor: habit.color }}>
                    <span>{habit.icon}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 px-0.5">
                  {weekDays.map((day, i) => {
                    const isCompleted = getDayCheckin(habit.id, i);
                    const isScheduled = habit.schedule.includes(day);
                    const dayDate = format(addDays(weekStart, i), 'd');
                    return (
                      <div key={day} className="flex flex-col items-center space-y-1.5">
                        <span className="text-[6px] text-slate-400 font-black uppercase">{day[0]}</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                          isCompleted ? 'bg-green-500 text-white ios-shadow' : 
                          isScheduled ? 'bg-white/40 text-slate-400 border border-white/40' : 'bg-transparent text-slate-200'
                        }`}>
                          {dayDate}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center border-t border-black/5 pt-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Progress: {progress}%</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <button className="p-1.5 glass rounded-lg"><CalendarIcon size={12} /></button>
                    <button className="p-1.5 glass rounded-lg"><BarChart2 size={12} /></button>
                    <button className="p-1.5 glass rounded-lg"><MoreHorizontal size={12} /></button>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitsView;
