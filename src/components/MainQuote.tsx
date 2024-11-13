import React from 'react';
import { Quote } from 'lucide-react';

export default function MainQuote() {
  return (
    <div className="bg-gradient-to-br from-purple-500/90 to-blue-600/90 rounded-xl shadow-sm p-8 text-white mb-6">
      <div className="flex items-center justify-center text-center">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center mb-4">
            <Quote className="w-6 h-6 transform rotate-180" />
          </div>
          <p className="text-2xl font-medium text-white leading-relaxed">
            What you do today can improve all of your tomorrows
          </p>
          <div className="flex items-center justify-center mt-4">
            <Quote className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}