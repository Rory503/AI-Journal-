import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const themes = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'ocean', name: 'Ocean', icon: '🌊' },
] as const;

export function ThemeSelector() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative group">
        <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Palette className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-xl p-3 flex flex-col gap-2 min-w-[150px]">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTheme(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === t.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}