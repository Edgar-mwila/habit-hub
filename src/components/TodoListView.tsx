// TodoListView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Bell, CheckCircle, XCircle, RepeatIcon, Clock, ChevronLeft, ChevronRight, Calendar, BarChart2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/settings';
import { LocalStorageManager } from '../services/LocalStorageManager';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  reminderTime?: string;
  status: 'pending' | 'completed' | 'failed';
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    days?: number[];
    date?: number;
  };
  createdAt: string;
  completedAt?: string;
  notificationTime?: string;
}

interface TodoList {
  id: string;
  date: string;
  items: TodoItem[];
  morningNotificationTime: string;
  eveningNotificationTime: string;
}

export const TodoListView: React.FC = () => {
  const [todos, setTodos] = useState<TodoList[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { settings } = useSettings();
  const bgColor = settings.darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = settings.darkMode ? 'text-purple-200' : 'text-gray-900';

  useEffect(() => {
    loadTodos();
    setupNotifications();
  }, []);

  const loadTodos = () => {
    const savedTodos = LocalStorageManager.getTodoLists();
    setTodos(savedTodos);
  };

  const setupNotifications = async () => {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // Schedule notifications for today's todos
    const todayList = todos.find(list => list.date === selectedDate);
    if (todayList) {
      scheduleNotification(
        todayList.morningNotificationTime,
        "Plan Your Day",
        "Time to create your todo list for today!"
      );
      
      scheduleNotification(
        todayList.eveningNotificationTime,
        "Review Your Day",
        "Time to check off completed tasks and plan for tomorrow!"
      );
    }
  };

  const scheduleNotification = (time: string, title: string, body: string) => {
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);

    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeoutId = setTimeout(() => {
      new Notification(title, { body });
    }, scheduledTime.getTime() - new Date().getTime());

    return timeoutId;
  };

  const TodoForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [newTodo, setNewTodo] = useState<Partial<TodoItem>>({
      title: '',
      dueDate: selectedDate,
      status: 'pending',
      isRecurring: false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const todoItem: TodoItem = {
        ...newTodo as TodoItem,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const currentList = todos.find(list => list.date === selectedDate);
      if (currentList) {
        const updatedLists = todos.map(list =>
          list.id === currentList.id
            ? { ...list, items: [...list.items, todoItem] }
            : list
        );
        LocalStorageManager.saveTodoLists(updatedLists);
        setTodos(updatedLists);
      } else {
        const newList: TodoList = {
          id: Date.now().toString(),
          date: selectedDate,
          items: [todoItem],
          morningNotificationTime: settings.todoListMorningNotificationTime,
          eveningNotificationTime: settings.todoListEveningNotificationTime,
        };
        const updatedLists = [...todos, newList];
        LocalStorageManager.saveTodoLists(updatedLists);
        setTodos(updatedLists);
      }

      onClose();
    };

    return (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-x-0 bottom-0 ${bgColor} rounded-t-3xl shadow-lg p-6 z-50`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-semibold ${textColor}`}>New Todo</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Todo title"
            className={`w-full p-4 rounded-xl border ${
              settings.darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-purple-200 border-gray-200'
            } focus:ring-2 focus:ring-purple-500`}
            value={newTodo.title}
            onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description (optional)"
            className={`w-full p-4 rounded-xl border ${
              settings.darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-purple-200 border-gray-200'
            } focus:ring-2 focus:ring-purple-500`}
            value={newTodo.description || ''}
            onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
            rows={3}
          />

          <div className="flex space-x-4">
            <input
              type="time"
              className={`flex-1 p-4 rounded-xl border ${
                settings.darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-purple-200 border-gray-200'
              } focus:ring-2 focus:ring-purple-500`}
              value={newTodo.dueTime || ''}
              onChange={e => setNewTodo({ ...newTodo, dueTime: e.target.value })}
            />

            <input
              type="time"
              className={`flex-1 p-4 rounded-xl border ${
                settings.darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-purple-200 border-gray-200'
              } focus:ring-2 focus:ring-purple-500`}
              value={newTodo.reminderTime || ''}
              onChange={e => setNewTodo({ ...newTodo, reminderTime: e.target.value })}
              placeholder="Reminder time"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              className="w-5 h-5 rounded text-purple-500"
              checked={newTodo.isRecurring}
              onChange={e => setNewTodo({ ...newTodo, isRecurring: e.target.checked })}
            />
            <label htmlFor="recurring" className={textColor}>Make this recurring</label>
          </div>

          {newTodo.isRecurring && (
            <select
              className={`w-full p-4 rounded-xl border ${
                settings.darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-purple-200 border-gray-200'
              } focus:ring-2 focus:ring-purple-500`}
              value={newTodo.recurrencePattern?.frequency || 'daily'}
              onChange={e =>
                setNewTodo({
                  ...newTodo,
                  recurrencePattern: {
                    ...newTodo.recurrencePattern,
                    frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                  }
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 text-purple-200 p-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Add Todo
          </button>
        </form>
      </motion.div>
    );
  };

  const TodoItem: React.FC<{
    item: TodoItem;
    onStatusChange: (id: string, status: 'completed' | 'failed') => void;
  }> = ({ item, onStatusChange }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`p-4 rounded-xl border ${
          settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-200 border-gray-200'
        } shadow-sm`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className={`font-semibold ${textColor} ${
              item.status === 'completed' ? 'line-through opacity-50' : ''
            }`}>
              {item.title}
            </h4>
            {item.description && (
              <p className={`mt-1 text-sm ${
                settings.darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {item.description}
              </p>
            )}
            {item.dueTime && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                {item.dueTime}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(item.id, 'completed')}
              className={`p-2 rounded-full ${
                item.status === 'completed'
                  ? 'text-green-500 bg-green-100 dark:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-500'
              }`}
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => onStatusChange(item.id, 'failed')}
              className={`p-2 rounded-full ${
                item.status === 'failed'
                  ? 'text-red-500 bg-red-100 dark:bg-red-900/20'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const currentList = useMemo(
    () => todos.find(list => list.date === selectedDate),
    [todos, selectedDate]
  );

  const handleStatusChange = (itemId: string, status: 'completed' | 'failed') => {
    if (!currentList) return;

    const updatedLists = todos.map(list =>
      list.id === currentList.id
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    status,
                    completedAt: status === 'completed' ? new Date().toISOString() : undefined
                  }
                : item
            )
          }
        : list
    );

    LocalStorageManager.saveTodoLists(updatedLists);
    setTodos(updatedLists);
  };

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <header className="px-4 py-6 bg-opacity-90 backdrop-blur-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Todo List
          </h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-purple-500 text-purple-200 p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() - 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className={`text-lg font-semibold ${textColor}`}>
            {new Date(selectedDate).toLocaleDateString('default', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </h2>
          <button
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      {currentList && <main className="px-4 pb-4">
        <AnimatePresence mode="wait">
          {currentList?.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className={`text-lg ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No todos for today
              <br />
              <span className="text-sm">Tap + to add a new todo</span>
            </p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4">
            {currentList.items.map(item => (
              <TodoItem
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
              />
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </main>}

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <TodoForm onClose={() => setIsDrawerOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};