import React from "react";
import { Moon, Sun } from 'lucide-react';
import { useSettings } from "../../../context/settings";

export function ThemeToggle() {
  const { settings, updateSetting } = useSettings();

  return (
    <button
      onClick={() => updateSetting('darkMode', !settings.darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

