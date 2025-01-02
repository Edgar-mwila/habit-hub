import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Calendar,
  Target,
  Clock,
  ChevronRight
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  trend?: number;
}

interface QuickActionButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  hoverColor: string;
}

interface GoalItemProps {
  title: string;
  progress: number;
  daysLeft: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface Achievement {
  title: string;
  date: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, description, trend }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
      {value}
    </p>
    <p className="text-sm text-gray-600 mt-2">{description}</p>
  </div>
);

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ to, icon, label, bgColor, hoverColor }) => (
  <Link 
    to={to} 
    className={`flex items-center justify-between p-4 rounded-xl text-white ${bgColor} ${hoverColor} transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-3 font-semibold">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5" />
  </Link>
);

const GoalItem: React.FC<GoalItemProps> = ({ title, progress, daysLeft, category, priority }) => {
  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-orange-500',
    low: 'text-purple-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
        <div 
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="flex items-center text-gray-600">
          <Target className="w-4 h-4 mr-1" />
          {progress}% Complete
        </span>
        <span className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {daysLeft} days left
        </span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [streak, setStreak] = useState<number>(5);
  const [completedToday, setCompletedToday] = useState<number>(3);
  const [totalToday, setTotalToday] = useState<number>(5);
  const [timeOfDay, setTimeOfDay] = useState<string>('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const recentAchievements: Achievement[] = [
    { title: '7-Day Streak', date: 'Today', icon: <Award className="w-5 h-5 text-yellow-500" /> },
    { title: 'Early Bird', date: 'Yesterday', icon: <Calendar className="w-5 h-5 text-blue-500" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-orange-50">
      <header className="mb-12">
        <p className="text-xl text-orange-600 mb-2">Good {timeOfDay}, Achiever!</p>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-orange-700">
          Your Journey Continues
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          title="Current Streak"
          value={streak}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          description="Your longest streak yet!"
          trend={15}
        />
        <DashboardCard
          title="Today's Progress"
          value={`${completedToday}/${totalToday}`}
          icon={<CheckCircle className="w-6 h-6 text-orange-500" />}
          description="You're making great progress!"
        />
        <DashboardCard
          title="Weekly Goals"
          value="80%"
          icon={<Target className="w-6 h-6 text-purple-600" />}
          description="Above your usual average"
          trend={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickActionButton
              to="/goals/new"
              icon={<PlusCircle className="w-5 h-5" />}
              label="Create New Goal"
              bgColor="bg-purple-600"
              hoverColor="hover:bg-purple-700"
            />
            <QuickActionButton
              to="/goals"
              icon={<CheckCircle className="w-5 h-5" />}
              label="Update Progress"
              bgColor="bg-orange-500"
              hoverColor="hover:bg-orange-600"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Achievements</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            {recentAchievements.map((achievement, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border-b last:border-0"
              >
                <div className="flex items-center">
                  {achievement.icon}
                  <span className="ml-3 font-medium">{achievement.title}</span>
                </div>
                <span className="text-sm text-gray-500">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoalItem
            title="Read 20 pages daily"
            progress={75}
            daysLeft={5}
            category="Personal Development"
            priority="high"
          />
          <GoalItem
            title="Exercise 3 times a week"
            progress={50}
            daysLeft={3}
            category="Health"
            priority="medium"
          />
          <GoalItem
            title="Learn TypeScript"
            progress={25}
            daysLeft={14}
            category="Career"
            priority="high"
          />
          <GoalItem
            title="Meditate daily"
            progress={90}
            daysLeft={2}
            category="Wellness"
            priority="low"
          />
        </div>
      </section>
    </div>
  );
};
