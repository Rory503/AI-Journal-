import React from 'react';
import { useDailyData } from '../hooks/useDailyData';
import { LineChart, Calendar } from 'lucide-react';

export function ProgressStats() {
  const { getAllData } = useDailyData();
  const data = getAllData();
  const dates = Object.keys(data).sort();

  const calculateStats = () => {
    if (dates.length === 0) return { streak: 0, totalDays: 0, completion: 0 };

    let streak = 0;
    let totalCompletedTasks = 0;
    let totalPossibleTasks = 0;

    // Calculate current streak
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = data[dateStr];

      if (!dayData || !isDateCompleted(dayData)) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate overall completion rate
    dates.forEach(date => {
      const dayData = data[date];
      totalPossibleTasks += 4; // water, sleep, goals, deed
      if (dayData.waterIntake >= 8) totalCompletedTasks++;
      if (dayData.sleepHours >= 7) totalCompletedTasks++;
      if (dayData.completedGoals.length > 0) totalCompletedTasks++;
      if (dayData.completedDeed) totalCompletedTasks++;
    });

    return {
      streak,
      totalDays: dates.length,
      completion: Math.round((totalCompletedTasks / totalPossibleTasks) * 100)
    };
  };

  const isDateCompleted = (dayData: any) => {
    return dayData.waterIntake >= 8 || 
           dayData.sleepHours >= 7 || 
           dayData.completedGoals.length > 0 || 
           dayData.completedDeed;
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-blue-700">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-blue-800">{stats.streak} days</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <LineChart className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.completion}%</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-purple-700">Total Days</span>
          </div>
          <p className="text-2xl font-bold text-purple-800">{stats.totalDays}</p>
        </div>
      </div>
    </div>
  );
}