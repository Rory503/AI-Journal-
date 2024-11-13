import React, { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

const motivationalStarters = [
  "Hey there! 🌟 Ready to make today amazing? What's your biggest goal for today?",
  "Rise and shine! 🌅 Remember, every day is a new opportunity. What would make today a win for you?",
  "You've got this! 💪 Let's focus on what matters most today. What's on your mind?",
  "Welcome back! 🎯 I noticed you're making great progress. Want to talk about your next steps?",
  "Hey champion! 🏆 You're showing up, and that's half the battle. How can I support you today?"
];

const followUps = [
  "That's a great goal! How can we break it down into manageable steps?",
  "You're on the right track! Want to explore some strategies to make this even more achievable?",
  "I believe in you! Let's create an action plan to make this happen.",
  "Amazing focus! Would you like some tips to help you stay motivated?",
  "You're making fantastic progress! How about we set some milestones to celebrate along the way?"
];

export function AIChatSupport() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Start conversation when component mounts
    const starter = motivationalStarters[Math.floor(Math.random() * motivationalStarters.length)];
    setMessages([{ text: starter, isUser: false }]);
  }, []);

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text, isUser: false }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    
    // Generate AI response
    const response = followUps[Math.floor(Math.random() * followUps.length)];
    simulateTyping(response);

    setInput('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">AI Support Chat</h2>
        <div className="flex items-center text-blue-500">
          <Sparkles className="w-5 h-5 mr-2" />
          {isTyping && <span className="text-sm">AI is typing...</span>}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}