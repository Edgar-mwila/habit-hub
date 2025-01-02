import React, { useState } from 'react';
import { Moon, Bell, Lock, Database, HelpCircle } from 'react-feather';

export const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
        <p className="text-xl text-gray-600">Customize your HabitHub experience</p>
      </header>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Dark Mode</h2>
              <p className="text-sm text-gray-600">Toggle dark mode on or off</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-gray-600">Enable or disable push notifications</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
            Change
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Export Data</h2>
              <p className="text-sm text-gray-600">Download all your HabitHub data</p>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
            Export
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Help & Support</h2>
              <p className="text-sm text-gray-600">Get assistance or report an issue</p>
            </div>
          </div>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

