import { Checkin, Habit, StreakInfo } from '../types';
import { format, addDays, isSameDay } from 'date-fns';

export class StreakService {
  /**
   * Calculates streak statistics for a specific habit based on its checkin history.
   */
  static calculateStreak(habit: Habit, allCheckins: Checkin[]): StreakInfo {
    const relevantCheckins = allCheckins
      .filter(c => c.habitId === habit.id && c.completed)
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

    if (relevantCheckins.length === 0) {
      return { currentStreak: 0, bestStreak: 0, totalCompletions: 0, completionRate: 0 };
    }

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Simplified streak: consecutive days with checkins
    // Note: For custom schedules (e.g. only Tue/Thu), logic would be more complex
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let checkDate = today;
    const checkinMap = new Set(relevantCheckins.map(c => c.dateISO));

    // Calculate Current Streak (going backwards from today or yesterday)
    let dateStr = format(checkDate, 'yyyy-MM-dd');
    let yesterdayStr = format(addDays(checkDate, -1), 'yyyy-MM-dd');
    
    // If not completed today AND not completed yesterday, streak is broken
    if (!checkinMap.has(dateStr) && !checkinMap.has(yesterdayStr)) {
      currentStreak = 0;
    } else {
      // Start from the most recent completion
      let curr = checkinMap.has(dateStr) ? checkDate : addDays(checkDate, -1);
      while (checkinMap.has(format(curr, 'yyyy-MM-dd'))) {
        currentStreak++;
        curr = addDays(curr, -1);
      }
    }

    // Best Streak Calculation
    const sortedDates = Array.from(checkinMap).sort();
    if (sortedDates.length > 0) {
      tempStreak = 1;
      bestStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        // Using native Date constructor for ISO strings as a reliable alternative to parseISO
        // d1 and d2 will be parsed as midnight UTC for YYYY-MM-DD strings
        const d1 = new Date(sortedDates[i-1]);
        const d2 = new Date(sortedDates[i]);
        if (isSameDay(addDays(d1, 1), d2)) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        bestStreak = Math.max(bestStreak, tempStreak);
      }
    }

    return {
      currentStreak,
      bestStreak,
      totalCompletions: relevantCheckins.length,
      completionRate: relevantCheckins.length / 30 // Rough 30-day rate for demo
    };
  }
}