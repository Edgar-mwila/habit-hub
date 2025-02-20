import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link,  useLocation } from 'react-router-dom';
import { Home, Target, Calendar, BarChart2, Settings as SettingsIcon, MessageCircle, MoreVertical } from 'react-feather';
import { Dashboard } from './Dashboard';
import { GoalManagement } from './GoalManagement';
import { CalendarView } from './CalendarView';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { About } from './About';
import { Chat } from './Chat';
import { useSettings } from '../context/settings';
import { TodoListView } from './TodoListView';
import { ListTodo } from 'lucide-react';
import { Finance } from './finances'; 

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  // Apply dark mode to the root html element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const shouldShowNav = location.pathname.includes('/finance');

  return (
      <div className={`flex flex-col h-screen ${
        settings.darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-purple-900'
          : 'bg-gradient-to-br from-purple-50 to-orange-50'
      }`}>
        {/* Header Bar */}
        <header className={`fixed top-0 left-0 right-0 ${
          settings.darkMode 
            ? 'bg-gray-800 shadow-gray-900/50'
            : 'bg-purple-200'
          } shadow-lg z-10 flex justify-between items-center px-4 h-16 transition-colors duration-300`}>
          <div className="flex items-center">
            <img src="/logo.png" alt="HabbitHub Logo" className="h-8" />
            <span className={`ml-3 text-lg font-semibold ${
              settings.darkMode ? 'text-purple-200' : 'text-gray-700'
            }`}>
              HabbitHub
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`${
                settings.darkMode 
                  ? 'text-gray-300 hover:text-purple-400'
                  : 'text-gray-600 hover:text-purple-600'
              } transition-colors duration-300`}
            >
              <MoreVertical size={24} />
            </button>
            {isMenuOpen && (
              <div className={`absolute right-0 mt-2 w-40 ${
                settings.darkMode 
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-purple-200 border-gray-200'
                } shadow-lg border rounded-md`}>
                <Link
                  to="/settings"
                  className={`block px-4 py-2 ${
                    settings.darkMode 
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/about"
                  className={`block px-4 py-2 ${
                    settings.darkMode 
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-auto pt-16 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<GoalManagement />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/todo" element={<TodoListView />} />
            <Route path="/finance/*" element={<Finance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {settings.chatAssistant && <Chat />}

        {/* Bottom Navigation */}
        {!shouldShowNav && <nav className={`fixed bottom-0 w-full ${
          settings.darkMode 
            ? 'bg-gray-800 shadow-gray-900/50'
            : 'bg-purple-200'
          } shadow-lg transition-colors duration-300`}>
          <div className="flex justify-around items-center h-16 relative">
            {/* Dashboard Center Highlight */}
            

            {/* Other Navigation Items */}
            <NavItem
              icon={<Target size={24} />}
              to="/goals"
              label="Goal"
              isActive={activeTab === 'goals'}
              onClick={() => setActiveTab('goals')}
              isDarkMode={settings.darkMode}
            />
            <NavItem
              icon={<ListTodo size={24} />}
              to="/todo"
              label="To Do"
              isActive={activeTab === 'todo'}
              onClick={() => setActiveTab('todo')}
              isDarkMode={settings.darkMode}
            />
            <div className="bg-purple-300 rounded-lg shadow-lg p-2">
              <NavItem
                icon={<Home size={28} />}
                to="/"
                label="Dashboard"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                isDarkMode={settings.darkMode}
              />
            </div>
            <NavItem
              icon={<Calendar size={24} />}
              to="/calendar"
              label="Calendar"
              isActive={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
              isDarkMode={settings.darkMode}
            />
            <NavItem
              icon={<BarChart2 size={24} />}
              to="/finance"
              label="Finanace"
              isActive={activeTab === 'finance'}
              onClick={() => setActiveTab('finance')}
              isDarkMode={settings.darkMode}
            />
          </div>
        </nav>}
      </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  isCenter?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  to, 
  label, 
  isActive, 
  onClick, 
  isDarkMode,
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-2 transition-colors duration-300 ${
      isActive
        ? isDarkMode 
          ? 'text-purple-400'
          : 'text-purple-600'
        : isDarkMode
          ? 'text-gray-400 hover:text-purple-300'
          : 'text-gray-500 hover:text-purple-400'
    }`}
    onClick={onClick}
  >
    {icon}
  </Link>
);


