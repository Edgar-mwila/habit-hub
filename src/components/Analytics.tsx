import React, { useEffect, useState } from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import { AnalyticsService } from '../services/AnalyticsService';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { Goal, Category } from '../types';
import { useSettings } from '../context/settings';
import { TodoAnalytics } from './TodoAnalytics';

export const Analytics = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const storedGoals = LocalStorageManager.getGoals();
    const storedCategories = LocalStorageManager.getCategories();
    setGoals(storedGoals);
    setCategories(storedCategories);

    // Calculate analytics data
    const data = storedCategories.map(category => ({
      category: category.name,
      color: category.color,
      progress: AnalyticsService.calculateCategoryProgress(storedGoals, category.name),
      totalGoals: storedGoals.filter(goal => goal.category === category.name).length,
      completedGoals: storedGoals.filter(
        goal => goal.category === category.name && goal.status === 'completed'
      ).length,
      streak: AnalyticsService.getGoalStreak(
        storedGoals.filter(goal => goal.category === category.name)
      )
    }));

    setAnalyticsData(data);

    // Calculate overall progress
    const totalProgress = data.reduce((sum, cat) => sum + cat.progress, 0);
    setOverallProgress(Math.round(totalProgress / (data.length || 1)));
  }, []);

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 min-h-screen ${
      settings.darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-purple-200' 
        : 'bg-gradient-to-b from-purple-50 to-orange-50'
    }`}>
      <header className="text-center py-8">
        <h1 className={`text-4xl font-bold bg-gradient-to-r ${
          settings.darkMode 
            ? 'from-purple-400 to-orange-400' 
            : 'from-purple-800 to-orange-600'
        } bg-clip-text text-transparent`}>
          Analytics Dashboard
        </h1>
        <p className={`text-lg mt-2 ${
          settings.darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Track your progress across all categories
        </p>
      </header>

      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
        Goal Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-orange-500" size={24} />
            <h2 className={`text-2xl font-semibold ${
              settings.darkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>
              Overall Progress
            </h2>
          </div>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={settings.darkMode ? '#374151' : '#f3e8ff'}
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeDasharray={`${(2 * Math.PI * 88 * overallProgress) / 100} ${2 * Math.PI * 88}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={settings.darkMode ? '#b794f4' : '#9333ea'} />
                  <stop offset="100%" stopColor={settings.darkMode ? '#f6ad55' : '#ea580c'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold bg-gradient-to-r ${
                settings.darkMode 
                  ? 'from-purple-400 to-orange-400' 
                  : 'from-purple-700 to-orange-600'
              } bg-clip-text text-transparent`}>
                {overallProgress}%
              </span>
            </div>
          </div>
          <p className={`text-center mt-6 font-medium ${
            settings.darkMode ? 'text-purple-300' : 'text-purple-700'
          }`}>
            {AnalyticsService.generateMotivationalMessage(overallProgress)}
          </p>
        </div>

        <div className={`rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="text-orange-500" size={24} />
            <h2 className={`text-2xl font-semibold ${
              settings.darkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>
              Category Progress
            </h2>
          </div>
          <div className="space-y-6">
            {analyticsData.map(({ category, color, progress, totalGoals, completedGoals, streak }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: color }}
                    />
                    <span className={`font-medium ${
                      settings.darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${
                      settings.darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {completedGoals}/{totalGoals} Goals
                    </span>
                    {streak > 0 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        settings.darkMode 
                          ? 'bg-gradient-to-r from-orange-900 to-purple-900 text-orange-300' 
                          : 'bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700'
                      }`}>
                        {streak}d 🔥
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-full rounded-full h-3 shadow-inner ${
                  settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div
                    className="h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${color}, ${color}dd)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TodoAnalytics />
    </div>
  );
};