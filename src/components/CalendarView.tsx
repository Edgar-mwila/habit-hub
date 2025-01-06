import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, CalendarIcon as CalIcon, Target, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { Event } from '../types';
import { useSettings } from '../context/settings';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'view' | 'add'>('view');
  const { settings } = useSettings();

  useEffect(() => {
    setEvents(LocalStorageManager.getEvents());
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const eventTypeStyles = {
    event: {
      dot: settings.darkMode ? 'bg-purple-400' : 'bg-purple-500',
      bg: settings.darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
      text: settings.darkMode ? 'text-purple-300' : 'text-purple-800',
      border: settings.darkMode ? 'border-purple-700' : 'border-purple-200'
    },
    appointment: {
      dot: settings.darkMode ? 'bg-blue-400' : 'bg-blue-500',
      bg: settings.darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      text: settings.darkMode ? 'text-blue-300' : 'text-blue-800',
      border: settings.darkMode ? 'border-blue-700' : 'border-blue-200'
    }
  };

  const typeIcons = {
    event: <Target className="w-4 h-4" />,
    appointment: <CalIcon className="w-4 h-4" />
  };

  const EventDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
      title: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      type: 'event',
      time: '',
      description: ''
    });

    const selectedDateEvents = useMemo(() => {
      if (!selectedDate) return [];
      return events.filter(event => event.date === selectedDate);
    }, [selectedDate, events]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const event = { ...newEvent, id: Date.now().toString() };
      LocalStorageManager.addEvent(event as Event);
      setEvents(prev => [...prev, event as Event]);
      setDrawerMode('view');
    };

    const handleDelete = (eventId: string) => {
      LocalStorageManager.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    };

    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 right-0 w-full md:w-96 ${
          settings.darkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-900'
        } shadow-xl z-50 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {selectedDate && new Date(selectedDate).toLocaleDateString('default', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <div className="flex mt-1 space-x-2">
              <button
                onClick={() => setDrawerMode('view')}
                className={`px-3 py-1 rounded-full text-sm ${
                  drawerMode === 'view'
                    ? 'bg-purple-500 text-purple-200'
                    : settings.darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                View Events
              </button>
              <button
                onClick={() => setDrawerMode('add')}
                className={`px-3 py-1 rounded-full text-sm ${
                  drawerMode === 'add'
                    ? 'bg-purple-500 text-purple-200'
                    : settings.darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Add Event
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {drawerMode === 'view' ? (
            <div className="p-4 space-y-4">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No events scheduled for this day
                </div>
              ) : (
                selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${eventTypeStyles[event.type].bg} ${eventTypeStyles[event.type].border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={eventTypeStyles[event.type].text}>
                          {typeIcons[event.type]}
                        </span>
                        <h4 className="font-medium">{event.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {event.time && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {event.time}
                      </div>
                    )}
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-purple-200 border-gray-300'
                  }`}
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
                <select
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-purple-200 border-gray-300'
                  }`}
                  value={newEvent.type}
                  onChange={e =>
                    setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })
                  }
                >
                  <option value="event">Event</option>
                  <option value="appointment">Appointment</option>
                </select>
                <input
                  type="time"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-purple-200 border-gray-300'
                  }`}
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-purple-200 border-gray-300'
                  }`}
                  value={newEvent.description}
                  onChange={e =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                />
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-purple-200 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add Event
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days = [];

    // Empty cells for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`h-16 ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-md`}
        />
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = dateString === selectedDate;

      days.push(
        <div
          key={day}
          className={`h-16 ${
            settings.darkMode ? 'bg-gray-700' : 'bg-purple-200'
          } border ${
            settings.darkMode ? 'border-gray-600' : 'border-gray-200'
          } p-2 hover:shadow-md transition-all cursor-pointer ${
            isSelected
              ? 'ring-2 ring-purple-500'
              : isToday
              ? 'ring-1 ring-purple-300'
              : ''
          }`}
          onClick={() => {
            setSelectedDate(dateString);
            setIsDrawerOpen(true);
          }}
        >
          <div
            className={`text-base font-semibold ${
              isToday
                ? 'text-purple-500'
                : settings.darkMode
                ? 'text-gray-200'
                : 'text-gray-900'
            }`}
          >
            {day}
          </div>
          {dayEvents.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {Array.from(new Set(dayEvents.map(event => event.type))).map(type => (
                <div
                  key={type}
                  className={`w-1.5 h-1.5 rounded-full ${eventTypeStyles[type].dot}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className={`max-w-6xl mx-auto px-4 py-6 ${
        settings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-purple-200 text-gray-900'
      }`}
    >
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Calendar
          </h1>
          <p className={`text-base ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Plan and track your appointments and events
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            {Object.entries(eventTypeStyles).map(([type, styles]) => (
              <div key={type} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0]);
              setDrawerMode('add');
              setIsDrawerOpen(true);
            }}
            className="flex items-center bg-purple-500 text-purple-200 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Event
          </button>
        </div>
      </header>

      <div
        className={`${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        } rounded-xl shadow-lg p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
              )
            }
            className={`p-2 rounded-lg ${
              settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <ChevronLeft size={24} />
          </button>
          <h2
            className={`text-2xl font-semibold ${
              settings.darkMode ? 'text-purple-300' : 'text-purple-800'
            }`}
          >
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
              )
            }
            className={`p-2 rounded-lg ${
              settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className={`font-semibold text-center ${
                settings.darkMode ? 'text-purple-300' : 'text-purple-800'
              }`}
            >
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{renderCalendar()}</div>
      </div>

      {/* Event List Section */}
      <div
        className={`mt-8 ${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        } rounded-xl shadow-lg p-6`}
      >
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .filter(
              event =>
                new Date(event.date).getTime() >= new Date().setHours(0, 0, 0, 0)
            )
            .slice(0, 5)
            .map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${eventTypeStyles[event.type].bg} ${
                  eventTypeStyles[event.type].border
                }`}
                onClick={() => {
                  setSelectedDate(event.date);
                  setIsDrawerOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={eventTypeStyles[event.type].text}>
                      {typeIcons[event.type]}
                    </span>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('default', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className={settings.darkMode ? 'text-gray-400' : 'text-gray-600'}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <EventDrawer onClose={() => setIsDrawerOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};