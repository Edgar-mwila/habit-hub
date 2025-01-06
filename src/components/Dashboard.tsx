import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { AnalyticsService } from '../services/AnalyticsService';
import { 
  CheckCircle, 
  TrendingUp, 
  Target,
  Clock, 
  Briefcase, 
  DollarSign, 
  Heart, 
  User,
  AlertCircle,
  Calendar,
  Book
} from 'lucide-react';
import { type Goal, type Category, DEFAULT_CATEGORIES, TodoList, Event, TodoItem } from '../types';
import { useSettings } from '../context/settings';

const iconMap = {
  'briefcase': Briefcase,
  'dollar-sign': DollarSign,
  'heart': Heart,
  'user': User,
  'book': Book
};

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description: string;
  isDarkMode: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  isDarkMode
}) => (
  <div className={`rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-800'}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-gradient-to-br from-purple-100 to-orange-100'}`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
      {value}
    </p>
    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);

interface ActiveGoalProps {
  goal: Goal;
  isDarkMode: boolean;
}

const ActiveGoal: React.FC<ActiveGoalProps> = ({ goal, isDarkMode }) => {
  const getStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-orange-500';
    return 'text-purple-500';
  };

  return (
    <div className={`rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{goal.title}</h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{goal.category}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goal.currentProgress)}`}>
          {Math.round((goal.currentProgress / 100) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
        <div 
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all duration-500"
          style={{ width: `${(goal.currentProgress / 100) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Target className="w-4 h-4 mr-1" />
          {goal.currentProgress} / 100 %
        </span>
        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Clock className="w-4 h-4 mr-1" />
          {Math.ceil((new Date(goal.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
        </span>
      </div>
    </div>
  );
};

interface TodoItemProps {
  todo: TodoItem;
  isDarkMode: boolean;
}

const TodoItemComponent: React.FC<TodoItemProps> = ({ todo, isDarkMode }) => (
  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-purple-200'} shadow-sm`}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{todo.title}</h4>
        {todo.description && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {todo.description}
          </p>
        )}
      </div>
      <div className={`px-2 py-1 rounded text-xs ${
        todo.dueDate === new Date().toISOString().split('T')[0]
          ? 'bg-orange-100 text-orange-800'
          : 'bg-purple-100 text-purple-800'
      }`}>
        {new Date(todo.dueDate).toLocaleDateString()}
        {todo.dueTime && ` ${todo.dueTime}`}
      </div>
    </div>
  </div>
);

interface EventItemProps {
  event: Event;
  isDarkMode: boolean;
}

const EventItemComponent: React.FC<EventItemProps> = ({ event, isDarkMode }) => (
  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-purple-200'} shadow-sm`}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{event.title}</h4>
        {event.description && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {event.description}
          </p>
        )}
      </div>
      <div className={`px-2 py-1 rounded text-xs ${
        event.type === 'appointment' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {new Date(event.date).toLocaleDateString()}
        {event.time && ` ${event.time}`}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const storedGoals = LocalStorageManager.getGoals();
    const storedTodos = LocalStorageManager.getTodoLists();
    const storedEvents = LocalStorageManager.getEvents();
    
    setGoals(storedGoals);
    setTodoLists(storedTodos);
    setEvents(storedEvents);
    setCategories(DEFAULT_CATEGORIES);
    
    const completed = storedGoals.filter(goal => goal.status === 'completed').length;
    const goalCompletionRate = storedGoals.length ? (completed / storedGoals.length) * 100 : 0;
    const todoCompletionRate = AnalyticsService.getTodoCompletionRate(storedTodos);
    
    setCompletionRate((goalCompletionRate + todoCompletionRate) / 2);
  }, []);

  const getPendingTodos = () => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return todoLists
      .flatMap(list => list.items)
      .filter(todo => 
        todo.status === 'pending' &&
        new Date(todo.dueDate) <= threeDaysFromNow
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= twoWeeksFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getActiveGoals = () => {
    return goals.filter(goal => 
      goal.currentProgress <= 100 && 
      new Date(goal.dueDate) > new Date()
    ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  return (
    <div className={`max-w-6xl mx-auto p-6`}>
      <header className="mb-12">
        <p className="text-xl text-orange-600 mb-2">Good {getTimeOfDay()}, Achiever!</p>
        <h1 className={`text-4xl font-bold text-transparent bg-clip-text ${settings.darkMode ? 'bg-gradient-to-r from-purple-200 to-orange-300': 'bg-gradient-to-r from-purple-800 to-orange-700'}`}>
          Your Journey Continues
        </h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        <DashboardCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          icon={<CheckCircle className="w-6 h-6 text-orange-500" />}
          description="Your overall success rate"
          isDarkMode={settings.darkMode}
        />
        <DashboardCard
          title="Active Goals"
          value={getActiveGoals().length}
          icon={<Target className="w-6 h-6 text-purple-600" />}
          description="Currently in progress"
          isDarkMode={settings.darkMode}
        />
        <DashboardCard
          title="Current Streak"
          value={AnalyticsService.getTodoStreak(todoLists)}
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          description="Days of consistent progress"
          isDarkMode={settings.darkMode}
        />
        <DashboardCard
          title="Todo Success"
          value={`${AnalyticsService.getTodoCompletionRate(todoLists)}%`}
          icon={<CheckCircle className="w-6 h-6 text-blue-500" />}
          description="Tasks completed on time"
          isDarkMode={settings.darkMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <section className={`p-6 rounded-xl ${settings.darkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold flex items-center ${settings.darkMode ? 'text-purple-200' : 'text-gray-800'}`}>
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Pending Tasks
            </h2>
            <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Next 3 days
            </span>
          </div>
          <div className="space-y-3">
            {getPendingTodos().map(todo => (
              <TodoItemComponent 
                key={todo.id} 
                todo={todo} 
                isDarkMode={settings.darkMode} 
              />
            ))}
            {getPendingTodos().length === 0 && (
              <p className={`text-center py-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No pending tasks for the next 3 days!
              </p>
            )}
          </div>
        </section>

        <section className={`p-6 rounded-xl ${settings.darkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold flex items-center ${settings.darkMode ? 'text-purple-200' : 'text-gray-800'}`}>
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              Upcoming Events
            </h2>
            <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Next 2 weeks
            </span>
          </div>
          <div className="space-y-3">
            {getUpcomingEvents().map(event => (
              <EventItemComponent 
                key={event.id} 
                event={event} 
                isDarkMode={settings.darkMode} 
              />
            ))}
            {getUpcomingEvents().length === 0 && (
              <p className={`text-center py-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No upcoming events in the next 2 weeks!
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mb-12">
        <h2 className={`text-2xl font-semibold ${settings.darkMode ? 'text-purple-200':'text-purple-800'} mb-6`}>Category Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            const progress = AnalyticsService.calculateCategoryProgress(goals, category.name);

            return (
              <div key={category.id} className={`rounded-xl shadow-md p-6 ${settings.darkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-800'}`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                    {IconComponent && (
                      <IconComponent 
                        size={24} 
                        style={{ color: category.color }}
                      />
                    )}
                  </div>
                  <h3 className="ml-3 font-semibold">{category.name}</h3>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: category.color }}
                  />
                </div>
                <p className="mt-2 text-sm">{Math.round(progress)}% complete</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getActiveGoals().slice(0, 4).map(goal => (
            <ActiveGoal key={goal.id} goal={goal} isDarkMode={settings.darkMode} />
          ))}
        </div>
      </section>
    </div>
  );
};
