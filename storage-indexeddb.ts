
import { openDB, IDBPDatabase } from 'idb';
import { Habit, Checkin, Settings } from './types';
// Fix: Import IStorageProvider from storage.ts instead of types.ts
import { IStorageProvider } from './storage';

const DB_NAME = 'AuraHabitDB';
const DB_VERSION = 1;

export class IndexedDBProvider implements IStorageProvider {
  private db: Promise<IDBPDatabase> | null = null;

  private async getDB() {
    if (this.db) return this.db;
    this.db = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('habits')) {
          db.createObjectStore('habits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('checkins')) {
          const store = db.createObjectStore('checkins', { keyPath: ['habitId', 'dateISO'] });
          store.createIndex('by-date', 'dateISO');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
    return this.db;
  }

  habits = {
    getAll: async () => (await this.getDB()).getAll('habits'),
    getById: async (id: string) => (await this.getDB()).get('habits', id),
    save: async (habit: Habit) => { await (await this.getDB()).put('habits', habit); },
    delete: async (id: string) => { await (await this.getDB()).delete('habits', id); },
  };

  checkins = {
    getAll: async () => (await this.getDB()).getAll('checkins'),
    getByDate: async (dateISO: string) => (await this.getDB()).getAllFromIndex('checkins', 'by-date', dateISO),
    toggle: async (habitId: string, dateISO: string, completed: boolean) => {
      const db = await this.getDB();
      if (completed) {
        await db.put('checkins', { habitId, dateISO, completed });
      } else {
        await db.delete('checkins', [habitId, dateISO]);
      }
    }
  };

  settings = {
    get: async (): Promise<Settings> => {
      const s = await (await this.getDB()).get('settings', 'main');
      return s || { theme: 'system', accentColor: 'purple', weekStartsOn: 1, notificationsEnabled: false };
    },
    save: async (settings: Settings) => {
      await (await this.getDB()).put('settings', { ...settings, id: 'main' });
    }
  };
}
