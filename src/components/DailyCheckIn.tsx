import React from 'react';
import { Heart, Sparkles, Wand2 } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';

const moods = [
  { id: 'energized', label: 'Energized', description: 'Ready to create momentum', color: 'bg-orange-100 text-orange-700', emoji: '🌞' },
  { id: 'balanced', label: 'Balanced', description: 'Moving with ease and steadiness', color: 'bg-emerald-100 text-emerald-700', emoji: '🌿' },
  { id: 'reflective', label: 'Reflective', description: 'Listening inward with curiosity', color: 'bg-sky-100 text-sky-700', emoji: '🔍' },
  { id: 'tender', label: 'Tender', description: 'Holding space for gentle feelings', color: 'bg-pink-100 text-pink-700', emoji: '💗' },
  { id: 'hopeful', label: 'Hopeful', description: 'Sensing bright possibilities', color: 'bg-violet-100 text-violet-700', emoji: '⭐️' }
];

const energyLabels: Record<number, string> = {
  1: 'Running on empty',
  2: 'Soft and slow',
  3: 'Steady groove',
  4: 'Focused and flowing',
  5: 'Vibrant and unstoppable'
};

export function DailyCheckIn() {
  const { todayData, updateTodayData } = useDailyData();

  const selectedMood = todayData?.mood || 'balanced';
  const energyLevel = todayData?.energyLevel ?? 3;
  const intention = todayData?.intention ?? '';
  const gratitude = todayData?.gratitudeNote ?? '';

  const handleMoodSelect = (moodId: string) => {
    updateTodayData({ mood: moodId });
  };

  const handleEnergyChange = (value: number) => {
    updateTodayData({ energyLevel: value });
  };

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Daily Check-In</h2>
          <p className="text-sm text-gray-500">Name how you are arriving so your companion can support you mindfully.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full">
          <Heart className="h-4 w-4" />
          Showing up counts as progress
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Current Mood</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  selectedMood === mood.id
                    ? 'border-transparent bg-gradient-to-br from-white to-sky-50 shadow-md'
                    : 'border-gray-200 hover:border-sky-200'
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {mood.emoji}
                </span>
                <span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    {mood.label}
                    {selectedMood === mood.id && (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${mood.color}`}>
                        Listening
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500 leading-relaxed">
                    {mood.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-sky-800">Energy Check</p>
              <p className="text-xs text-sky-600">How full does your cup feel today?</p>
            </div>
            <span className="text-sm font-medium text-sky-800 bg-white px-3 py-1 rounded-full">
              {energyLabels[energyLevel as keyof typeof energyLabels]}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={energyLevel}
            onChange={(event) => handleEnergyChange(Number(event.target.value))}
            className="mt-3 w-full accent-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-violet-500" />
              Intention for today
            </span>
            <textarea
              value={intention}
              onChange={(event) => updateTodayData({ intention: event.target.value })}
              placeholder="What gentle focus would support you today?"
              rows={3}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Gratitude spark
            </span>
            <textarea
              value={gratitude}
              onChange={(event) => updateTodayData({ gratitudeNote: event.target.value })}
              placeholder="Write one small thing lighting you up."
              rows={3}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
