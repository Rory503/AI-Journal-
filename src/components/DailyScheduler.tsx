import React, { useState } from 'react';
import { Brain, Plus } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

type Event = EventInput & {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
};

export function DailyScheduler() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [showAIPlanner, setShowAIPlanner] = useState(false);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)) {
      setEvents(prev => prev.filter(event => event.id !== clickInfo.event.id));
    }
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newEventTitle.trim()) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      start: selectedDate.start,
      end: selectedDate.end,
      allDay: selectedDate.allDay,
    };

    setEvents(prev => [...prev, newEvent]);
    setNewEventTitle('');
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const generateAISchedule = () => {
    const today = new Date();
    const aiSuggestions: Event[] = [
      {
        id: '1',
        title: 'Morning Exercise',
        start: new Date(today.setHours(7, 0)),
        end: new Date(today.setHours(8, 0)),
      },
      {
        id: '2',
        title: 'Focus Work Session',
        start: new Date(today.setHours(9, 0)),
        end: new Date(today.setHours(11, 0)),
      },
      {
        id: '3',
        title: 'Team Meeting',
        start: new Date(today.setHours(11, 30)),
        end: new Date(today.setHours(12, 30)),
      },
      {
        id: '4',
        title: 'Lunch Break',
        start: new Date(today.setHours(12, 30)),
        end: new Date(today.setHours(13, 30)),
      },
      {
        id: '5',
        title: 'Deep Work',
        start: new Date(today.setHours(14, 0)),
        end: new Date(today.setHours(16, 0)),
      },
    ];

    setEvents(prev => [...prev, ...aiSuggestions]);
    setShowAIPlanner(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Schedule & Calendar</h2>
        <button
          onClick={() => setShowAIPlanner(!showAIPlanner)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 z-10"
        >
          <Brain className="w-5 h-5" />
          <span className="text-sm">AI Planner</span>
        </button>
      </div>

      {showAIPlanner && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">AI Schedule Planner</h3>
          <p className="text-sm text-blue-600 mb-3">
            Let AI generate an optimized daily schedule based on productivity best practices.
          </p>
          <button
            onClick={generateAISchedule}
            className="btn-primary"
          >
            Generate Schedule
          </button>
        </div>
      )}

      <div className="calendar-container" style={{ height: '600px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridDay"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
        />
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
            <form onSubmit={addEvent}>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title"
                className="w-full p-2 border border-gray-200 rounded-lg mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}