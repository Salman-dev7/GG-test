import React from 'react';
import { Habit, Checkin } from '../../types';
import { format, addDays, startOfWeek } from 'date-fns';

interface HabitsPageProps {
  habits: Habit[];
  checkins: Checkin[];
}

const HabitsPage: React.FC<HabitsPageProps> = ({ habits, checkins }) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="h-full flex flex-col px-6 lg:px-12 pb-10 overflow-y-auto no-scrollbar">
      <header className="mb-10 shrink-0">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Habits</h1>
        <p className="text-[12px] font-black uppercase tracking-[0.2em] opacity-40">System Architectures</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {habits.map(habit => (
          <div key={habit.id} className="bg-[#0E0E0E] rounded-[40px] border border-white/5 p-6 lg:p-8 flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-5">
                <div 
                  className="w-16 h-16 rounded-[26px] flex items-center justify-center text-3xl shadow-xl" 
                  style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                >
                  {habit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[20px] tracking-tight">{habit.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{habit.type}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-[28px] border border-white/5">
              {weekDays.map((day, i) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isDone = checkins.some(c => c.habitId === habit.id && c.dateISO === dayStr && c.completed);
                const isScheduled = habit.schedule.includes(format(day, 'EEE'));
                
                return (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <span className="text-[8px] font-black uppercase opacity-20">{format(day, 'EEEEE')}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-white shadow-xl' : 
                      isScheduled ? 'border border-white/10 opacity-40' : 'opacity-5'
                    }`}>
                      {isDone && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitsPage;