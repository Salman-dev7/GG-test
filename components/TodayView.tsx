import React, { useState, useMemo } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Habit, Checkin } from '../types';
import GlassCard from './GlassCard';
import { Check, Plus, Calendar, Filter, X, Menu } from 'lucide-react';

interface TodayViewProps {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: (habitId: string, dateISO: string, completed: boolean) => void;
  onRefresh: () => void;
  onAddClick: () => void;
  accentColor: string;
  onMenuClick?: () => void;
}

const TodayView: React.FC<TodayViewProps> = ({ habits, checkins, onToggle, onAddClick, accentColor, onMenuClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateISO = format(selectedDate, 'yyyy-MM-dd');

  const days = useMemo(() => {
    const windowSize = 40;
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
    <div className="h-full flex flex-col px-4 lg:px-10 space-y-4 lg:space-y-6 pt-3 lg:pt-8">
      <header className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="w-10 h-10 lg:hidden rounded-xl glass flex items-center justify-center text-current active:scale-90 transition-transform"
          >
            <Menu size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">Today</h1>
            <p className="opacity-40 text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em]">
              {format(selectedDate, 'EEEE, d MMMM')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCalendarClick}
            className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl glass flex items-center justify-center text-current active:scale-90 transition-transform hover:bg-white/10"
          >
            <Calendar size={18} />
          </button>
          <button className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl glass flex items-center justify-center text-current active:scale-90 transition-transform hover:bg-white/10">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Date Horizontal Selector */}
      <div className="flex space-x-2 lg:space-x-3 overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 shrink-0">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center min-w-[42px] lg:min-w-[54px] py-3 lg:py-4 rounded-[20px] lg:rounded-[26px] transition-all duration-300 ${
                isSelected 
                  ? 'text-white ios-shadow scale-105' 
                  : 'glass opacity-60 hover:opacity-100 hover:bg-white/5'
              }`}
              style={{ backgroundColor: isSelected ? accentColor : undefined }}
            >
              <span className={`text-[7px] lg:text-[8px] uppercase font-black mb-1 ${isSelected ? 'text-white/80' : 'opacity-40'}`}>
                {format(day, 'EEE')}
              </span>
              <span className="text-sm lg:text-lg font-extrabold leading-none">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredHabits.length === 0 ? (
          <GlassCard className="lg:col-span-2 mt-4 py-12 flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-transparent">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 bg-white/5">
              ✨
            </div>
            <p className="font-black text-lg lg:text-xl tracking-tight">Zero Protocol Active</p>
            <p className="text-[10px] lg:text-sm opacity-40 mt-1 mb-6 text-center px-8 max-w-sm">Your schedule is clear. Use this time to recharge your aura.</p>
            <button 
              onClick={onAddClick} 
              className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl glass hover:bg-white/10 active:scale-95 transition-all"
              style={{ color: accentColor }}
            >
              Start New Protocol
            </button>
          </GlassCard>
        ) : (
          filteredHabits.map(habit => {
            const isCompleted = getCheckinState(habit.id);
            return (
              <GlassCard 
                key={habit.id} 
                onClick={() => onToggle(habit.id, dateISO, !isCompleted)} 
                className={`transition-all p-3 lg:p-4 rounded-[24px] lg:rounded-[32px] ${isCompleted ? 'opacity-40 grayscale-[0.2] scale-[0.98]' : 'hover:scale-[1.01]'}`}
              >
                <div className="flex items-center space-x-4 lg:space-x-5">
                  <div className={`w-11 h-11 lg:w-14 lg:h-14 rounded-[18px] lg:rounded-[22px] flex items-center justify-center text-white text-2xl lg:text-3xl ios-shadow transition-all duration-500 ${isCompleted ? 'scale-90 rotate-6 opacity-40' : ''}`} style={{ backgroundColor: habit.color }}>
                    <span>{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-[14px] lg:text-[16px] leading-tight mb-0.5">{habit.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-[7px] lg:text-[8px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-black uppercase tracking-widest opacity-60">{habit.type}</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted ? 'bg-green-500 border-green-500 scale-110 rotate-12' : 'border-slate-200 dark:border-white/10'
                  }`}>
                    {isCompleted ? (
                      <Check size={18} className="text-white animate-checkmark" strokeWidth={4} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      <button 
        className="fixed bottom-20 lg:bottom-12 right-6 lg:right-12 w-12 h-12 lg:w-16 lg:h-16 rounded-[22px] lg:rounded-[28px] ios-shadow flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90 z-[150]"
        style={{ backgroundColor: accentColor }}
        onClick={onAddClick}
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* Responsive Calendar Popup */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-[250px] lg:max-w-[300px] rounded-[32px] lg:rounded-[40px] glass p-5 lg:p-6 animate-in zoom-in-95 duration-500 flex flex-col space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[8px] lg:text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Sync Protocol</p>
                <h2 className="text-lg lg:text-xl font-extrabold">Calendar</h2>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center glass rounded-full opacity-60"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-3 lg:p-4 glass rounded-2xl lg:rounded-3xl">
              <input
                type="date"
                value={dateISO}
                onChange={handleDateChange}
                className="w-full h-10 lg:h-14 rounded-xl lg:rounded-2xl px-3 lg:px-4 text-xs lg:text-sm font-bold bg-white/5 text-current outline-none border border-white/10 appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <button
                className="w-full rounded-[18px] lg:rounded-[22px] py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] glass active:scale-95 transition-all"
                style={{ color: accentColor }}
                onClick={() => {
                  setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)));
                  setIsCalendarOpen(false);
                }}
              >
                Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayView;