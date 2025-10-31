import React, { useMemo } from 'react';
import { CalendarHeart, Compass, NotebookPen, Sparkles } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';
import { companionHabits } from '../data/habits';

type CompletionStats = {
  streak: number;
  journalingDays: number;
  averageHabitCompletion: number;
  weeklyGoals: number;
};

const STREAK_LOOKBACK_DAYS = 30;

export function ProgressStats() {
  const { getAllData } = useDailyData();
  const history = getAllData();

  const stats = useMemo<CompletionStats>(() => {
    const dates = Object.keys(history).sort();
    if (dates.length === 0) {
      return {
        streak: 0,
        journalingDays: 0,
        averageHabitCompletion: 0,
        weeklyGoals: 0
      };
    }

    let streak = 0;
    const today = new Date();
    const dateCursor = new Date(today);

    while (streak < STREAK_LOOKBACK_DAYS) {
      const key = dateCursor.toISOString().split('T')[0];
      const entry = history[key];
      if (!entry) {
        break;
      }

      const hasMomentum = Boolean(entry.journalEntry?.trim()) ||
        Object.values(entry.habits || {}).some(Boolean) ||
        entry.completedGoals.length > 0;

      if (!hasMomentum) {
        break;
      }

      streak += 1;
      dateCursor.setDate(dateCursor.getDate() - 1);
    }

    const journalingDays = dates.filter((date) => Boolean(history[date].journalEntry?.trim())).length;

    let totalHabitPercent = 0;
    let countedDays = 0;
    dates.forEach((date) => {
      const entry = history[date];
      if (!entry) return;
      const totalHabits = companionHabits.length;
      const completed = Object.values(entry.habits || {}).filter(Boolean).length;
      totalHabitPercent += totalHabits === 0 ? 0 : completed / totalHabits;
      countedDays += 1;
    });

    const averageHabitCompletion = countedDays === 0
      ? 0
      : Math.round((totalHabitPercent / countedDays) * 100);

    const weeklyGoals = dates
      .slice(-7)
      .reduce((acc, date) => acc + (history[date].completedGoals?.length || 0), 0);

    return {
      streak,
      journalingDays,
      averageHabitCompletion,
      weeklyGoals
    };
  }, [history]);

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Progress Glimpse</h2>
        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-600">
          Consistency blooms through gentle repetition
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ProgressTile
          icon={<CalendarHeart className="h-5 w-5 text-rose-500" />}
          label="Current streak"
          value={`${stats.streak} days`}
          note="Days in a row you have shown up for yourself."
          accent="bg-rose-50"
        />
        <ProgressTile
          icon={<NotebookPen className="h-5 w-5 text-amber-500" />}
          label="Journal moments"
          value={`${stats.journalingDays}`}
          note="Times you have reflected in this space."
          accent="bg-amber-50"
        />
        <ProgressTile
          icon={<Sparkles className="h-5 w-5 text-emerald-500" />}
          label="Habit rhythm"
          value={`${stats.averageHabitCompletion}%`}
          note="Average of your daily companion habits."
          accent="bg-emerald-50"
        />
        <ProgressTile
          icon={<Compass className="h-5 w-5 text-indigo-500" />}
          label="Goals this week"
          value={`${stats.weeklyGoals}`}
          note="Actions completed over the last 7 days."
          accent="bg-indigo-50"
        />
      </div>
    </section>
  );
}

type ProgressTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  accent: string;
};

function ProgressTile({ icon, label, value, note, accent }: ProgressTileProps) {
  return (
    <div className={`${accent} rounded-2xl p-4`}> 
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/70 p-2">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-600 leading-relaxed">{note}</p>
    </div>
  );
}