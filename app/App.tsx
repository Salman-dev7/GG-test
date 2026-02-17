import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { Habit, Checkin, TabType, Settings, AccentColor } from '../types';
import { storage } from '../storage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AppShell from './AppShell';

// Lazy-loaded pages for performance
const TodayPage = lazy(() => import('../pages/today/TodayPage'));
const HabitsPage = lazy(() => import('../pages/habits/HabitsPage'));
const CalendarPage = lazy(() => import('../pages/calendar/CalendarPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

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
      if ('vibrate' in navigator) navigator.vibrate(5);
    } catch (err) {
      refreshData();
    }
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
      <div className="w-8 h-8 border-2 border-white/5 border-t-pink-500 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <ErrorBoundary>
      <AppShell 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        accentColor={ACCENT_MAP[settings.accentColor]}
      >
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
            <HabitsPage habits={habits} checkins={checkins} />
          )}
          {activeTab === 'Calendar' && (
            <CalendarPage habits={habits} checkins={checkins} onToggle={handleToggle} />
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
      </AppShell>
    </ErrorBoundary>
  );
};

export default App;