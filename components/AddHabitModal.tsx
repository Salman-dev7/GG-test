import React, { useState } from 'react';
import { Habit, HabitType } from '../types.ts';
import { X, Check, Target, Zap, Clock } from 'lucide-react';

interface AddHabitModalProps {
  onClose: () => void;
  onSave: (habit: Habit) => void;
  accentColor: string;
}

const ICONS = ['🚫', '🧘', '🏃', '⏰', '🎓', '💊', '💧', '🥗', '🧠', '💼', '💪', '📚', '🎸', '🌱'];
const COLORS = ['#FF385C', '#9C38FF', '#38A1FF', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4'];
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-[340px] lg:max-w-[420px] glass rounded-[32px] lg:rounded-[40px] ios-shadow p-6 lg:p-8 flex flex-col space-y-6 lg:space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl lg:text-2xl font-black tracking-tight">Create New</h2>
            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">Initialize Protocol</p>
          </div>
          <button onClick={onClose} className="p-2 lg:p-3 glass rounded-full opacity-60 hover:opacity-100 transition-all active:scale-90">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 lg:space-y-6 overflow-y-auto no-scrollbar max-h-[60vh] lg:max-h-[70vh] pr-1">
          <div className="space-y-1.5 lg:space-y-2">
            <label className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Objective</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deep Work"
              className="w-full p-3.5 lg:p-4 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl outline-none focus:ring-1 transition-all font-bold text-sm lg:text-base"
              style={{ '--tw-ring-color': `${accentColor}55` } as React.CSSProperties}
            />
          </div>

          <div className="flex p-0.5 lg:p-1 glass rounded-xl lg:rounded-2xl">
            {(['Habit', 'Task'] as HabitType[]).map(t => (
              <button 
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 lg:py-3 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black transition-all ${
                  type === t ? 'bg-white text-slate-900 shadow-md' : 'opacity-40 hover:opacity-60'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Icon</label>
              <div className="grid grid-cols-4 gap-1.5 lg:gap-2 glass p-2 lg:p-3 rounded-xl lg:rounded-2xl">
                {ICONS.slice(0, 12).map(i => (
                  <button 
                    key={i} 
                    onClick={() => setIcon(i)}
                    className={`aspect-square flex items-center justify-center rounded-lg lg:rounded-xl transition-all text-base lg:text-xl ${
                      icon === i ? 'bg-white scale-105 shadow-md' : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Color</label>
              <div className="grid grid-cols-4 gap-1.5 lg:gap-2 glass p-2 lg:p-3 rounded-xl lg:rounded-2xl">
                {COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setColor(c)}
                    className="aspect-square rounded-lg lg:rounded-xl transition-all flex items-center justify-center scale-90 hover:scale-100"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={12} className="text-white" strokeWidth={5} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 lg:space-y-2">
            <label className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pattern</label>
            <div className="flex justify-between glass p-1.5 lg:p-2 rounded-xl lg:rounded-2xl">
              {DAYS.map(d => (
                <button 
                  key={d} 
                  onClick={() => toggleDay(d)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black transition-all ${
                    schedule.includes(d) 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'opacity-30 hover:bg-white/10 hover:opacity-100'
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
          className="w-full py-4 lg:py-5 text-white font-black rounded-2xl lg:rounded-3xl shadow-xl active:scale-[0.98] disabled:opacity-20 transition-all text-[11px] lg:text-[13px] uppercase tracking-[0.2em]"
          style={{ backgroundColor: accentColor }}
        >
          Activate
        </button>
      </div>
    </div>
  );
};

export default AddHabitModal;