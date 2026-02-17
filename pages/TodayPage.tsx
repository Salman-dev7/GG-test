import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addDays, isSameDay, isToday as isDateToday } from 'date-fns';
import { Habit, Checkin } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { Check, Plus, MoreHorizontal } from 'lucide-react';
import AddHabitModal from '../components/AddHabitModal';

interface TodayPageProps {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: (habitId: string, dateISO: string, completed: boolean) => void;
  accentColor: string;
  onRefresh: () => void;
}

const TodayPage: React.FC<TodayPageProps> = ({ habits, checkins, onToggle, accentColor, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [showAddModal, setShowAddModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateISO = format(selectedDate, 'yyyy-MM-dd');

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }).map((_, i) => addDays(today, i - 5));
  }, []);

  const filteredHabits = useMemo(() => {
    const dayName = format(selectedDate, 'EEE');
    return habits.filter(h => h.schedule.includes(dayName));
  }, [habits, selectedDate]);

  const stats = useMemo(() => {
    const total = filteredHabits.length;
    const completed = filteredHabits.filter(h => 
      checkins.some(c => c.habitId === h.id && c.dateISO === dateISO && c.completed)
    ).length;
    return { total, completed };
  }, [filteredHabits, checkins, dateISO]);

  useEffect(() => {
    if (scrollRef.current) {
      const selected = scrollRef.current.querySelector('[data-active="true"]');
      if (selected) selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <div className="h-full flex flex-col px-6 lg:px-10 pb-10 overflow-hidden relative">
      <header className="mb-6 shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Today</h1>
        <p className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40">
          {stats.completed} OF {stats.total} COMPLETED
        </p>
      </header>

      {/* Date Navigator */}
      <div 
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto no-scrollbar py-2 shrink-0 -mx-6 px-6"
      >
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isT = isDateToday(day);
          return (
            <button
              key={idx}
              data-active={isSelected}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center min-w-[50px] py-3 rounded-[24px] transition-all duration-300 ${
                isSelected ? 'bg-pink-500 text-white shadow-lg scale-105' : 'bg-white/5 opacity-40 hover:opacity-100'
              }`}
            >
              <span className={`text-[8px] font-black uppercase mb-1 ${isSelected ? 'text-white/80' : ''}`}>
                {format(day, 'EEE')}
              </span>
              <span className="text-lg font-bold leading-none">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Habit List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-6 space-y-3 pb-24">
        {filteredHabits.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] opacity-20">
            <span className="text-xs font-black uppercase tracking-widest">Nothing Scheduled</span>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const isCompleted = checkins.some(c => c.habitId === habit.id && c.dateISO === dateISO && c.completed);
            return (
              <GlassCard 
                key={habit.id}
                onClick={() => onToggle(habit.id, dateISO, !isCompleted)}
                className={`p-4 transition-all ${isCompleted ? 'opacity-40 scale-[0.98]' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-[20px] flex items-center justify-center text-2xl shadow-lg mr-4" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[16px] truncate">{habit.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-0.5">{habit.type}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted ? 'bg-pink-500 border-pink-500' : 'border-white/5 bg-white/5'
                  }`}>
                    {isCompleted ? <Check size={18} strokeWidth={4} className="text-white" /> : <div className="w-1 h-1 rounded-full bg-white/20"></div>}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-8 right-8 w-14 h-14 lg:w-16 lg:h-16 rounded-[24px] lg:rounded-[28px] bg-pink-500 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
      >
        <Plus size={32} strokeWidth={3} className="text-white" />
      </button>

      {showAddModal && (
        <AddHabitModal 
          onClose={() => setShowAddModal(false)}
          onSave={async (h) => {
            await (await import('../storage')).storage.habits.save(h);
            setShowAddModal(false);
            onRefresh();
          }}
          accentColor={accentColor}
        />
      )}
    </div>
  );
};

export default TodayPage;