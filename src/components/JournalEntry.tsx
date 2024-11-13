import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useDailyData } from '../hooks/useDailyData';

export function JournalEntry() {
  const [entry, setEntry] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { todayData, updateTodayData, getAllData } = useDailyData();
  const allData = getAllData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodayData({ journalEntry: entry });
    setEntry('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredEntries = Object.entries(allData)
    .filter(([date, data]) => {
      const { journalEntry } = data;
      if (!journalEntry) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return journalEntry.toLowerCase().includes(searchLower) ||
             formatDate(date).toLowerCase().includes(searchLower);
    })
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Journal Entry</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        >
          <Calendar className="w-4 h-4" />
          <span>History</span>
          {showHistory ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showHistory ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredEntries.map(([date, data]) => (
              <div key={date} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {formatDate(date)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{data.journalEntry}</p>
              </div>
            ))}
            {filteredEntries.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? 'No entries match your search' : 'No journal entries yet'}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="flex-1 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 min-h-[300px]"
            placeholder="Write your thoughts..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Entry
          </button>
        </form>
      )}
    </div>
  );
}