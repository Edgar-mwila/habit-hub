import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'goal' | 'task' | 'appointment';
}

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Complete project proposal', date: '2023-05-05', type: 'task' },
    { id: '2', title: 'Weekly goal review', date: '2023-05-07', type: 'goal' },
    { id: '3', title: 'Dentist appointment', date: '2023-05-10', type: 'appointment' },
  ]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-2">
          <div className="font-semibold">{day}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 mt-1 rounded ${
                event.type === 'goal'
                  ? 'bg-blue-100 text-blue-800'
                  : event.type === 'task'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Calendar</h1>
        <p className="text-xl text-gray-600">View your goals and events</p>
      </header>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>
    </div>
  );
};

