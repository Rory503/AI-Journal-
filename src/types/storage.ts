export type DailyData = {
  date: string;
  waterIntake: number;
  sleepHours: number;
  mood: string;
  energyLevel: number;
  intention: string;
  gratitudeNote: string;
  habits: Record<string, boolean>;
  foodEntries: Array<{
    id: string;
    name: string;
    amount: string;
    unit: string;
    calories: number;
    protein: number;
    sugar: number;
  }>;
  completedGoals: string[];
  journalEntry: string;
  completedDeed: boolean;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
  }>;
};

export type HistoricalData = {
  [date: string]: DailyData;
};