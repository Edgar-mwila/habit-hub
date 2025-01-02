import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Home, Target, Calendar, BarChart2, Settings as SettingsIcon, MessageCircle, MoreVertical } from 'react-feather';
import { Dashboard } from './Dashboard';
import { GoalManagement } from './GoalManagement';
import { CalendarView } from './CalendarView';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { About } from './About';
import { Chat } from './Chat';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Dropdown menu state

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header Bar */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-10 flex justify-between items-center px-4 h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="HabbitHub Logo" className="h-8" />
            <span className="ml-3 text-lg font-semibold text-gray-700">HabbitHub</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-gray-600 hover:text-purple-600"
            >
              <MoreVertical size={24} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md">
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Chat />

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full bg-white shadow-lg">
          <div className="flex justify-around items-center h-16">
            <NavItem
              icon={<Home size={24} />}
              to="/"
              label="Dashboard"
              isActive={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem
              icon={<Target size={24} />}
              to="/goals"
              label="Goals"
              isActive={activeTab === 'goals'}
              onClick={() => setActiveTab('goals')}
            />
            <NavItem
              icon={<Calendar size={24} />}
              to="/calendar"
              label="Calendar"
              isActive={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
            />
            <NavItem
              icon={<BarChart2 size={24} />}
              to="/analytics"
              label="Analytics"
              isActive={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
          </div>
        </nav>
      </div>
    </Router>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, to, label, isActive, onClick }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-2 ${
      isActive
        ? 'text-purple-600'
        : 'text-gray-500 hover:text-purple-400'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);
