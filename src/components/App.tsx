import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { GoalManagement } from './GoalManagement';
import { CalendarView } from './CalendarView';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { Home, Target, Calendar, BarChart2, Settings as SettingsIcon } from 'react-feather';

export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <Router>
            <div className="flex h-screen bg-gray-100">
                <nav className="w-20 bg-white shadow-lg">
                    <div className="flex flex-col items-center h-full py-4">
                        <Link to="/" className="mb-8">
                            <img src="/assets/images/logo.png" alt="HabitHub Logo" className="w-12 h-12" />
                        </Link>
                        <div className="flex-grow flex flex-col justify-center space-y-8">
                            <NavItem icon={<Home />} to="/" label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <NavItem icon={<Target />} to="/goals" label="Goals" isActive={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
                            <NavItem icon={<Calendar />} to="/calendar" label="Calendar" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                            <NavItem icon={<BarChart2 />} to="/analytics" label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        </div>
                        <NavItem icon={<SettingsIcon />} to="/settings" label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                </nav>
                <main className="flex-grow p-8 overflow-auto">
                    <Routes>
                        <Route path="/" element={ <Dashboard /> } />
                        <Route path="/goals" Component={GoalManagement} />
                        <Route path="/calendar" Component={CalendarView} />
                        <Route path="/analytics" Component={Analytics} />
                        <Route path="/settings" Component={Settings} />
                    </Routes>
                </main>
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
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 ${
            isActive ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-blue-100'
        }`}
        onClick={onClick}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </Link>
);

