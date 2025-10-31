import React, { useEffect, useMemo, useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Trophy, Target, ListChecks } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDailyData } from '../hooks/useDailyData';

type GoalCategory = 'daily' | 'weekly' | 'longterm';

type Goal = {
  id: string;
  text: string;
  completed: boolean;
  category: GoalCategory;
  deadline?: string;
  area?: string;
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

const areas = ['Health', 'Career', 'Personal', 'Education', 'Financial'] as const;

const initialAchievements: Achievement[] = [
  {
    id: 'first-goal',
    name: 'Goal Setter',
    description: 'Set your first goal',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'deadline-master',
    name: 'Deadline Master',
    description: 'Complete 5 goals before their deadlines',
    icon: '⏰',
    unlocked: false
  },
  {
    id: 'area-expert',
    name: 'Area Expert',
    description: 'Complete goals in 3 different areas',
    icon: '🏆',
    unlocked: false
  }
];

export function GoalTracker() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'achievements',
    initialAchievements
  );
  const [newGoal, setNewGoal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('daily');
  const [selectedArea, setSelectedArea] = useState<typeof areas[number]>('Personal');
  const [deadline, setDeadline] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const { updateTodayData } = useDailyData();

  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).map(goal => goal.text);
    updateTodayData({ completedGoals });
  }, [goals, updateTodayData]);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoal,
      completed: false,
      category: selectedCategory,
      deadline: deadline || undefined,
      area: selectedArea
    };

    const newList = [...goals, goal];
    setGoals(newList);
    checkAchievements(newList);
    setNewGoal('');
    setDeadline('');
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => {
      const newGoals = prev.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      );
      const completedGoals = newGoals.filter(goal => goal.completed).map(goal => goal.text);
      updateTodayData({ completedGoals });
      checkAchievements(newGoals);
      return newGoals;
    });
  };

  const checkAchievements = (currentGoals: Goal[]) => {
    const newAchievements = [...achievements];

    if (!achievements[0].unlocked && currentGoals.length > 0) {
      newAchievements[0].unlocked = true;
    }

    const completedBeforeDeadline = currentGoals.filter(goal => {
      if (!goal.deadline || !goal.completed) return false;
      return new Date(goal.deadline) >= new Date();
    }).length;

    if (!achievements[1].unlocked && completedBeforeDeadline >= 5) {
      newAchievements[1].unlocked = true;
    }

    const completedAreas = new Set(
      currentGoals
        .filter(goal => goal.completed && goal.area)
        .map(goal => goal.area)
    );

    if (!achievements[2].unlocked && completedAreas.size >= 3) {
      newAchievements[2].unlocked = true;
    }

    setAchievements(newAchievements);
  };

  const getDaysUntilDeadline = (goalDeadline: string) => {
    const days = Math.ceil(
      (new Date(goalDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return days;
  };

  const completionSummary = useMemo(() => {
    if (goals.length === 0) {
      return 'Set a focus so your coach can celebrate with you.';
    }
    const completed = goals.filter(goal => goal.completed).length;
    if (completed === 0) return 'You have clear aims—choose one small step to get rolling.';
    if (completed < goals.length) return 'Beautiful! Keep momentum by highlighting the next doable action.';
    return 'All goals checked! Take a breath and honor how far you have come.';
  }, [goals]);

  const dailyWins = goals.filter(goal => goal.category === 'daily' && goal.completed).length;
  const weeklyWins = goals.filter(goal => goal.category === 'weekly' && goal.completed).length;
  const longTermWins = goals.filter(goal => goal.category === 'longterm' && goal.completed).length;

  return (
    <section className="card p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Goal & Habit Coach</h2>
            <p className="text-sm text-gray-500">Design intentions you can actually celebrate—one clear step at a time.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
            <Target className="h-4 w-4" />
            {goals.filter(goal => goal.completed).length}/{goals.length || 1} completed
          </div>
        </div>

        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{completionSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <ListChecks className="h-4 w-4" />
              Daily wins
            </div>
            <p className="mt-2 text-2xl font-semibold text-emerald-800">{dailyWins}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <Calendar className="h-4 w-4" />
              Weekly focus
            </div>
            <p className="mt-2 text-2xl font-semibold text-amber-800">{weeklyWins}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
              <Trophy className="h-4 w-4" />
              Long-term momentum
            </div>
            <p className="mt-2 text-2xl font-semibold text-sky-800">{longTermWins}</p>
          </div>
        </div>

        <form onSubmit={addGoal} className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a goal or habit you want to nourish..."
              className="flex-1 min-w-[200px] rounded-xl border border-gray-200 px-3 py-2 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GoalCategory)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="daily">Daily Ritual</option>
              <option value="weekly">Weekly Focus</option>
              <option value="longterm">Vision Goal</option>
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as typeof areas[number])}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </form>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {showAchievements ? 'Hide achievements' : 'View achievements'}
          </button>
          <span className="text-xs text-gray-400">Coach celebrates every update you save.</span>
        </div>

        {showAchievements && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`rounded-2xl border p-4 ${
                  achievement.unlocked
                    ? 'border-indigo-100 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold">{achievement.name}</h3>
                <p className="text-sm leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {goals.map(goal => (
            <div
              key={goal.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 p-4 hover:border-indigo-200 transition-colors"
            >
              <button
                onClick={() => toggleGoal(goal.id)}
                className="mt-1 text-indigo-500"
              >
                {goal.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`font-medium text-gray-800 ${goal.completed ? 'line-through text-gray-400' : ''}`}>
                    {goal.text}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{goal.area}</span>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                    {goal.category === 'daily' ? 'Daily' : goal.category === 'weekly' ? 'Weekly' : 'Vision'}
                  </span>
                </div>
                {goal.deadline && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {getDaysUntilDeadline(goal.deadline)} days remaining
                  </p>
                )}
              </div>
            </div>
          ))}

          {goals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
              No goals yet—add one above to begin your gentle coaching journey.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
