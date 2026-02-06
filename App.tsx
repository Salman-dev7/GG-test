import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, Checkin, TabType, Settings, AccentColor } from './types';
import { initDB, getHabits, getSettings, toggleCheckin, getAllCheckins, saveHabit } from './db';
import TodayView from './components/TodayView';
import HabitsView from './components/HabitsView';
import CalendarView from './components/CalendarView';
import SettingsView from './components/SettingsView';
import TabBar from './components/TabBar';
import AddHabitModal from './components/AddHabitModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WifiOff } from 'lucide-react';

const ACCENT_MAP: Record<AccentColor, string> = {
  pink: '#FF385C',
  purple: '#9C38FF',
  blue: '#38A1FF',
  mint: '#10B981',
  orange: '#F59E0B'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Today');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settings, setSettings] = useState<Settings>({ 
    theme: 'system', 
    accentColor: 'purple',
    weekStartsOn: 1, 
    notificationsEnabled: false 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isDarkMode = useMemo(() => {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.style.setProperty('--accent', ACCENT_MAP[settings.accentColor]);
  }, [isDarkMode, settings.accentColor]);

  const refreshData = useCallback(async () => {
    try {
      const [h, c, s] = await Promise.all([getHabits(), getAllCheckins(), getSettings()]);
      setHabits(h || []);
      setCheckins(c || []);
      if (s) setSettings(prev => ({ ...prev, ...s }));
    } catch (err) {
      console.error("Failed to refresh data", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    initDB()
      .then(() => {
        if (mounted) refreshData().finally(() => setIsLoading(false));
      })
      .catch(err => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [refreshData]);

  const handleToggle = async (habitId: string, dateISO: string, completed: boolean) => {
    setCheckins(prev => {
      const filtered = prev.filter(c => !(c.habitId === habitId && c.dateISO === dateISO));
      return [...filtered, { habitId, dateISO, completed }];
    });
    
    try {
      await toggleCheckin(habitId, dateISO, completed);
      if ('vibrate' in navigator) navigator.vibrate(10);
    } catch (err) {
      refreshData();
    }
  };

  const handleSaveNewHabit = async (newHabit: Habit) => {
    try {
      await saveHabit(newHabit);
      setShowAddModal(false);
      await refreshData();
    } catch (err) {
      alert("Failed to save habit.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-transparent">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`h-screen w-screen overflow-hidden flex flex-col relative ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-[200] pt-[var(--ios-safe-top)] bg-red-500/90 backdrop-blur-md text-white py-0.5 flex items-center justify-center space-x-1.5 animate-in slide-in-from-top duration-300">
             <WifiOff size={9} strokeWidth={3} />
             <span className="text-[8px] font-black uppercase tracking-widest">Running Offline</span>
          </div>
        )}

        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-15%] right-[-10%] w-[70%] h-[50%] rounded-full blur-[160px]" style={{ backgroundColor: ACCENT_MAP[settings.accentColor] }}></div>
          <div className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-30" style={{ backgroundColor: ACCENT_MAP[settings.accentColor] }}></div>
        </div>

        <main className="flex-1 relative z-10 overflow-hidden pt-[calc(env(safe-area-inset-top,20px)+16px)]">
          {activeTab === 'Today' && (
            <TodayView 
              habits={habits} 
              checkins={checkins} 
              onToggle={handleToggle} 
              onRefresh={refreshData} 
              onAddClick={() => setShowAddModal(true)}
              accentColor={ACCENT_MAP[settings.accentColor]}
            />
          )}
          {activeTab === 'Habits' && (
            <HabitsView 
              habits={habits} 
              checkins={checkins} 
              onRefresh={refreshData} 
              onToggle={handleToggle} 
              onAddClick={() => setShowAddModal(true)}
            />
          )}
          {activeTab === 'Calendar' && (
            <CalendarView habits={habits} checkins={checkins} onToggle={handleToggle} />
          )}
          {activeTab === 'Settings' && (
            <SettingsView settings={settings} onUpdateSettings={setSettings} />
          )}
        </main>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} accentColor={ACCENT_MAP[settings.accentColor]} />

        {showAddModal && (
          <AddHabitModal 
            onClose={() => setShowAddModal(false)} 
            onSave={handleSaveNewHabit}
            accentColor={ACCENT_MAP[settings.accentColor]}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;