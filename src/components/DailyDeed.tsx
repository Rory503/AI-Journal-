import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useGameProgress } from '../hooks/useGameProgress';
import { badges } from '../data/badges';

const deeds = [
  'Give someone a genuine compliment',
  "Practice mindfulness for 5 minutes",
  "Write down three things you're grateful for",
  'Do a random act of kindness',
  'Take a short walk in nature',
  "Reach out to someone you haven't talked to in a while",
  'Learn something new for 10 minutes',
  'Organize a small space in your home',
  'Share an inspiring story or quote',
  'Practice deep breathing exercises',
];

export function DailyDeed() {
  const [deed, setDeed] = useState('');
  const [showBadgeAlert, setShowBadgeAlert] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<typeof badges[number] | null>(null);
  const { progress, completeDeed, undoCompleteDeed } = useGameProgress();
  const today = new Date().toDateString();
  const isCompleted = progress.completedDeeds.includes(today);

  useEffect(() => {
    const savedDate = localStorage.getItem('deedDate');
    const savedDeed = localStorage.getItem('currentDeed');

    if (savedDate !== today || !savedDeed) {
      const newDeed = deeds[Math.floor(Math.random() * deeds.length)];
      setDeed(newDeed);
      localStorage.setItem('currentDeed', newDeed);
      localStorage.setItem('deedDate', today);
    } else {
      setDeed(savedDeed);
    }
  }, [today]);

  const handleToggleDeed = () => {
    if (isCompleted) {
      undoCompleteDeed(today);
    } else {
      const { newBadges } = completeDeed(today);
      if (newBadges.length > 0) {
        setEarnedBadge(badges.find(b => b.id === newBadges[0].id) || null);
        setShowBadgeAlert(true);
        setTimeout(() => setShowBadgeAlert(false), 2800);
      }
    }
  };

  return (
    <section className="card relative overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Daily Positive Deed</h2>
          <p className="text-sm text-gray-500">Tiny acts of kindness are powerful coaching wins.</p>
        </div>
        <div className="rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-500">
          {progress.points} pts
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <p className="flex-1 text-gray-700 leading-relaxed">{deed}</p>
        <button
          onClick={handleToggleDeed}
          className="flex-shrink-0 rounded-full bg-rose-50 p-2 text-rose-400 transition hover:bg-rose-100 hover:text-rose-500"
        >
          <Heart
            className={`h-6 w-6 ${
              isCompleted ? 'fill-rose-500 text-rose-500' : ''
            } transition-colors`}
          />
        </button>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Companion badges</p>
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                progress.earnedBadges.includes(badge.id)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
              title={badge.description}
            >
              <span className="text-base">{badge.icon}</span>
              {badge.name}
            </div>
          ))}
        </div>
      </div>

      {showBadgeAlert && earnedBadge && (
        <div className="absolute bottom-full left-1/2 mb-4 w-max -translate-x-1/2 rounded-2xl bg-indigo-500 px-4 py-2 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">{earnedBadge.icon}</span>
            <div>
              <p className="font-semibold">New Badge: {earnedBadge.name}!</p>
              <p className="text-xs text-indigo-100">{earnedBadge.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
