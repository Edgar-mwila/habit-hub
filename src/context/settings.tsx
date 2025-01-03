import React, { createContext, useContext, useState } from 'react';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  dailyReminders: boolean;
  weeklyReviews: boolean;
  chatAssistant: boolean;
  language: string;
  dataBackup: boolean;
  motivationalQuotes: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean | string) => void;
}

const defaultSettings: Settings = {
  darkMode: false,
  notifications: true,
  dailyReminders: true,
  weeklyReviews: true,
  chatAssistant: true,
  language: 'English',
  dataBackup: true,
  motivationalQuotes: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSetting = (key: keyof Settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
