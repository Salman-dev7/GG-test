
import { storage } from './storage';
import { Habit, Settings } from './types';

/**
 * Compatibility layer for the legacy database interface.
 * Delegates calls to the new storage provider.
 */

// Added initDB to satisfy index.tsx import
export const initDB = async () => {
  // Trigger database initialization by performing a read operation
  await storage.habits.getAll();
  return Promise.resolve();
};

// Added getHabits to satisfy db-seed.ts and SettingsView.tsx imports
export const getHabits = () => storage.habits.getAll();

// Added saveHabit to satisfy db-seed.ts import
export const saveHabit = (habit: Habit) => storage.habits.save(habit);

// Added getAllCheckins to satisfy SettingsView.tsx import
export const getAllCheckins = () => storage.checkins.getAll();

// Added saveSettings to satisfy SettingsView.tsx import
export const saveSettings = (settings: Settings) => storage.settings.save(settings);
