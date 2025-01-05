import React from 'react';
import { Clock, Check, Book, MonitorDot } from 'lucide-react';
import { useSettings } from "../context/settings";
import { Goal } from "../types";

interface GoalProgressProps {
  goal: Goal;
  onProgressUpdate: (progress: number) => void;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({
  goal,
  onProgressUpdate
}) => {
  const { settings } = useSettings();
  const isDark = settings.darkMode;
  
  const formatProgress = (value: number) => {
    switch (goal.metric.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: goal.metric.format || 'ZMW'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'distance':
        return `${value} ${goal.metric.unit}`;
      case 'time':
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      case 'pages':
        return `${value} pages`;
      default:
        return value.toString();
    }
  };

  const getProgressPercentage = () => {
    if (goal.target === 0) return 0;
    return (goal.currentProgress / goal.target) * 100;
  };

  const renderMetricIcon = () => {
    switch (goal.metric.type) {
      case 'time':
        return <Clock className="w-5 h-5" />;
      case 'pages':
        return <Book className="w-5 h-5" />;
      case 'checked':
        return <Check className="w-5 h-5" />;
      default:
        return <MonitorDot className="w-5 h-5" />;
    }
  };

  const renderProgressInput = () => {
    switch (goal.metric.type) {
      case 'checked':
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={goal.currentProgress === goal.target}
              onChange={(e) => onProgressUpdate(e.target.checked ? goal.target : 0)}
              className="w-6 h-6 rounded-lg cursor-pointer"
            />
          </div>
        );
      
      case 'percentage':
        return (
          <div className="relative pt-1 w-full">
            <input
              type="range"
              min="0"
              max="100"
              value={goal.currentProgress}
              onChange={(e) => onProgressUpdate(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
                ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            />
            <div className="mt-2 text-center">{formatProgress(goal.currentProgress)}</div>
          </div>
        );

      case 'time':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              value={Math.floor(goal.currentProgress / 60)}
              onChange={(e) => {
                const hours = Number(e.target.value);
                const minutes = goal.currentProgress % 60;
                onProgressUpdate(hours * 60 + minutes);
              }}
              min="0"
              className={`w-20 px-2 py-1 rounded border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Hours"
            />
            <input
              type="number"
              value={goal.currentProgress % 60}
              onChange={(e) => {
                const hours = Math.floor(goal.currentProgress / 60);
                const minutes = Number(e.target.value);
                onProgressUpdate(hours * 60 + minutes);
              }}
              min="0"
              max="59"
              className={`w-20 px-2 py-1 rounded border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Minutes"
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max={goal.target}
              value={goal.currentProgress}
              onChange={(e) => onProgressUpdate(Number(e.target.value))}
              className={`w-24 px-2 py-1 rounded border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
            <span className="text-sm">{goal.metric.unit}</span>
          </div>
        );
    }
  };

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center space-x-2 mb-4">
        {renderMetricIcon()}
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {goal.title}
        </h3>
      </div>

      <div className="space-y-4">
        {goal.metric.type !== 'checked' && (
          <div className="relative pt-1">
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Progress
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatProgress(goal.currentProgress)} / {formatProgress(goal.target)}
              </span>
            </div>
            <div className={`overflow-hidden h-2 text-xs flex rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                style={{ width: `${getProgressPercentage()}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap 
                  text-white justify-center bg-blue-500 transition-all duration-300`}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Update Progress
          </span>
          {renderProgressInput()}
        </div>
      </div>
    </div>
  );
};