import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const stoicQuotes = [
  {
    text: 'What stands in the way becomes the way',
    author: 'Marcus Aurelius'
  },
  {
    text: 'He who fears death will never do anything worthy of a living man',
    author: 'Seneca'
  },
  {
    text: 'The happiness of your life depends upon the quality of your thoughts',
    author: 'Marcus Aurelius'
  },
  {
    text: 'Waste no more time arguing about what a good man should be. Be one',
    author: 'Marcus Aurelius'
  },
  {
    text: 'We suffer more often in imagination than in reality',
    author: 'Seneca'
  },
  {
    text: 'The best revenge is not to be like your enemy',
    author: 'Marcus Aurelius'
  },
  {
    text: 'No man steps in the same river twice',
    author: 'Heraclitus'
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
    <section className="card overflow-hidden">
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.35),transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
            <Sparkles className="h-4 w-4" />
            Whisper for reflection
          </div>
          <p className="text-lg font-medium leading-relaxed md:text-xl">
            “{quote.text}”
          </p>
          <p className="text-sm text-slate-300">— {quote.author}</p>
        </div>
      </div>
      <div className="px-6 py-4 text-sm text-slate-600 bg-white">
        Let this lens guide your journaling or goal setting today.
      </div>
    </section>
  );
}
