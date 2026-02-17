import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { Habit, Checkin, TabType, Settings, AccentColor } from './types';
import { storage } from './storage';
import { ErrorBoundary } from './components/ErrorBoundary';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/layout/TopBar';

// Lazy load pages for performance
const TodayPage = lazy(() => import('./pages/TodayPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({ 
    theme: 'dark', 
    accentColor: 'pink',
    weekStartsOn: 1, 
    notificationsEnabled: false 
  });
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Aura: Refresh failed", err);
    }
  }, []);

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, [refreshData]);

  useEffect(() => {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.style.setProperty('--accent', ACCENT_MAP[settings.accentColor]);
  }, [settings.accentColor]);

  const handleToggle = async (habitId: string, dateISO: string, completed: boolean) => {
    setCheckins(prev => {
      const filtered = prev.filter(c => !(c.habitId === habitId && c.dateISO === dateISO));
      if (completed) return [...filtered, { habitId, dateISO, completed }];
      return filtered;
    });
    try {
      await storage.checkins.toggle(habitId, dateISO, completed);
      if ('vibrate' in navigator) navigator.vibrate(8);
    } catch (err) {
      refreshData();
    }
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-12 h-12 border-2 border-white/5 border-t-pink-500 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden flex bg-[#0A0A0A] text-white selection:bg-pink-500/30">
        
        {/* Responsive Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
          accentColor={ACCENT_MAP[settings.accentColor]}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          {/* TopBar with Hamburger and Context Actions */}
          <TopBar 
            title={activeTab} 
            onMenuClick={() => setIsSidebarOpen(true)} 
          />

          <main className="flex-1 overflow-hidden">
            <Suspense fallback={null}>
              {activeTab === 'Today' && (
                <TodayPage 
                  habits={habits} 
                  checkins={checkins} 
                  onToggle={handleToggle}
                  accentColor={ACCENT_MAP[settings.accentColor]}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'Habits' && (
                <HabitsPage 
                  habits={habits} 
                  checkins={checkins}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'Calendar' && (
                <HistoryPage 
                  habits={habits} 
                  checkins={checkins} 
                  onToggle={handleToggle}
                />
              )}
              {activeTab === 'Settings' && (
                <SettingsPage 
                  settings={settings} 
                  onUpdateSettings={(s) => {
                    setSettings(s);
                    storage.settings.save(s);
                  }} 
                />
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;