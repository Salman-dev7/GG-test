import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addDays, isSameDay, isToday as isDateToday } from 'date-fns';
import { Habit, Checkin } from '../../types';
import { Check, Plus, MoreHorizontal } from 'lucide-react';
import AddHabitModal from './AddHabitModal';

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
    return Array.from({ length: 31 }).map((_, i) => addDays(today, i - 15));
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
    <div className="h-full flex flex-col px-6 lg:px-12 pb-10 overflow-hidden relative">
      <header className="mb-8 shrink-0">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Today</h1>
        <p className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] opacity-40">
          {stats.completed} OF {stats.total} PROTOCOLS ACTIVE
        </p>
      </header>

      {/* Date Navigator */}
      <div 
        ref={scrollRef}
        className="flex space-x-3 overflow-x-auto no-scrollbar py-4 shrink-0 -mx-6 px-6"
      >
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              data-active={isSelected}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center min-w-[56px] lg:min-w-[64px] py-4 rounded-[28px] transition-all duration-300 ${
                isSelected ? 'text-white shadow-2xl scale-110' : 'bg-white/5 opacity-40 hover:opacity-100'
              }`}
              style={{ backgroundColor: isSelected ? accentColor : undefined }}
            >
              <span className={`text-[9px] font-black uppercase mb-1.5 ${isSelected ? 'text-white/80' : ''}`}>
                {format(day, 'EEE')}
              </span>
              <span className="text-xl font-bold leading-none">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-6 space-y-4 pb-32">
        {filteredHabits.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[40px] opacity-20">
            <p className="text-xs font-black uppercase tracking-widest italic">Temporal Void</p>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const isCompleted = checkins.some(c => c.habitId === habit.id && c.dateISO === dateISO && c.completed);
            return (
              <div 
                key={habit.id}
                onClick={() => onToggle(habit.id, dateISO, !isCompleted)}
                className={`
                  bg-[#0E0E0E] rounded-[36px] border border-white/5 p-4 lg:p-5 flex items-center transition-all cursor-pointer group
                  ${isCompleted ? 'opacity-40 scale-[0.98]' : 'hover:bg-[#121212]'}
                `}
              >
                <div 
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-[24px] flex items-center justify-center text-3xl shadow-xl mr-5 group-active:scale-95 transition-transform"
                  style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                >
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[17px] lg:text-[19px] truncate tracking-tight">{habit.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mt-1">{habit.type}</p>
                </div>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isCompleted ? 'bg-white border-white' : 'border-white/10 bg-white/5'}
                `}>
                  {isCompleted && <Check size={20} strokeWidth={4} className="text-[#0A0A0A]" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-10 right-8 lg:bottom-12 lg:right-12 w-16 h-16 lg:w-20 lg:h-20 rounded-[28px] lg:rounded-[36px] flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-[150]"
        style={{ backgroundColor: accentColor }}
      >
        <Plus size={36} strokeWidth={3} className="text-white" />
      </button>

      {showAddModal && (
        <AddHabitModal 
          onClose={() => setShowAddModal(false)}
          onSave={async (h) => {
            await (await import('../../storage')).storage.habits.save(h);
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