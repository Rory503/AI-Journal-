import { useState, useEffect } from 'react';
import { badges } from '../data/badges';
import type { UserProgress } from '../types/gamification';

const POINTS_PER_DEED = 10;

export function useGameProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('userProgress');
    return saved ? JSON.parse(saved) : {
      points: 0,
      completedDeeds: [],
      earnedBadges: []
    };
  });

  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  const checkForNewBadges = (points: number) => {
    const newBadges = badges.filter(badge => 
      !progress.earnedBadges.includes(badge.id) && 
      points >= badge.requiredPoints
    );

    if (newBadges.length > 0) {
      setProgress(prev => ({
        ...prev,
        earnedBadges: [...prev.earnedBadges, ...newBadges.map(b => b.id)]
      }));
      return newBadges;
    }
    return [];
  };

  const completeDeed = (deedDate: string) => {
    if (!progress.completedDeeds.includes(deedDate)) {
      const newPoints = progress.points + POINTS_PER_DEED;
      const newBadges = checkForNewBadges(newPoints);
      
      setProgress(prev => ({
        ...prev,
        points: newPoints,
        completedDeeds: [...prev.completedDeeds, deedDate]
      }));

      return { points: POINTS_PER_DEED, newBadges };
    }
    return { points: 0, newBadges: [] };
  };

  const undoCompleteDeed = (deedDate: string) => {
    setProgress(prev => ({
      ...prev,
      points: Math.max(0, prev.points - POINTS_PER_DEED),
      completedDeeds: prev.completedDeeds.filter(date => date !== deedDate)
    }));
  };

  return {
    progress,
    completeDeed,
    undoCompleteDeed
  };
}