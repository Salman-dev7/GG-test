import { Habit, Checkin, Settings } from './types';
import { IndexedDBProvider } from './storage-indexeddb';

/**
 * The Storage Interface defines the contract. 
 * Any provider (IndexedDB, SQLite, FileSystem) must implement this.
 */
export interface IStorageProvider {
  habits: {
    getAll(): Promise<Habit[]>;
    getById(id: string): Promise<Habit | undefined>;
    save(habit: Habit): Promise<void>;
    delete(id: string): Promise<void>;
  };
  checkins: {
    getAll(): Promise<Checkin[]>;
    getByDate(dateISO: string): Promise<Checkin[]>;
    toggle(habitId: string, dateISO: string, completed: boolean): Promise<void>;
  };
  settings: {
    get(): Promise<Settings>;
    save(settings: Settings): Promise<void>;
  };
}

// Current active provider. 
// In Electron, we would use a conditional import or environment check here.
export const storage: IStorageProvider = new IndexedDBProvider();