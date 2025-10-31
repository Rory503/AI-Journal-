import React from 'react';
import { CalendarHeart, Sparkle, Smile } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';
import { companionHabits } from '../data/habits';

const moodMessages: Record<string, { title: string; note: string }> = {
  energized: {
    title: 'You are glowing today!',
    note: 'Channel that spark into the intentions that matter most.'
  },
  balanced: {
    title: 'Steady and centered.',
    note: 'A beautiful pace for making gentle progress.'
  },
  reflective: {
    title: 'In a thoughtful mood.',
    note: 'Your reflections are creating space for growth.'
  },
  tender: {
    title: 'Moving through tender feelings.',
    note: 'Be proud of showing up with kindness for yourself.'
  },
  hopeful: {
    title: 'Hopeful and looking ahead.',
    note: 'Every habit you nurture keeps that hope alive.'
  }
};

const fallbackMood = {
  title: 'Hello, friend!',
  note: "Let's set the tone for a caring, focused day together."
};

export function CompanionHero() {
  const { todayData } = useDailyData();
  const baselineHabits = React.useMemo(() => {
    const base: Record<string, boolean> = {};
    companionHabits.forEach((habit) => {
      base[habit.id] = false;
    });
    return base;
  }, []);

  const habits = todayData?.habits ? { ...baselineHabits, ...todayData.habits } : baselineHabits;
  const activeHabits = Object.values(habits).filter(Boolean).length;
  const totalHabits = companionHabits.length;
  const completion = totalHabits === 0 ? 0 : Math.round((activeHabits / totalHabits) * 100);

  const moodKey = todayData?.mood || 'balanced';
  const moodCopy = moodMessages[moodKey] || fallbackMood;

  const displayDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-400 to-emerald-400 text-white shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_60%)]" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sky-50/90 text-sm uppercase tracking-wide">
            <Sparkle className="h-5 w-5" />
            <span>Your gentle growth companion</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            {moodCopy.title}
          </h1>
          <p className="text-lg text-sky-50/90 leading-relaxed max-w-2xl">
            {moodCopy.note}
          </p>

          {todayData?.intention ? (
            <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
              <p className="text-sm uppercase tracking-wide text-sky-50/80">Today's focus</p>
              <p className="mt-1 text-xl font-medium text-white">{todayData.intention}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
              <p className="text-sm text-sky-50/80">Set a calming intention in the Daily Check-In to anchor your day.</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sm text-sky-50/80">
            <span className="inline-flex items-center gap-2">
              <CalendarHeart className="h-5 w-5" />
              {displayDate}
            </span>
            <span className="inline-flex items-center gap-2">
              <Smile className="h-5 w-5" />
              {completion}% habits loved
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Habit wins</h3>
            <p className="text-sky-50/80 text-sm leading-relaxed">
              Celebrate each small promise you keep. You have nourished {activeHabits} of {totalHabits} companion habits today.
            </p>
            <div className="h-2 w-full rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
