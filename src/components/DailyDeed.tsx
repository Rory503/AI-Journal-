import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useGameProgress } from '../hooks/useGameProgress';
import { badges } from '../data/badges';

const deeds = [
  "Give someone a genuine compliment",
  "Practice mindfulness for 5 minutes",
  "Write down three things you're grateful for",
  "Do a random act of kindness",
  "Take a short walk in nature",
  "Reach out to someone you haven't talked to in a while",
  "Learn something new for 10 minutes",
  "Organize a small space in your home",
  "Share an inspiring story or quote",
  "Practice deep breathing exercises"
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
      const { points, newBadges } = completeDeed(today);
      if (newBadges.length > 0) {
        setEarnedBadge(badges.find(b => b.id === newBadges[0].id) || null);
        setShowBadgeAlert(true);
        setTimeout(() => setShowBadgeAlert(false), 3000);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 relative">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Daily Positive Deed</h2>
        <div className="text-sm font-medium text-blue-600">
          {progress.points} points
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <p className="text-gray-700 flex-1">{deed}</p>
        <button
          onClick={handleToggleDeed}
          className="flex-shrink-0 transition-transform hover:scale-110"
        >
          <Heart
            className={`w-6 h-6 ${
              isCompleted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            } transition-colors`}
          />
        </button>
      </div>

      {/* Badges Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`flex items-center gap-1 p-1 rounded ${
                progress.earnedBadges.includes(badge.id)
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-400'
              }`}
              title={badge.description}
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="text-xs font-medium">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Alert */}
      {showBadgeAlert && earnedBadge && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">{earnedBadge.icon}</span>
            <div>
              <p className="font-medium">New Badge: {earnedBadge.name}!</p>
              <p className="text-sm opacity-90">{earnedBadge.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}