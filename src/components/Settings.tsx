import React from 'react';
import {
  Moon, Bell, Database, HelpCircle, RefreshCw,
  MessageCircle, Award, User
} from 'react-feather';
import { useSettings } from '../context/settings';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-4">{title}</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {children}
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  const gradientButton = "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded transition-all duration-200";
  const toggleClass = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors";
  const toggleHandle = "inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your HabitHub experience</p>
      </header>

      <SettingsSection title="Appearance">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            className={`${toggleClass} ${settings.darkMode ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Enable Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive reminders and updates</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('notifications', !settings.notifications)}
            className={`${toggleClass} ${settings.notifications ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Reminders">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Daily Reminders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified daily about your habits</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('dailyReminders', !settings.dailyReminders)}
            className={`${toggleClass} ${settings.dailyReminders ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.dailyReminders ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Reviews</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review your weekly progress</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('weeklyReviews', !settings.weeklyReviews)}
            className={`${toggleClass} ${settings.weeklyReviews ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.weeklyReviews ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="General">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Chat Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable assistant for habit guidance</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('chatAssistant', !settings.chatAssistant)}
            className={`${toggleClass} ${settings.chatAssistant ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.chatAssistant ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Data Backup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Keep your data safe</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('dataBackup', !settings.dataBackup)}
            className={`${toggleClass} ${settings.dataBackup ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.dataBackup ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="mr-4 text-purple-600 dark:text-purple-300" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Motivational Quotes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable daily motivational quotes</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('motivationalQuotes', !settings.motivationalQuotes)}
            className={`${toggleClass} ${settings.motivationalQuotes ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.motivationalQuotes ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};
