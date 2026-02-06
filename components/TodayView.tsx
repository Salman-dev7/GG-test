import React, { useState, useMemo } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Habit, Checkin } from '../types';
import GlassCard from './GlassCard';
import { Check, Plus, Calendar, Filter } from 'lucide-react';

interface TodayViewProps {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: (habitId: string, dateISO: string, completed: boolean) => void;
  onRefresh: () => void;
  onAddClick: () => void;
  accentColor: string;
}

const TodayView: React.FC<TodayViewProps> = ({ habits, checkins, onToggle, onAddClick, accentColor }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateISO = format(selectedDate, 'yyyy-MM-dd');

  const days = useMemo(() => {
    const windowSize = 61;
    const startDate = addDays(selectedDate, -Math.floor(windowSize / 2));
    return Array.from({ length: windowSize }).map((_, i) => addDays(startDate, i));
  }, [selectedDate]);

  const filteredHabits = useMemo(() => {
    const dayName = format(selectedDate, 'EEE');
    return habits.filter(h => h.schedule.includes(dayName));
  }, [habits, selectedDate]);

  const getCheckinState = (habitId: string) => {
    return checkins.some(c => c.habitId === habitId && c.dateISO === dateISO && c.completed);
  };

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const parts = e.target.value.split('-').map(Number);
      const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
      newDate.setHours(0, 0, 0, 0);
      setSelectedDate(newDate);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-4 space-y-4">
      <header className="flex justify-between items-center mb-1">
        <div className="flex flex-col">
          <h1 className="text-[26px] font-extrabold tracking-tight">Today</h1>
          <p className="opacity-50 text-[8px] font-black uppercase tracking-[0.12em] mt-0.5">
            {format(selectedDate, 'EEEE, d MMMM')}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCalendarClick}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-current active:scale-90 transition-transform"
          >
            <Calendar size={18} />
          </button>
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-current active:scale-90 transition-transform">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center min-w-[42px] py-3 rounded-[20px] transition-all duration-300 ${
                isSelected 
                  ? 'text-white ios-shadow scale-105' 
                  : 'glass opacity-60'
              }`}
              style={{ backgroundColor: isSelected ? accentColor : undefined }}
            >
              <span className={`text-[7px] uppercase font-black mb-1 ${isSelected ? 'text-white/80' : 'opacity-60'}`}>
                {format(day, 'EEE')}
              </span>
              <span className="text-base font-extrabold leading-none">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 space-y-3">
        {filteredHabits.length === 0 ? (
          <GlassCard className="mt-6 py-10 flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 bg-white/5">
              ✨
            </div>
            <p className="font-bold text-base">Clear for today!</p>
            <p className="text-xs opacity-50 mt-1 mb-4 text-center px-6">You've finished everything on your list. Take some time to relax.</p>
            <button 
              onClick={onAddClick} 
              className="text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-xl glass active:scale-95"
              style={{ color: accentColor }}
            >
              Add a new task
            </button>
          </GlassCard>
        ) : (
          filteredHabits.map(habit => {
            const isCompleted = getCheckinState(habit.id);
            return (
              <GlassCard 
                key={habit.id} 
                onClick={() => onToggle(habit.id, dateISO, !isCompleted)} 
                className={isCompleted ? 'opacity-50 grayscale-[0.3]' : ''}
              >
                <div className="flex items-center space-x-3 p-0.5">
                  <div className={`w-10 h-10 rounded-[15px] flex items-center justify-center text-white text-xl ios-shadow transition-transform ${isCompleted ? 'scale-90' : ''}`} style={{ backgroundColor: habit.color }}>
                    <span>{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-[13px] leading-tight">{habit.name}</h3>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-black uppercase tracking-wider">{habit.type}</span>
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 border-green-500 scale-110' : 'border-slate-200 dark:border-white/10'
                  }`}>
                    {isCompleted && <Check size={14} className="text-white animate-checkmark" strokeWidth={4} />}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      <button 
        className="fixed bottom-24 right-6 w-12 h-12 rounded-[18px] ios-shadow flex items-center justify-center text-white transition-all hover:scale-105 active:scale-90 z-[60]"
        style={{ backgroundColor: accentColor }}
        onClick={onAddClick}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {isCalendarOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 px-4 pb-24 pt-6">
          <div className="w-full max-w-sm rounded-3xl glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60">Select date</p>
                <h2 className="text-lg font-extrabold">Jump to day</h2>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60"
              >
                Close
              </button>
            </div>
            <input
              type="date"
              value={dateISO}
              onChange={handleDateChange}
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold bg-white/10 text-current"
            />
            <button
              className="mt-4 w-full rounded-2xl py-3 text-[10px] font-black uppercase tracking-[0.3em] glass"
              onClick={() => {
                setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)));
                setIsCalendarOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayView;
