import React from 'react';

export function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Companion Journal</h1>
          <p className="text-sm text-slate-500">An AI guide for mindful reflection, nourishing habits, and heart-led goals.</p>
        </div>
        <div className="text-sm font-medium text-slate-600">{today}</div>
      </div>
    </header>
  );
}
