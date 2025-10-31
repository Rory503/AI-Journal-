import React from 'react';
import { Header } from './components/Header';
import { CompanionHero } from './components/CompanionHero';
import { DailyCheckIn } from './components/DailyCheckIn';
import { HabitCoach } from './components/HabitCoach';
import { JournalEntry } from './components/JournalEntry';
import { GoalTracker } from './components/GoalTracker';
import { HealthTracker } from './components/HealthTracker';
import { AIChatSupport } from './components/AIChatSupport';
import { DailyDeed } from './components/DailyDeed';
import { DailyStoicQuote } from './components/DailyStoicQuote';
import { ProgressStats } from './components/ProgressStats';
import { ThemeSelector } from './components/ThemeSelector';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <CompanionHero />
        <DailyStoicQuote />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <DailyCheckIn />
            <HabitCoach />
            <JournalEntry />
          </div>
          <div className="space-y-8 lg:col-span-2">
            <ProgressStats />
            <GoalTracker />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <HealthTracker />
          <AIChatSupport />
        </div>

        <DailyDeed />
      </main>
      <ThemeSelector />
    </div>
  );
}

export default App;
