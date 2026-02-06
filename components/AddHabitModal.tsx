import React, { useState } from 'react';
import { Habit, HabitType } from '../types.ts';
import { X, Check } from 'lucide-react';

interface AddHabitModalProps {
  onClose: () => void;
  onSave: (habit: Habit) => void;
  accentColor: string;
}

const ICONS = ['🚫', '🧘', '🏃', '⏰', '🎓', '💊', '💧', '🥗', '🧠', '💼'];
const COLORS = ['#FF385C', '#9C38FF', '#38A1FF', '#10B981', '#F59E0B', '#6366F1'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onSave, accentColor }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('Habit');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [schedule, setSchedule] = useState<string[]>(DAYS);

  const toggleDay = (day: string) => {
    setSchedule(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const newHabit: Habit = {
      id: generateId(),
      name,
      type,
      icon,
      color,
      schedule,
      createdAt: Date.now()
    };
    onSave(newHabit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass rounded-t-[32px] sm:rounded-[32px] ios-shadow p-6 flex flex-col space-y-5 pb-[env(safe-area-inset-bottom,24px)] animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-extrabold tracking-tight">New Habit</h2>
          <button onClick={onClose} className="p-1.5 glass rounded-full opacity-60"><X size={16} /></button>
        </div>

        <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[60vh]">
          <div className="space-y-1.5">
            <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 ml-1">Habit Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Run"
              className="w-full p-3 glass rounded-xl outline-none focus:ring-1 transition-all font-semibold text-xs"
              style={{ '--tw-ring-color': `${accentColor}66` } as React.CSSProperties}
            />
          </div>

          <div className="flex p-0.5 glass rounded-xl">
            {(['Habit', 'Task'] as HabitType[]).map(t => (
              <button 
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'opacity-40'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 ml-1">Icon</label>
              <div className="flex flex-wrap gap-1.5 glass p-2 rounded-xl justify-center">
                {ICONS.map(i => (
                  <button 
                    key={i} 
                    onClick={() => setIcon(i)}
                    className={`w-6 h-6 flex items-center justify-center rounded-md transition-all text-sm ${icon === i ? 'bg-white scale-110 shadow-sm' : 'opacity-50'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 ml-1">Color</label>
              <div className="flex flex-wrap gap-1.5 glass p-2 rounded-xl justify-center">
                {COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-full transition-all flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={11} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 ml-1">Schedule</label>
            <div className="flex justify-between glass p-1.5 rounded-xl">
              {DAYS.map(d => (
                <button 
                  key={d} 
                  onClick={() => toggleDay(d)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-[8px] font-black transition-all ${
                    schedule.includes(d) ? 'bg-slate-900 text-white shadow-sm' : 'opacity-30'
                  }`}
                >
                  {d[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full p-3 text-white font-bold rounded-xl shadow-md active:scale-95 disabled:opacity-30 transition-all text-xs"
          style={{ backgroundColor: accentColor }}
        >
          Create Habit
        </button>
      </div>
    </div>
  );
};

export default AddHabitModal;