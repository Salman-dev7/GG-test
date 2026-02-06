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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[300px] glass rounded-[24px] ios-shadow p-4 flex flex-col space-y-3.5 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-extrabold tracking-tight">New Habit</h2>
          <button onClick={onClose} className="p-1 glass rounded-full opacity-60"><X size={12} /></button>
        </div>

        <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[60vh]">
          <div className="space-y-1">
            <label className="text-[6px] font-black uppercase tracking-widest text-slate-400 ml-1">Habit Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Run"
              className="w-full p-2 glass rounded-lg outline-none focus:ring-1 transition-all font-bold text-[10px]"
              style={{ '--tw-ring-color': `${accentColor}44` } as React.CSSProperties}
            />
          </div>

          <div className="flex p-0.5 glass rounded-lg">
            {(['Habit', 'Task'] as HabitType[]).map(t => (
              <button 
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-1 rounded-md text-[8px] font-black transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'opacity-40'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[6px] font-black uppercase tracking-widest text-slate-400 ml-1">Icon</label>
              <div className="flex flex-wrap gap-1 glass p-1 rounded-lg justify-center">
                {ICONS.map(i => (
                  <button 
                    key={i} 
                    onClick={() => setIcon(i)}
                    className={`w-4 h-4 flex items-center justify-center rounded transition-all text-[10px] ${icon === i ? 'bg-white scale-110 shadow-xs' : 'opacity-40'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[6px] font-black uppercase tracking-widest text-slate-400 ml-1">Color</label>
              <div className="flex flex-wrap gap-1 glass p-1 rounded-lg justify-center">
                {COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setColor(c)}
                    className="w-4 h-4 rounded-full transition-all flex items-center justify-center scale-90"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={8} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[6px] font-black uppercase tracking-widest text-slate-400 ml-1">Schedule</label>
            <div className="flex justify-between glass p-1 rounded-lg">
              {DAYS.map(d => (
                <button 
                  key={d} 
                  onClick={() => toggleDay(d)}
                  className={`w-5 h-5 flex items-center justify-center rounded-md text-[6px] font-black transition-all ${
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
          className="w-full p-2.5 text-white font-black rounded-lg shadow-md active:scale-95 disabled:opacity-20 transition-all text-[9px] uppercase tracking-widest"
          style={{ backgroundColor: accentColor }}
        >
          Create Habit
        </button>
      </div>
    </div>
  );
};

export default AddHabitModal;