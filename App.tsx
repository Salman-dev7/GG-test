import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, Checkin, TabType, Settings, AccentColor } from './types';
import { storage } from './storage';
import TodayView from './components/TodayView';
import HabitsView from './components/HabitsView';
import CalendarView from './components/CalendarView';
import SettingsView from './components/SettingsView';
import TabBar from './components/TabBar';
import Sidebar from './components/Sidebar';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      const [h, c, s] = await Promise.all([
        storage.habits.getAll(), 
        storage.checkins.getAll(), 
        storage.settings.get()
      ]);
      setHabits(h || []);
      setCheckins(c || []);
      if (s) setSettings(prev => ({ ...prev, ...s }));
    } catch (err) {
      console.error("Aura: Failed to refresh data", err);
    }
  }, []);

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, [refreshData]);

  const handleToggle = async (habitId: string, dateISO: string, completed: boolean) => {
    setCheckins(prev => {
      const filtered = prev.filter(c => !(c.habitId === habitId && c.dateISO === dateISO));
      if (completed) {
        return [...filtered, { habitId, dateISO, completed }];
      }
      return filtered;
    });
    
    try {
      await storage.checkins.toggle(habitId, dateISO, completed);
      if ('vibrate' in navigator) navigator.vibrate(10);
    } catch (err) {
      console.error("Aura: Failed to toggle checkin", err);
      refreshData();
    }
  };

  const handleSaveNewHabit = async (newHabit: Habit) => {
    try {
      await storage.habits.save(newHabit);
      setShowAddModal(false);
      await refreshData();
    } catch (err) {
      console.error("Aura: Failed to save habit", err);
    }
  };

  const handleUpdateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    await storage.settings.save(newSettings);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-transparent">
        <div className="w-16 h-16 border-[4px] border-white/10 border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`h-screen w-screen overflow-hidden flex flex-row relative ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-[400] pt-[var(--ios-safe-top)] bg-red-500/90 backdrop-blur-md text-white py-1 flex items-center justify-center space-x-2 animate-in slide-in-from-top duration-500">
             <WifiOff size={10} strokeWidth={3} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Offline Shell Active</span>
          </div>
        )}

        {/* Dynamic Liquid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000">
          <div 
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[60%] rounded-full blur-[180px] opacity-40 transition-all duration-1000" 
            style={{ 
              backgroundColor: ACCENT_MAP[settings.accentColor],
              transform: `translate(${activeTab === 'Today' ? '0px' : activeTab === 'Habits' ? '-100px' : '100px'}, 0px)`
            }}
          />
          <div 
            className="absolute bottom-[-15%] left-[-20%] w-[70%] h-[70%] rounded-full blur-[160px] opacity-30 transition-all duration-1000" 
            style={{ 
              backgroundColor: ACCENT_MAP[settings.accentColor],
              transform: `scale(${activeTab === 'Settings' ? '1.5' : '1'})`
            }}
          />
        </div>

        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          accentColor={ACCENT_MAP[settings.accentColor]} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden">
          <main className="flex-1 relative z-10 overflow-hidden pt-[calc(env(safe-area-inset-top,20px)+16px)]">
            <div className="h-full w-full max-w-7xl mx-auto">
              {activeTab === 'Today' && (
                <TodayView 
                  habits={habits} 
                  checkins={checkins} 
                  onToggle={handleToggle} 
                  onRefresh={refreshData} 
                  onAddClick={() => setShowAddModal(true)}
                  accentColor={ACCENT_MAP[settings.accentColor]}
                  onMenuClick={() => setIsSidebarOpen(true)}
                />
              )}
              {activeTab === 'Habits' && (
                <HabitsView 
                  habits={habits} 
                  checkins={checkins} 
                  onRefresh={refreshData} 
                  onToggle={handleToggle} 
                  onAddClick={() => setShowAddModal(true)}
                  onMenuClick={() => setIsSidebarOpen(true)}
                />
              )}
              {activeTab === 'Calendar' && (
                <CalendarView habits={habits} checkins={checkins} onToggle={handleToggle} onMenuClick={() => setIsSidebarOpen(true)} />
              )}
              {activeTab === 'Settings' && (
                <SettingsView settings={settings} onUpdateSettings={handleUpdateSettings} onMenuClick={() => setIsSidebarOpen(true)} />
              )}
            </div>
          </main>

          {/* Unified Liquid Dock */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} accentColor={ACCENT_MAP[settings.accentColor]} />
        </div>

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