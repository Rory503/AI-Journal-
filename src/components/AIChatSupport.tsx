import React, { useEffect, useState } from 'react';
import { Send, HeartHandshake } from 'lucide-react';

const motivationalStarters = [
  "Hi friend 🌿 I’m here with you. What would feel nourishing to explore together right now?",
  "Welcome back ✨ Take a breath—what’s one intention or feeling you’d like to unpack today?",
  "Hey there 💛 Showing up is powerful. Want to talk through a habit or goal that needs a gentle nudge?",
  "I’m listening 👂 How has your energy been? Let’s find a compassionate next step.",
  "So glad you’re here 🌈 What support would make today feel just a bit lighter?",
];

const followUps = [
  "Thank you for sharing that. What is one tiny action that would honor how you feel?",
  "Let’s make this kind to your nervous system. What would a 1% move forward look like?",
  "I love that awareness. Who or what could support you in staying connected to this intention?",
  "It’s okay to go slow. Would celebrating a small win help you stay encouraged?",
  "Beautiful insight. How can we transform it into a compassionate commitment for today?",
];

export function AIChatSupport() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const starter = motivationalStarters[Math.floor(Math.random() * motivationalStarters.length)];
    setMessages([{ text: starter, isUser: false }]);
  }, []);

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text, isUser: false }]);
      setIsTyping(false);
    }, 1300);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input.trim(), isUser: true }]);
    const response = followUps[Math.floor(Math.random() * followUps.length)];
    simulateTyping(response);
    setInput('');
  };

  return (
    <section className="card h-[420px] p-6 flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Companion Chat</h2>
          <p className="text-xs text-gray-500">A gentle space to reflect, plan, and feel supported.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-500">
          <HeartHandshake className="h-4 w-4" />
          {isTyping ? 'Writing something tender…' : 'Listening deeply'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 rounded-2xl bg-slate-50 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.isUser
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 border border-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <div className="flex-1">
          <label className="sr-only" htmlFor="companion-message">Send a message</label>
          <input
            id="companion-message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Share what’s on your heart or the next step you’d like to plan."
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-500 p-2 text-white transition-colors hover:bg-indigo-600"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </section>
  );
}
