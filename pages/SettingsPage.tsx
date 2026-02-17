import React from 'react';
import { Settings } from '../types';
import GlassCard from '../components/ui/GlassCard';

const SettingsPage: React.FC<{ settings: Settings; onUpdateSettings: (s: Settings) => void }> = () => {
  return (
    <div className="h-full px-6 lg:px-10 overflow-y-auto no-scrollbar pb-10">
      <h1 className="text-4xl font-extrabold tracking-tight mb-1">Settings</h1>
      <p className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40 mb-10">System Preferences</p>

      <div className="space-y-6">
        <section>
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block ml-2">App Config</label>
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold">Dark Mode</h4>
                <p className="text-xs opacity-40">Obsidian visual protocol</p>
              </div>
              <div className="w-12 h-6 bg-pink-500 rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold">Haptic Feedback</h4>
                <p className="text-xs opacity-40">Sensory interaction response</p>
              </div>
              <div className="w-12 h-6 bg-pink-500 rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section>
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block ml-2">Support</label>
          <GlassCard className="p-6">
             <button className="w-full py-4 rounded-2xl bg-white/5 text-xs font-bold uppercase tracking-widest">Aura Professional v1.2</button>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;