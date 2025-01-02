import React, { useState } from 'react';
import {
  Moon, Bell, Lock, Database, HelpCircle, Upload, User,
  MessageCircle, Globe, Shield, Award, RefreshCw
} from 'react-feather';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-purple-800 mb-4">{title}</h2>
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {children}
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    dailyReminders: true,
    weeklyReviews: true,
    chatAssistant: true,
    language: 'English',
    dataBackup: true,
    motivationalQuotes: true
  });

  const handleChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const gradientButton = "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded transition-all duration-200";
  const toggleClass = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors";
  const toggleHandle = "inline-block h-4 w-4 transform rounded-full bg-white transition-transform";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
          Settings
        </h1>
        <p className="text-gray-600">Customize your HabitHub experience</p>
      </header>

      <SettingsSection title="Appearance">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className="mr-4 text-purple-600" />
            <div>
              <h3 className="font-semibold">Dark Mode</h3>
              <p className="text-sm text-gray-600">Toggle dark theme</p>
            </div>
          </div>
          <button
            onClick={() => handleChange('darkMode')}
            className={`${toggleClass} ${settings.darkMode ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Push Notifications</h3>
                <p className="text-sm text-gray-600">Enable all notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleChange('notifications')}
              className={`${toggleClass} ${settings.notifications ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <span className={`${toggleHandle} ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Daily Reminders</h3>
                <p className="text-sm text-gray-600">Get daily goal reminders</p>
              </div>
            </div>
            <button
              onClick={() => handleChange('dailyReminders')}
              className={`${toggleClass} ${settings.dailyReminders ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <span className={`${toggleHandle} ${settings.dailyReminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Assistant & Personalization">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Chat Assistant</h3>
                <p className="text-sm text-gray-600">Enable goal companion</p>
              </div>
            </div>
            <button
              onClick={() => handleChange('chatAssistant')}
              className={`${toggleClass} ${settings.chatAssistant ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <span className={`${toggleHandle} ${settings.chatAssistant ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Motivational Quotes</h3>
                <p className="text-sm text-gray-600">Show daily inspirational quotes</p>
              </div>
            </div>
            <button
              onClick={() => handleChange('motivationalQuotes')}
              className={`${toggleClass} ${settings.motivationalQuotes ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <span className={`${toggleHandle} ${settings.motivationalQuotes ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Account & Data">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Profile Settings</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </div>
            <button className={gradientButton}>Edit</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm text-gray-600">Change password and security settings</p>
              </div>
            </div>
            <button className={gradientButton}>Manage</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Data Management</h3>
                <p className="text-sm text-gray-600">Export or backup your data</p>
              </div>
            </div>
            <div className="space-x-2">
              <button className={gradientButton}>Export</button>
              <button className={`${gradientButton} opacity-80`}>Backup</button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Support">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Help Center</h3>
                <p className="text-sm text-gray-600">Get help and support</p>
              </div>
            </div>
            <button className={gradientButton}>Contact</button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};