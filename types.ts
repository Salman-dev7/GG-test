export type HabitType = 'Habit' | 'Task';

export interface Habit {
  id: string; // Use UUID strings for compatibility
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  schedule: string[]; // ['Mon', 'Tue', ...]
  reminderTime?: string;
  createdAt: number;
}

export interface Checkin {
  habitId: string;
  dateISO: string; // YYYY-MM-DD
  completed: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0.0 to 1.0
}

export interface HabitProgress extends Habit {
  streak: StreakInfo;
  isCompletedToday: boolean;
}

export type AccentColor = 'pink' | 'purple' | 'blue' | 'mint' | 'orange';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
  weekStartsOn: 0 | 1; 
  notificationsEnabled: boolean;
}

export type TabType = 'Today' | 'Habits' | 'Calendar' | 'Settings';