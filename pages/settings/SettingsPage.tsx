import React from 'react';
import { Settings } from '../../types';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="h-full px-6 lg:px-12 overflow-y-auto no-scrollbar pb-10">
      <header className="mb-10 shrink-0">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Settings</h1>
        <p className="text-[12px] font-black uppercase tracking-[0.2em] opacity-40">Global Protocol Config</p>
      </header>

      <div className="space-y-8 max-w-2xl">
        <section className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-2">Visual Core</label>
          <div className="bg-[#0E0E0E] rounded-[40px] border border-white/5 p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[17px]">Liquid Obsidian</h4>
                <p className="text-xs opacity-30 mt-1">Dark energy theme optimized for focus</p>
              </div>
              <div className="w-12 h-7 bg-white/10 rounded-full flex items-center justify-end px-1 border border-white/5">
                <div className="w-5 h-5 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8">
               <h4 className="font-bold text-[17px] mb-4">Accent Protocol</h4>
               <div className="flex space-x-4">
                  {['pink', 'purple', 'blue', 'mint'].map(c => (
                    <button 
                      key={c}
                      onClick={() => onUpdateSettings({ ...settings, accentColor: c as any })}
                      className={`w-10 h-10 rounded-full transition-transform active:scale-90 ${settings.accentColor === c ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0E0E0E] scale-110' : 'opacity-40'}`}
                      style={{ backgroundColor: c === 'pink' ? '#FF385C' : c === 'purple' ? '#9C38FF' : c === 'blue' ? '#38A1FF' : '#10B981' }}
                    />
                  ))}
               </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-2">System</label>
          <div className="bg-[#0E0E0E] rounded-[40px] border border-white/5 p-8 flex items-center justify-between">
            <span className="font-bold">Aura Shell Pro</span>
            <span className="text-[10px] font-black opacity-30">v1.2.0-stable</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;