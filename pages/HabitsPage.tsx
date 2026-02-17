import React, { useMemo } from 'react';
import { Habit, Checkin } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { format, addDays, startOfWeek } from 'date-fns';

interface HabitsPageProps {
  habits: Habit[];
  checkins: Checkin[];
  onRefresh: () => void;
}

const HabitsPage: React.FC<HabitsPageProps> = ({ habits, checkins }) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="h-full flex flex-col px-6 lg:px-10 pb-10 overflow-y-auto no-scrollbar">
      <header className="mb-8 shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Habits</h1>
        <p className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40">Active Protocols</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          return (
            <GlassCard key={habit.id} className="p-5">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-[20px] flex items-center justify-center text-2xl shadow-lg" style={{ backgroundColor: `${habit.color}15`, color: habit.color }}>
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{habit.type}</span>
                  </div>
                </div>
              </div>

              {/* Mini Week View */}
              <div className="flex justify-between items-center px-1">
                {weekDays.map((day, i) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const isDone = checkins.some(c => c.habitId === habit.id && c.dateISO === dayStr && c.completed);
                  const isScheduled = habit.schedule.includes(format(day, 'EEE'));
                  
                  return (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <span className="text-[7px] font-black uppercase opacity-20">{format(day, 'EEEEE')}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isDone ? 'bg-pink-500 text-white' : 
                        isScheduled ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-transparent text-white/10'
                      }`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default HabitsPage;