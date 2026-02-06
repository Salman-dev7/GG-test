
import { openDB, IDBPDatabase } from 'idb';
import { Habit, Checkin, Settings } from './types.ts';

const DB_NAME = 'AuraHabitDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export const initDB = () => {
  if (dbPromise) return dbPromise;
  
  try {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('habits')) {
          db.createObjectStore('habits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('checkins')) {
          const checkinStore = db.createObjectStore('checkins', { keyPath: 'id', autoIncrement: true });
          checkinStore.createIndex('by-habit-date', ['habitId', 'dateISO'], { unique: true });
          checkinStore.createIndex('by-date', 'dateISO');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  } catch (e) {
    console.warn("IndexedDB not supported or blocked. Persistence disabled.", e);
    return Promise.reject(e);
  }
  return dbPromise;
};

const getDB = async () => {
  try {
    const db = await initDB();
    return db;
  } catch (e) {
    return null;
  }
};

export const getHabits = async (): Promise<Habit[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('habits');
};

export const saveHabit = async (habit: Habit) => {
  const db = await getDB();
  if (!db) return;
  await db.put('habits', habit);
};

export const deleteHabit = async (id: string) => {
  const db = await getDB();
  if (!db) return;
  await db.delete('habits', id);
};

export const getCheckinsByDate = async (dateISO: string): Promise<Checkin[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('checkins', 'by-date', dateISO);
};

export const toggleCheckin = async (habitId: string, dateISO: string, completed: boolean) => {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction('checkins', 'readwrite');
  const index = tx.store.index('by-habit-date');
  const existing = await index.get([habitId, dateISO]);
  
  if (existing) {
    existing.completed = completed;
    await tx.store.put(existing);
  } else {
    await tx.store.add({ habitId, dateISO, completed });
  }
  await tx.done;
};

// Fix: Included missing required property 'accentColor' in default settings fallback objects.
export const getSettings = async (): Promise<Settings> => {
  const db = await getDB();
  if (!db) return { theme: 'system', accentColor: 'purple', weekStartsOn: 1, notificationsEnabled: false };
  const s = await db.get('settings', 'main');
  return s || { theme: 'system', accentColor: 'purple', weekStartsOn: 1, notificationsEnabled: false };
};

export const saveSettings = async (settings: Settings) => {
  const db = await getDB();
  if (!db) return;
  await db.put('settings', { ...settings, id: 'main' });
};

export const getAllCheckins = async (): Promise<Checkin[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('checkins');
};
