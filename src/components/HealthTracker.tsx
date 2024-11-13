import React, { useState } from 'react';
import { Plus, Droplets, Moon } from 'lucide-react';

type FoodEntry = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  calories: number;
  protein: number;
  sugar: number;
};

type Unit = 'pieces' | 'oz' | 'g' | 'ml' | 'cups';

export function HealthTracker() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('pieces');
  const [waterIntake, setWaterIntake] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);

  const addFoodEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.trim() || !amount.trim()) return;

    // Simulated nutrition data (in a real app, this would come from an API)
    const mockNutritionData = {
      calories: Math.floor(Math.random() * 500) + 100,
      protein: Math.floor(Math.random() * 20) + 5,
      sugar: Math.floor(Math.random() * 15),
    };

    setFoodEntries(prev => [...prev, {
      id: Date.now().toString(),
      name: newFood,
      amount,
      unit,
      ...mockNutritionData
    }]);
    setNewFood('');
    setAmount('');
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalSugar = foodEntries.reduce((sum, entry) => sum + entry.sugar, 0);

  const getHealthStatus = () => {
    if (foodEntries.length === 0) return { color: 'bg-gray-100', text: 'No data' };
    
    const sugarRatio = totalSugar / (foodEntries.length * 25); // 25g sugar daily recommended
    const proteinRatio = totalProtein / (foodEntries.length * 50); // 50g protein daily recommended
    const waterRatio = waterIntake / 8; // 8 glasses recommended
    const sleepRatio = sleepHours / 8; // 8 hours recommended

    const totalScore = (
      (1 - Math.min(sugarRatio, 1)) +
      Math.min(proteinRatio, 1) +
      Math.min(waterRatio, 1) +
      Math.min(sleepRatio, 1)
    ) / 4;

    if (totalScore > 0.8) return { color: 'bg-green-500', text: 'Excellent' };
    if (totalScore > 0.6) return { color: 'bg-green-400', text: 'Good' };
    if (totalScore > 0.4) return { color: 'bg-yellow-400', text: 'Fair' };
    if (totalScore > 0.2) return { color: 'bg-orange-400', text: 'Poor' };
    return { color: 'bg-red-500', text: 'Needs Improvement' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Tracker</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Water Intake (glasses)</span>
            </div>
          </label>
          <input
            type="range"
            min="0"
            max="12"
            value={waterIntake}
            onChange={(e) => setWaterIntake(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 text-center font-medium text-blue-600">
            {waterIntake} / 12 glasses
          </div>
          <div 
            className="absolute left-0 right-0 bottom-0 h-1 bg-blue-200 rounded-full overflow-hidden"
          >
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(waterIntake / 12) * 100}%` }}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Sleep (hours)</span>
            </div>
          </label>
          <input
            type="range"
            min="0"
            max="12"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 text-center font-medium text-indigo-600">
            {sleepHours} hours
          </div>
          <div 
            className="absolute left-0 right-0 bottom-0 h-1 bg-indigo-200 rounded-full overflow-hidden"
          >
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(sleepHours / 12) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={addFoodEntry} className="space-y-3 mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            placeholder="Add food (e.g., 'Big Mac')"
            className="flex-1 p-2 border border-gray-200 rounded-lg"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-24 p-2 border border-gray-200 rounded-lg"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-24 p-2 border border-gray-200 rounded-lg"
          >
            <option value="pieces">pieces</option>
            <option value="oz">oz</option>
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="cups">cups</option>
          </select>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${healthStatus.color} text-white transition-colors duration-300`}>
          <div className="text-sm font-medium">Health Status</div>
          <div className="text-2xl font-bold">{healthStatus.text}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Calories</div>
            <div className="font-bold text-gray-900">{totalCalories}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Protein</div>
            <div className="font-bold text-gray-900">{totalProtein}g</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Sugar</div>
            <div className="font-bold text-gray-900">{totalSugar}g</div>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {foodEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-gray-50 p-3 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700">{entry.name}</span>
                <span className="text-sm text-gray-500">
                  {entry.amount} {entry.unit}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {entry.calories} cal | {entry.protein}g protein | {entry.sugar}g sugar
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}