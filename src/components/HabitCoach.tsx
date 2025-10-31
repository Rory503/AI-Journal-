import React, { useMemo } from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';
import { companionHabits } from '../data/habits';

export function HabitCoach() {
  const { todayData, updateTodayData } = useDailyData();
  const normalizedHabits = useMemo(() => {
    const baseline: Record<string, boolean> = {};
    companionHabits.forEach((habit) => {
      baseline[habit.id] = false;
    });
    return { ...baseline, ...(todayData?.habits ?? {}) };
  }, [todayData?.habits]);

  const completedCount = useMemo(
    () => companionHabits.filter((habit) => normalizedHabits[habit.id]).length,
    [normalizedHabits]
  );

  const completionPercentage = Math.round((completedCount / companionHabits.length) * 100);

  const supportiveMessage = useMemo(() => {
    if (completedCount === 0) {
      return 'Choose one tiny habit to celebrate the day getting started.';
    }
    if (completedCount < companionHabits.length) {
      return 'Beautiful progress—stay curious about one more nurturing action.';
    }
    return 'Every habit complete! Notice how showing up consistently feels in your body.';
  }, [completedCount]);

  const toggleHabit = (habitId: string) => {
    const currentValue = Boolean(normalizedHabits[habitId]);
    updateTodayData({
      habits: {
        ...normalizedHabits,
        [habitId]: !currentValue
      }
    });
  };

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Habit Companion</h2>
          <p className="text-sm text-gray-500">Nurture the rituals that keep you grounded and growing.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600">
          <Flame className="h-4 w-4" />
          {completedCount}/{companionHabits.length} loved today
        </span>
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {supportiveMessage}
      </p>

      <ul className="mt-6 space-y-3">
        {companionHabits.map((habit) => {
          const completed = Boolean(normalizedHabits[habit.id]);
          return (
            <li key={habit.id}>
              <button
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  completed ? 'border-transparent bg-gradient-to-r from-emerald-100 to-sky-100 shadow-inner' : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <span className={`mt-1 ${completed ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-medium text-gray-800">
                      <span className="text-lg" aria-hidden>{habit.emoji}</span>
                      {habit.label}
                    </div>
                    {completed && (
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-emerald-600">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          You have completed <span className="font-medium text-gray-700">{completionPercentage}%</span> of your core habits today.
        </p>
      </div>
    </section>
  );
}
