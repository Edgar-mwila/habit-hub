import React from 'react';
import { BarChart2, PieChart, TrendingUp, Award } from 'react-feather';

export const Analytics: React.FC = () => {
  // Mock data for charts
  const completionRate = 75;
  const categoryData = [
    { category: 'Health', completed: 8, total: 10 },
    { category: 'Career', completed: 6, total: 8 },
    { category: 'Personal', completed: 4, total: 5 },
    { category: 'Finance', completed: 3, total: 6 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Analytics</h1>
        <p className="text-xl text-gray-600">Track your progress and insights</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BarChart2 className="mr-2" /> Overall Completion Rate
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                />
                <text x="18" y="20.35" className="text-5xl font-bold" textAnchor="middle" fill="#3B82F6">
                  {completionRate}%
                </text>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <PieChart className="mr-2" /> Goals by Category
          </h2>
          <div className="space-y-4">
            {categoryData.map(({ category, completed, total }) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{category}</span>
                  <span>
                    {completed}/{total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(completed / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Progress Over Time
          </h2>
          <div className="h-64 flex items-end justify-between">
            {[30, 45, 60, 75, 50, 80, 70].map((value, index) => (
              <div key={index} className="w-8 bg-blue-500 rounded-t" style={{ height: `${value}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
            <span>Week 6</span>
            <span>Week 7</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Award className="mr-2" /> Achievements
          </h2>
          <ul className="space-y-4">
            {[
              { title: 'Goal Setter', description: 'Set your first 10 goals' },
              { title: 'Consistent Achiever', description: 'Complete goals for 7 days in a row' },
              { title: 'Category Master', description: 'Complete all goals in a category' },
              { title: 'Overachiever', description: 'Complete 50 goals' },
            ].map((achievement, index) => (
              <li key={index} className="flex items-center">
                <Award className="text-yellow-500 mr-2" />
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

