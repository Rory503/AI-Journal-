import React from 'react';
import { Droplets, Moon, StretchVertical, Coffee } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';

const restSuggestions = [
  {
    id: 'pause',
    title: 'Pause for 3 breaths',
    detail: 'Lengthen your exhales and soften your shoulders.'
  },
  {
    id: 'stretch',
    title: 'Gentle stretch',
    detail: 'Reach overhead and sway side-to-side to wake up your body.'
  },
  {
    id: 'nourish',
    title: 'Drink something warm',
    detail: 'Sip tea or warm water to invite comfort into your day.'
  }
];

export function HealthTracker() {
  const { todayData, updateTodayData } = useDailyData();

  const waterIntake = todayData?.waterIntake ?? 0;
  const sleepHours = todayData?.sleepHours ?? 0;
  const energyLevel = todayData?.energyLevel ?? 3;

  const handleWaterChange = (value: number) => {
    updateTodayData({ waterIntake: value });
  };

  const handleSleepChange = (value: number) => {
    updateTodayData({ sleepHours: value });
  };

  const suggestionIndex = Math.min(
    restSuggestions.length - 1,
    Math.max(0, Math.floor((energyLevel - 1) / 2))
  );
  const suggestion = restSuggestions[suggestionIndex];

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Self-Care Rituals</h2>
          <p className="text-sm text-gray-500">Track the essentials that keep your mind clear and your body supported.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex items-center justify-between text-sm font-medium text-sky-700">
            <span className="inline-flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Water sipped
            </span>
            <span>{waterIntake} / 8 cups</span>
          </div>
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={waterIntake}
            onChange={(event) => handleWaterChange(Number(event.target.value))}
            className="mt-3 w-full accent-sky-500"
          />
          <p className="mt-2 text-xs text-sky-600">Hydration supports steady energy and clearer thinking.</p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex items-center justify-between text-sm font-medium text-indigo-700">
            <span className="inline-flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Restful sleep
            </span>
            <span>{sleepHours} hrs</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={sleepHours}
            onChange={(event) => handleSleepChange(Number(event.target.value))}
            className="mt-3 w-full accent-indigo-500"
          />
          <p className="mt-2 text-xs text-indigo-600">Aim for rhythms that help your body restore overnight.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Energy vibe</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">Level {energyLevel}</p>
          <p className="mt-3 text-sm text-emerald-700">Notice what your body is asking for and respond with kindness.</p>
        </div>
        <div className="rounded-2xl bg-white shadow-inner border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mini reset</p>
          <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
            <StretchVertical className="h-5 w-5 text-emerald-500" />
            <span>
              <span className="font-medium text-slate-800 block">{suggestion.title}</span>
              {suggestion.detail}
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Nourish</p>
          <div className="mt-2 flex items-start gap-2 text-sm text-amber-700">
            <Coffee className="h-5 w-5" />
            <span>
              Savor a mindful snack or drink—let it remind you you are cared for.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
