import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle, TrendingUp, Award } from 'react-feather';

export const Dashboard: React.FC = () => {
    const [streak, setStreak] = useState(5);
    const [completedToday, setCompletedToday] = useState(3);
    const [totalToday, setTotalToday] = useState(5);

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Welcome back, Achiever!</h1>
                <p className="text-xl text-gray-600">Let's make today count!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DashboardCard
                    title="Current Streak"
                    value={streak}
                    icon={<TrendingUp className="w-8 h-8 text-green-500" />}
                    description="Keep it up! You're on fire!"
                />
                <DashboardCard
                    title="Today's Progress"
                    value={`${completedToday}/${totalToday}`}
                    icon={<CheckCircle className="w-8 h-8 text-blue-500" />}
                    description="Great job! Keep pushing!"
                />
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <QuickActionButton
                        to="/goals/new"
                        icon={<PlusCircle className="w-6 h-6" />}
                        label="Add New Goal"
                        color="bg-blue-500 hover:bg-blue-600"
                    />
                    <QuickActionButton
                        to="/goals"
                        icon={<CheckCircle className="w-6 h-6" />}
                        label="Update Progress"
                        color="bg-green-500 hover:bg-green-600"
                    />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Top Goals</h2>
                <div className="space-y-4">
                    <GoalItem
                        title="Read 20 pages daily"
                        progress={75}
                        daysLeft={5}
                    />
                    <GoalItem
                        title="Exercise 3 times a week"
                        progress={50}
                        daysLeft={3}
                    />
                    <GoalItem
                        title="Learn a new recipe"
                        progress={25}
                        daysLeft={2}
                    />
                </div>
            </section>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

interface QuickActionButtonProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ to, icon, label, color }) => (
    <Link to={to} className={`flex items-center justify-center p-4 rounded-lg text-white ${color} transition-colors duration-200`}>
        {icon}
        <span className="ml-2 font-semibold">{label}</span>
    </Link>
);

interface GoalItemProps {
    title: string;
    progress: number;
    daysLeft: number;
}

const GoalItem: React.FC<GoalItemProps> = ({ title, progress, daysLeft }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <Award className={`w-6 h-6 ${progress === 100 ? 'text-yellow-500' : 'text-gray-400'}`} />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
            <span>{progress}% Complete</span>
            <span>{daysLeft} days left</span>
        </div>
    </div>
);

