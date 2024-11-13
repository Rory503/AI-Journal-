export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
  category: 'deeds' | 'health' | 'goals';
};

export type UserProgress = {
  points: number;
  completedDeeds: string[];
  earnedBadges: string[];
};