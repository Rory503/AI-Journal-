import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Trophy } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

    setGoals(prev => [...prev, goal]);
    checkAchievements([...goals, goal]);
    setNewGoal('');
    setDeadline('');
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => {
      const newGoals = prev.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      );
      checkAchievements(newGoals);
      return newGoals;
    });
  };

  const checkAchievements = (currentGoals: Goal[]) => {
    const newAchievements = [...achievements];

    // First Goal Achievement
    if (!achievements[0].unlocked && currentGoals.length > 0) {
      newAchievements[0].unlocked = true;
    }

    // Deadline Master Achievement
    const completedBeforeDeadline = currentGoals.filter(goal => {
      if (!goal.deadline || !goal.completed) return false;
      return new Date(goal.deadline) >= new Date();
    }).length;

    if (!achievements[1].unlocked && completedBeforeDeadline >= 5) {
      newAchievements[1].unlocked = true;
    }

    // Area Expert Achievement
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

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Goal Tracker</h2>
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <Trophy className="w-5 h-5" />
          <span>Achievements</span>
        </button>
      </div>

      {showAchievements && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlocked
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <h3 className="font-medium">{achievement.name}</h3>
              <p className="text-sm">{achievement.description}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addGoal} className="space-y-4 mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 p-2 border border-gray-200 rounded-lg"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as GoalCategory)}
            className="p-2 border border-gray-200 rounded-lg"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="longterm">Long-term</option>
          </select>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value as typeof areas[number])}
            className="p-2 border border-gray-200 rounded-lg"
          >
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </form>

      <div className="space-y-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => toggleGoal(goal.id)}
                className="flex-shrink-0"
              >
                {goal.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className="flex-1">
                <span className={goal.completed ? 'line-through text-gray-400' : ''}>
                  {goal.text}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500">{goal.area}</span>
                  {goal.deadline && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {getDaysUntilDeadline(goal.deadline)} days left
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}