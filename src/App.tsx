import React from 'react';
import { Header } from './components/Header';
import { DailyStoicQuote } from './components/DailyStoicQuote';
import { JournalEntry } from './components/JournalEntry';
import { GoalTracker } from './components/GoalTracker';
import { HealthTracker } from './components/HealthTracker';
import { AIChatSupport } from './components/AIChatSupport';
import { DailyDeed } from './components/DailyDeed';
import { DailyScheduler } from './components/DailyScheduler';
import { ProgressStats } from './components/ProgressStats';
import { ThemeSelector } from './components/ThemeSelector';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DailyStoicQuote />
        <ProgressStats />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <JournalEntry />
            <GoalTracker />
            <DailyScheduler />
          </div>
          <div className="space-y-8">
            <AIChatSupport />
            <HealthTracker />
            <DailyDeed />
          </div>
        </div>
      </main>
      <ThemeSelector />
    </div>
  );
}

export default App;