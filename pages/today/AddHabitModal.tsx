import React, { useState } from 'react';
import { Habit, HabitType } from '../../types';
import { X, Check } from 'lucide-react';

interface AddHabitModalProps {
  onClose: () => void;
  onSave: (habit: Habit) => void;
  accentColor: string;
}

const ICONS = ['🚫', '🧘', '🏃', '⏰', '🎓', '💊', '💧', '🥗', '🧠', '💼', '💪', '📚'];
const COLORS = ['#FF385C', '#9C38FF', '#38A1FF', '#10B981', '#F59E0B', '#6366F1'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onSave, accentColor }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('Habit');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [schedule, setSchedule] = useState<string[]>(DAYS);

  const toggleDay = (day: string) => {
    setSchedule(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      name,
      type,
      icon,
      color,
      schedule,
      createdAt: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-[420px] bg-[#0A0A0A] rounded-[48px] border border-white/5 p-8 lg:p-10 flex flex-col space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Protocol</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">System Architecture</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] no-scrollbar pr-1">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Label</label>
            <input 
              autoFocus
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-white/20 transition-all font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button 
                    key={c} onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={14} className="text-white" strokeWidth={4} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.slice(0, 8).map(i => (
                  <button 
                    key={i} onClick={() => setIcon(i)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${icon === i ? 'bg-white/10 shadow-lg' : 'opacity-30'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Execution Schedule</label>
            <div className="flex justify-between bg-white/[0.02] p-2 rounded-2xl border border-white/5">
              {DAYS.map(d => (
                <button 
                  key={d} onClick={() => toggleDay(d)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                    schedule.includes(d) ? 'bg-white text-black shadow-xl' : 'opacity-20 hover:opacity-100'
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
          className="w-full py-5 text-white font-black rounded-3xl shadow-2xl active:scale-[0.98] disabled:opacity-20 transition-all text-[13px] uppercase tracking-[0.2em]"
          style={{ backgroundColor: accentColor }}
        >
          Initialize Protocol
        </button>
      </div>
    </div>
  );
};

export default AddHabitModal;