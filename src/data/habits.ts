export type CompanionHabit = {
  id: string;
  label: string;
  description: string;
  category: 'Mind' | 'Body' | 'Connection';
  emoji: string;
};

export const companionHabits: CompanionHabit[] = [
  {
    id: 'mindful-moment',
    label: 'Mindful Minute',
    description: 'Pause, breathe deeply, and notice how you feel right now.',
    category: 'Mind',
    emoji: '🧘'
  },
  {
    id: 'body-break',
    label: 'Move Your Body',
    description: 'Stretch, dance, or take a short walk to reset your energy.',
    category: 'Body',
    emoji: '🏃'
  },
  {
    id: 'hydrate',
    label: 'Sip Water',
    description: 'Enjoy a glass of water and notice the refreshment.',
    category: 'Body',
    emoji: '💧'
  },
  {
    id: 'gratitude-share',
    label: 'Gratitude Note',
    description: 'Write down something you appreciate about today.',
    category: 'Connection',
    emoji: '💌'
  }
];
