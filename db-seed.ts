
import { saveHabit, getHabits } from './db.ts';
import { Habit } from './types.ts';

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Do not drink alcohol',
    icon: '🚫',
    color: '#FF385C',
    type: 'Habit',
    schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Work meeting',
    icon: '⏰',
    color: '#BD1E59',
    type: 'Task',
    schedule: ['Mon', 'Wed', 'Fri'],
    reminderTime: '10:00 AM',
    createdAt: Date.now()
  },
  {
    id: '3',
    name: 'Meditate',
    icon: '🧘',
    color: '#9C38FF',
    type: 'Habit',
    schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    reminderTime: '01:00 PM',
    createdAt: Date.now()
  },
  {
    id: '4',
    name: 'Read a book',
    icon: '🎓',
    color: '#5C38FF',
    type: 'Habit',
    schedule: ['Sun', 'Mon', 'Wed', 'Thu'],
    createdAt: Date.now()
  },
  {
    id: '5',
    name: 'Go jogging',
    icon: '🏃',
    color: '#38A1FF',
    type: 'Habit',
    schedule: ['Sun', 'Tue', 'Wed', 'Sat'],
    reminderTime: '10:30 PM',
    createdAt: Date.now()
  }
];

export const seedDatabase = async () => {
  try {
    const current = await getHabits();
    if (current && current.length === 0) {
      for (const h of INITIAL_HABITS) {
        await saveHabit(h);
      }
    }
  } catch (err) {
    console.warn("Seeding failed, might be running in incognito or non-secure context.", err);
  }
};
