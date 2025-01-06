import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalStorageManager } from '../services/LocalStorageManager';

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  dailyReminders: boolean;
  weeklyReviews: boolean;
  chatAssistant: boolean;
  language: string;
  dataBackup: boolean;
  motivationalQuotes: boolean;
  todoListMorningNotificationTime: string;
  todoListEveningNotificationTime: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean | string) => void;
}

export const defaultSettings: Settings = {
  darkMode: false,
  notifications: true,
  dailyReminders: true,
  weeklyReviews: true,
  chatAssistant: true,
  language: 'English',
  dataBackup: true,
  motivationalQuotes: true,
  todoListMorningNotificationTime: '07:00',
  todoListEveningNotificationTime: '07:00',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const storedSettings = LocalStorageManager.getSettings();
    setSettings(storedSettings);
  }, []);

  useEffect(() => {
    LocalStorageManager.saveSettings(settings);
  }, [settings]);

  const updateSetting = (key: keyof Settings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
