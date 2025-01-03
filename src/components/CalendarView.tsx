import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, CalendarIcon as CalIcon, Target } from 'lucide-react';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { Event } from '../types';
import { useSettings } from '../context/settings';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { settings } = useSettings();

  useEffect(() => {
    setEvents(LocalStorageManager.getEvents());

    // Handle resize events for responsive design
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const typeStyles = {
    goal: settings.darkMode
      ? 'bg-purple-900 text-purple-200 border-purple-700'
      : 'bg-purple-100 text-purple-800 border-purple-200',
    task: settings.darkMode
      ? 'bg-orange-900 text-orange-200 border-orange-700'
      : 'bg-orange-100 text-orange-800 border-orange-200',
    appointment: settings.darkMode
      ? 'bg-blue-900 text-blue-200 border-blue-700'
      : 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const typeIcons = {
    goal: <Target className="w-3 h-3 mr-1" />,
    task: <Clock className="w-3 h-3 mr-1" />,
    appointment: <CalIcon className="w-3 h-3 mr-1" />
  };

  const EventForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
      title: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      type: 'task',
      time: '',
      description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const event = { ...newEvent, id: Date.now().toString() };
      LocalStorageManager.addEvent(event as Event);
      setEvents(prev => [...prev, event as Event]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${settings.darkMode ? 'text-purple-300' : 'text-purple-800'}`}>Add New Event</h3>
            <button onClick={onClose} className={`${settings.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 ${
                settings.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
              value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
            <select
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 ${
                settings.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
              value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value as Event['type']})}
            >
              <option value="task">Task</option>
              <option value="goal">Goal</option>
              <option value="appointment">Appointment</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 ${
                  settings.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                required
              />
              <input
                type="time"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 ${
                  settings.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Description"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 ${
                settings.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
              value={newEvent.description}
              onChange={e => setNewEvent({...newEvent, description: e.target.value})}
              rows={3}
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
      days.push(<div key={`empty-${i}`} className={`h-24 md:h-32 ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}></div>);
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
          className={`h-24 md:h-32 ${settings.darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg border ${
            settings.darkMode ? 'border-gray-600' : 'border-gray-200'
          } p-1 md:p-2 hover:shadow-md transition-shadow ${
            isToday ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => {
            setSelectedDate(dateString);
            setShowEventForm(true);
          }}
        >
          <div className={`text-sm md:text-base font-semibold ${isToday ? 'text-purple-500' : settings.darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{day}</div>
          <div className="space-y-0.5 md:space-y-1 mt-0.5 md:mt-1 overflow-y-auto max-h-16 md:max-h-24">
            {dayEvents.slice(0, isMobile ? 2 : 3).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 md:p-1.5 rounded-lg border ${typeStyles[event.type]} cursor-pointer hover:opacity-80`}
                title={event.description}
              >
                <div className="font-medium truncate flex items-center">
                  {typeIcons[event.type]}
                  {event.title}
                </div>
                {event.time && !isMobile && (
                  <div className="text-xs opacity-75 flex items-center mt-0.5">
                    <Clock size={10} className="mr-1" />
                    {event.time}
                  </div>
                )}
              </div>
            ))}
            {dayEvents.length > (isMobile ? 2 : 3) && (
              <div className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                +{dayEvents.length - (isMobile ? 2 : 3)} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleDeleteEvent = (eventId: string) => {
    LocalStorageManager.deleteEvent(eventId);
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className={`max-w-6xl mx-auto px-2 md:px-4 py-4 md:py-6 ${settings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <header className="mb-4 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
            Calendar
          </h1>
          <p className={`text-sm md:text-base ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Plan and track your goals and events</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setShowEventForm(true);
          }}
          className="flex items-center bg-gradient-to-r from-purple-600 to-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:from-purple-700 hover:to-orange-600 transition-all text-sm md:text-base"
        >
          <Plus size={isMobile ? 16 : 20} className="mr-1 md:mr-2" />
          Add Event
        </button>
      </header>

      <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-2 md:p-6`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className={`p-1 md:p-2 ${settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>
          <h2 className={`text-lg md:text-2xl font-semibold ${settings.darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className={`p-1 md:p-2 ${settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <ChevronRight size={isMobile ? 20 : 24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-4 mb-2 md:mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className={`font-semibold text-center ${settings.darkMode ? 'text-purple-300' : 'text-purple-800'} text-sm md:text-base`}>
              {isMobile ? day : day + (day === 'S' ? 'un' : day === 'M' ? 'on' : 'ue')}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-4">
          {renderCalendar()}
        </div>
      </div>

      {showEventForm && (
        <EventForm onClose={() => setShowEventForm(false)} />
      )}
    </div>
  );
};