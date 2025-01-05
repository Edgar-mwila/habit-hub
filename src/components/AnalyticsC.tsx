import React from 'react';
import { Goal } from '../types';
import { AnalyticsService } from '../services/AnalyticsService';

interface AnalyticsProps {
  goals: Goal[];
}

const Analytics: React.FC<AnalyticsProps> = ({ goals }) => {
  const streak = AnalyticsService.getStreakCount(goals);
  const completionRate = AnalyticsService.getCompletionRate(goals, 'daily');

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Current Streak</h3>
          <p className="text-3xl font-bold">{streak} days</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Daily Completion Rate</h3>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Category Progress</h3>
          {Array.from(new Set(goals.map(goal => goal.category))).map(category => (
            <div key={category} className="flex items-center mt-2">
              <span className="w-1/3">{category}</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${AnalyticsService.calculateCategoryProgress(goals, category)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

