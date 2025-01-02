import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar as CalIcon, Target } from 'react-feather';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'goal' | 'task' | 'appointment';
  time?: string;
  description?: string;
}

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([
    { 
      id: '1', 
      title: 'Complete project proposal',
      date: '2024-05-05',
      type: 'task',
      time: '14:00',
      description: 'Finish the initial draft'
    }
  ]);

  const typeStyles = {
    goal: 'bg-purple-100 text-purple-800 border-purple-200',
    task: 'bg-orange-100 text-orange-800 border-orange-200',
    appointment: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const EventForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
      title: '',
      date: selectedDate || '',
      type: 'task',
      time: '',
      description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-800">Add New Event</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value as Event['type']})}
            >
              <option value="task">Task</option>
              <option value="goal">Goal</option>
              <option value="appointment">Appointment</option>
            </select>
            <input
              type="date"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              value={newEvent.date}
              onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              required
            />
            <input
              type="time"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              value={newEvent.time}
              onChange={e => setNewEvent({...newEvent, time: e.target.value})}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              value={newEvent.description}
              onChange={e => setNewEvent({...newEvent, description: e.target.value})}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-2 rounded hover:from-purple-700 hover:to-orange-600"
            >
              Add Event
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Empty cells for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 rounded-lg"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-32 bg-white rounded-lg border p-2 hover:shadow-md transition-shadow ${
            isToday ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => {
            setSelectedDate(dateString);
            setShowEventForm(true);
          }}
        >
          <div className={`font-semibold ${isToday ? 'text-purple-600' : ''}`}>{day}</div>
          <div className="space-y-1 mt-1 overflow-y-auto max-h-24">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1.5 rounded-lg border ${typeStyles[event.type]} cursor-pointer hover:opacity-80`}
                title={event.description}
              >
                <div className="font-medium truncate">{event.title}</div>
                {event.time && (
                  <div className="text-xs opacity-75 flex items-center mt-0.5">
                    <Clock size={10} className="mr-1" />
                    {event.time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
            Calendar
          </h1>
          <p className="text-gray-600">Plan and track your goals and events</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setShowEventForm(true);
          }}
          className="flex items-center bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-orange-600 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Add Event
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-purple-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-center text-purple-800">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {renderCalendar()}
        </div>
      </div>

      {showEventForm && (
        <EventForm onClose={() => setShowEventForm(false)} />
      )}
    </div>
  );
};