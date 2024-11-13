import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { DailyData, HistoricalData } from '../types/storage';

export function useDailyData() {
  const [historicalData, setHistoricalData] = useLocalStorage<HistoricalData>('daily-data', {});
  const today = new Date().toISOString().split('T')[0];

  // Initialize today's data if it doesn't exist
  useEffect(() => {
    if (!historicalData[today]) {
      setHistoricalData(prev => ({
        ...prev,
        [today]: {
          date: today,
          waterIntake: 0,
          sleepHours: 0,
          foodEntries: [],
          completedGoals: [],
          journalEntry: '',
          completedDeed: false,
          events: []
        }
      }));
    }
  }, [today, historicalData, setHistoricalData]);

  const updateTodayData = (updates: Partial<DailyData>) => {
    setHistoricalData(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        ...updates
      }
    }));
  };

  const getDayData = (date: string): DailyData | undefined => {
    return historicalData[date];
  };

  const getAllData = () => historicalData;

  return {
    todayData: historicalData[today] || {},
    updateTodayData,
    getDayData,
    getAllData
  };
}