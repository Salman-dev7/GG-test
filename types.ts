export type HabitType = 'Habit' | 'Task';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  schedule: string[]; // ['Mon', 'Tue', ...]
  reminderTime?: string; // 'HH:mm'
  createdAt: number;
}

export interface Checkin {
  id?: number;
  habitId: string;
  dateISO: string; // YYYY-MM-DD
  completed: boolean;
}

export type AccentColor = 'pink' | 'purple' | 'blue' | 'mint' | 'orange';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
  weekStartsOn: 0 | 1; // 0 for Sunday, 1 for Monday
  notificationsEnabled: boolean;
}

export type TabType = 'Today' | 'Habits' | 'Calendar' | 'Settings';