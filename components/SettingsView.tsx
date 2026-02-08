
import React from 'react';
import { Settings, AccentColor } from '../types';
import GlassCard from './GlassCard';
import { Moon, Sun, Monitor, Bell, Download, Upload, ShieldCheck, Palette, Smartphone, Menu } from 'lucide-react';
import { saveSettings } from '../db';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  // Added onMenuClick to interface
  onMenuClick?: () => void;
}

const ACCENTS: { id: AccentColor; color: string; label: string }[] = [
  { id: 'pink', color: '#FF385C', label: 'Pink' },
  { id: 'purple', color: '#9C38FF', label: 'Purple' },
  { id: 'blue', color: '#38A1FF', label: 'Blue' },
  { id: 'mint', color: '#10B981', label: 'Mint' },
  { id: 'orange', color: '#F59E0B', label: 'Orange' }
];

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings, onMenuClick }) => {
  const update = (changes: Partial<Settings>) => {
    const next = { ...settings, ...changes };
    onUpdateSettings(next);
    saveSettings(next);
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

  const exportData = async () => {
    const data = {
        habits: await (await import('../db')).getHabits(),
        checkins: await (await import('../db')).getAllCheckins(),
        settings
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col px-4 space-y-6">
      <header className="flex items-center space-x-3">
        {/* Added menu button for mobile layout */}
        <button 
          onClick={onMenuClick}
          className="w-9 h-9 lg:hidden rounded-full glass flex items-center justify-center text-current active:scale-90 transition-transform"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Settings</h1>
          <p className="opacity-50 text-[8px] font-black uppercase tracking-widest mt-0.5">Preferences & Backup</p>
        </div>
      </header>

      <div className="space-y-6 overflow-y-auto no-scrollbar pb-24">
        {!isStandalone && (
          <section className="animate-in fade-in duration-500">
            <div className="flex items-center space-x-1.5 mb-3 ml-1">
              <Smartphone size={11} className="opacity-40" />
              <h2 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Install Aura</h2>
            </div>
            <GlassCard className="bg-gradient-to-br from-[var(--accent)]/10 to-transparent border-[var(--accent)]/20 p-3.5">
              <div className="flex items-start space-x-3">
                 <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-md shrink-0">
                    <Smartphone size={18} />
                 </div>
                 <div>
                    <h3 className="font-bold text-xs leading-none">Add to Home Screen</h3>
                    <p className="text-[10px] opacity-60 mt-1 leading-relaxed">Install for fullscreen with offline access.</p>
                    <div className="mt-3 flex flex-col space-y-1.5">
                       <div className="flex items-center space-x-1.5 text-[8px] font-bold opacity-80">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[7px]">1</span>
                          <span>Tap Share icon at bottom of Safari</span>
                       </div>
                       <div className="flex items-center space-x-1.5 text-[8px] font-bold opacity-80">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[7px]">2</span>
                          <span>Select "Add to Home Screen"</span>
                       </div>
                    </div>
                 </div>
              </div>
            </GlassCard>
          </section>
        )}

        <section>
          <div className="flex items-center space-x-1.5 mb-3 ml-1">
            <Palette size={11} className="opacity-40" />
            <h2 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Theme & Accents</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
             {[
               { id: 'light', icon: Sun, label: 'Light' },
               { id: 'dark', icon: Moon, label: 'Dark' },
               { id: 'system', icon: Monitor, label: 'System' }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => update({ theme: item.id as any })}
                 className={`flex flex-col items-center p-3 rounded-[20px] transition-all ${
                   settings.theme === item.id ? 'bg-current/10' : 'glass opacity-60'
                 }`}
                 style={{ color: settings.theme === item.id ? 'var(--accent)' : undefined }}
               >
                 <item.icon size={16} className="mb-1.5" />
                 <span className="text-[9px] font-bold">{item.label}</span>
               </button>
             ))}
          </div>

          <GlassCard className="flex justify-between items-center p-3.5">
             {ACCENTS.map(acc => (
               <button 
                 key={acc.id}
                 onClick={() => update({ accentColor: acc.id })}
                 className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                   settings.accentColor === acc.id ? 'scale-110 shadow ring-2 ring-current/10' : 'scale-90 opacity-40'
                 }`}
                 style={{ backgroundColor: acc.color, color: acc.color }}
               >
                 {settings.accentColor === acc.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
               </button>
             ))}
          </GlassCard>
        </section>

        <section>
           <div className="flex items-center space-x-1.5 mb-3 ml-1">
             <Bell size={11} className="opacity-40" />
             <h2 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">General</h2>
           </div>
           <GlassCard className="divide-y divide-slate-100/10 p-0 overflow-hidden">
              <div className="p-3.5 flex justify-between items-center active:bg-black/5 transition-colors">
                 <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Bell size={16} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-xs">Push Notifications</span>
                 </div>
                 <div 
                   className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${settings.notificationsEnabled ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'}`}
                   onClick={() => update({ notificationsEnabled: !settings.notificationsEnabled })}
                 >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                 </div>
              </div>
              <div className="p-3.5 flex justify-between items-center active:bg-black/5 transition-colors">
                 <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-green-500" />
                    </div>
                    <span className="font-bold text-xs">Face ID / Touch ID</span>
                 </div>
                 <div className="w-10 h-6 bg-slate-200 dark:bg-white/10 rounded-full p-0.5">
                    <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                 </div>
              </div>
           </GlassCard>
        </section>

        <section>
           <div className="flex items-center space-x-1.5 mb-3 ml-1">
             <Download size={11} className="opacity-40" />
             <h2 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Data & Portability</h2>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={exportData} className="flex items-center justify-center space-x-1.5 p-3.5 glass rounded-[22px] font-bold text-xs active:scale-95 transition-transform">
                 <Download size={16} />
                 <span>Export</span>
              </button>
              <button className="flex items-center justify-center space-x-1.5 p-3.5 glass rounded-[22px] font-bold text-xs opacity-50 cursor-not-allowed">
                 <Upload size={16} />
                 <span>Import</span>
              </button>
           </div>
        </section>

        <div className="flex flex-col items-center pt-6 opacity-40">
           <div className="w-10 h-10 glass rounded-[18px] flex items-center justify-center text-xl mb-3">✨</div>
           <p className="font-black text-[9px] uppercase tracking-[0.15em]">Aura v1.1.0</p>
           <p className="text-[7px] uppercase font-black tracking-widest mt-1.5">PWA Enabled • Verified Offline Shell</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
