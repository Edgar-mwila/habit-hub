import React from 'react';
import {
  Moon, Bell, Database, HelpCircle, RefreshCw,
  MessageCircle, Award, User
} from 'react-feather';
import { useSettings } from '../context/settings';
import { AnalogTimePicker } from './AnalogTimeSelector';
import { AlarmClock } from 'lucide-react';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode, isDarkMode: boolean }> = ({ title, children, isDarkMode }) => (
  <div className="mb-8">
    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} mb-4`}>{title}</h2>
    <div className={`rounded-lg shadow-md p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {children}
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  const gradientButton = "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded transition-all duration-200";
  const toggleClass = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors";
  const toggleHandle = `inline-block h-4 w-4 transform rounded-full ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} transition-transform`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
          Settings
        </h1>
        <p className={`text-gray-600 ${settings.darkMode ? 'text-gray-300' : ''}`}>Customize your HabitHub experience</p>
      </header>

      <SettingsSection title="Appearance" isDarkMode={settings.darkMode}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Dark Mode</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Toggle dark theme</p>
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

      <SettingsSection title="Notifications" isDarkMode={settings.darkMode}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Enable Notifications</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive reminders and updates</p>
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

      <SettingsSection title="Reminders" isDarkMode={settings.darkMode}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Daily Reminders</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get notified daily about your habits</p>
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
            <Award className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Weekly Reviews</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Review your weekly progress</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('weeklyReviews', !settings.weeklyReviews)}
            className={`${toggleClass} ${settings.weeklyReviews ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <span className={`${toggleHandle} ${settings.weeklyReviews ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="ml-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlarmClock className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <div>
                <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Morning Todo</h3>
                <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set your morning reminder time</p>
              </div>
            </div>
            <AnalogTimePicker 
              value={settings.todoListMorningNotificationTime || '08:00'}
              onChange={(time) => updateSetting('todoListMorningNotificationTime', time)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlarmClock className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <div>
                <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Evening Todo</h3>
                <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set your evening reminder time</p>
              </div>
            </div>
            <AnalogTimePicker 
              value={settings.todoListEveningNotificationTime || '20:00'}
              onChange={(time) => updateSetting('todoListEveningNotificationTime', time)}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="General" isDarkMode={settings.darkMode}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Chat Assistant</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enable assistant for habit guidance</p>
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
            <Database className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Data Backup</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Keep your data safe</p>
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
            <MessageCircle className={`mr-4 ${settings.darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <div>
              <h3 className={`font-semibold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Motivational Quotes</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enable daily motivational quotes</p>
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
