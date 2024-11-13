import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const stoicQuotes = [
  {
    text: "What stands in the way becomes the way",
    author: "Marcus Aurelius"
  },
  {
    text: "He who fears death will never do anything worthy of a living man",
    author: "Seneca"
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts",
    author: "Marcus Aurelius"
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one",
    author: "Marcus Aurelius"
  },
  {
    text: "We suffer more often in imagination than in reality",
    author: "Seneca"
  },
  {
    text: "The best revenge is not to be like your enemy",
    author: "Marcus Aurelius"
  },
  {
    text: "No man steps in the same river twice",
    author: "Heraclitus"
  }
];

export function DailyStoicQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('stoicQuoteDate');
    const savedQuote = localStorage.getItem('stoicQuote');
    const savedAuthor = localStorage.getItem('stoicAuthor');

    if (savedDate !== today || !savedQuote) {
      const newQuote = stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)];
      setQuote(newQuote);
      localStorage.setItem('stoicQuote', newQuote.text);
      localStorage.setItem('stoicAuthor', newQuote.author);
      localStorage.setItem('stoicQuoteDate', today);
    } else {
      setQuote({ text: savedQuote, author: savedAuthor || '' });
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white mb-8">
      <div className="flex items-center justify-center text-center">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center mb-4">
            <Quote className="w-5 h-5 text-slate-400 transform rotate-180" />
          </div>
          <p className="text-2xl font-medium leading-relaxed mb-4">
            {quote.text}
          </p>
          <p className="text-sm text-slate-400">― {quote.author}</p>
          <div className="flex items-center justify-center mt-4">
            <Quote className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}