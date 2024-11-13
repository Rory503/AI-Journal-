export const badges = [
  {
    id: 'first-deed',
    name: 'First Step',
    description: 'Complete your first daily deed',
    icon: '🌟',
    requiredPoints: 10,
    category: 'deeds'
  },
  {
    id: 'deed-streak-3',
    name: 'Momentum Builder',
    description: 'Complete daily deeds 3 days in a row',
    icon: '🔥',
    requiredPoints: 50,
    category: 'deeds'
  },
  {
    id: 'deed-master',
    name: 'Deed Master',
    description: 'Complete 10 daily deeds',
    icon: '👑',
    requiredPoints: 100,
    category: 'deeds'
  },
  {
    id: 'positivity-champion',
    name: 'Positivity Champion',
    description: 'Earn 500 total points',
    icon: '🌈',
    requiredPoints: 500,
    category: 'deeds'
  }
] as const;