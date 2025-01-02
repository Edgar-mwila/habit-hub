import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';

type CategoryData = {
  category: string;
  completed: number;
  total: number;
  streak: number;
};

export const Analytics: React.FC = () => {

  const completionRate: number = 75;
  const categoryData: CategoryData[] = [
    { category: 'Health', completed: 8, total: 10, streak: 5 },
    { category: 'Career', completed: 6, total: 8, streak: 3 },
    { category: 'Personal', completed: 4, total: 5, streak: 2 },
    { category: 'Finance', completed: 3, total: 6, streak: 1 },
  ];

  const getMotivationalMessage = (completion: number): string => {
    if (completion >= 80) return "Outstanding progress! You're crushing it! 🌟";
    if (completion >= 60) return "Great work! Keep up the momentum! 💪";
    if (completion >= 40) return "You're making steady progress! Keep going! 🎯";
    return "Every step counts! You've got this! 🌱";
  };

  return (
    <div className="max-w-6xl mx-auto p-6" style={{ background: 'linear-gradient(to bottom right, #FFEFDB, #C79DD7)' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-purple-800">Your Progress Journey</h1>
        <p className="text-lg text-orange-700">Tracking your path to success</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Overview Card */}
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold flex items-center text-purple-800 mb-4">
            <BarChart2 className="mr-2 text-orange-500" /> Progress Overview
          </h2>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#FFEFDB"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#C084FC"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 88 * completionRate / 100} ${2 * Math.PI * 88}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-purple-700">{completionRate}%</span>
            </div>
          </div>
          <p className="text-center mt-4 text-orange-600 font-medium">
            {getMotivationalMessage(completionRate)}
          </p>
        </div>

        {/* Category Progress Card */}
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold flex items-center text-purple-800 mb-4">
            <PieChart className="mr-2 text-orange-500" /> Category Progress
          </h2>
          <div className="space-y-6">
            {categoryData.map(({ category, completed, total, streak }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-800">{category}</span>
                  <div className="flex items-center">
                    <span className="text-orange-600">{completed}/{total}</span>
                    {streak > 0 && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {streak} day streak! 🔥
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-orange-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completed / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
