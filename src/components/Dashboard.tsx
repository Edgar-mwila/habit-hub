import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { AnalyticsService } from '../services/AnalyticsService';
import { 
  CheckCircle, 
  TrendingUp, 
  Target,
  Clock, 
  Briefcase, 
  DollarSign, 
  Heart, 
  User
} from 'lucide-react';
import { type Goal, type Category, DEFAULT_CATEGORIES } from '../types';
import { useSettings } from '../context/settings';

const iconMap = {
  'briefcase': Briefcase,
  'dollar-sign': DollarSign,
  'heart': Heart,
  'user': User,
};

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description: string;
  isDarkMode: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  isDarkMode
}) => (
  <div className={`rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-gradient-to-br from-purple-100 to-orange-100'}`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
      {value}
    </p>
    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);

interface ActiveGoalProps {
  goal: Goal;
  isDarkMode: boolean;
}

const ActiveGoal: React.FC<ActiveGoalProps> = ({ goal, isDarkMode }) => {
  const getStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-orange-500';
    return 'text-purple-500';
  };

  return (
    <div className={`rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{goal.title}</h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{goal.category}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goal.currentProgress)}`}>
          {Math.round((goal.currentProgress / goal.target) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
        <div 
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all duration-500"
          style={{ width: `${(goal.currentProgress / goal.target) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Target className="w-4 h-4 mr-1" />
          {goal.currentProgress} / {goal.target} {goal.metric.unit}
        </span>
        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Clock className="w-4 h-4 mr-1" />
          {Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
        </span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [streak, setStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const storedGoals = LocalStorageManager.getGoals();
    const user = LocalStorageManager.getUser();
    setGoals(storedGoals);
    setCategories(user?.preferences.categories || DEFAULT_CATEGORIES);
    
    // Calculate streak and completion rate
    setStreak(AnalyticsService.getStreakCount(storedGoals));
    const completed = storedGoals.filter(goal => goal.status === 'completed').length;
    setCompletionRate((completed / storedGoals.length) * 100);
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getActiveGoals = () => {
    return goals.filter(goal => 
      goal.status === 'in-progress' && 
      new Date(goal.endDate) > new Date()
    ).sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className="mb-12">
        <p className="text-xl text-orange-600 mb-2">Good {getTimeOfDay()}, Achiever!</p>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-orange-700">
          Your Journey Continues
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          title="Current Streak"
          value={streak}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          description="Keep the momentum going!"
          trend={15}
          isDarkMode={settings.darkMode}
        />
        <DashboardCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          icon={<CheckCircle className="w-6 h-6 text-orange-500" />}
          description="Your success rate across all goals"
          isDarkMode={settings.darkMode}
        />
        <DashboardCard
          title="Active Goals"
          value={getActiveGoals().length}
          icon={<Target className="w-6 h-6 text-purple-600" />}
          description="Currently in progress"
          isDarkMode={settings.darkMode}
        />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Category Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            const progress = AnalyticsService.calculateCategoryProgress(goals, category.name);

            return (
              <div key={category.id} className={`rounded-xl shadow-md p-6 ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                    {IconComponent && (
                      <IconComponent 
                        size={24} 
                        style={{ color: category.color }}
                      />
                    )}
                  </div>
                  <h3 className="ml-3 font-semibold">{category.name}</h3>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: category.color }}
                  />
                </div>
                <p className="mt-2 text-sm">{Math.round(progress)}% complete</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getActiveGoals().slice(0, 4).map(goal => (
            <ActiveGoal key={goal.id} goal={goal} isDarkMode={settings.darkMode} />
          ))}
        </div>
      </section>
    </div>
  );
};
