import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2 } from 'react-feather';

type GoalType = 'yearly' | 'monthly' | 'weekly' | 'daily';

interface Goal {
  id: string;
  title: string;
  type: GoalType;
  progress: number;
  dueDate: string;
}

export const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Read 12 books', type: 'yearly', progress: 25, dueDate: '2023-12-31' },
    { id: '2', title: 'Exercise 3 times a week', type: 'weekly', progress: 66, dueDate: '2023-05-07' },
    { id: '3', title: 'Meditate for 10 minutes', type: 'daily', progress: 0, dueDate: '2023-05-01' },
    { id: '4', title: 'Learn a new language', type: 'monthly', progress: 40, dueDate: '2023-05-31' },
  ]);

  const [expandedType, setExpandedType] = useState<GoalType | null>(null);

  const toggleExpand = (type: GoalType) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const addGoal = () => {
    // Implement add goal functionality
  };

  const editGoal = (id: string) => {
    // Implement edit goal functionality
  };

  const deleteGoal = (id: string) => {
    // Implement delete goal functionality
  };

  const renderGoalList = (type: GoalType) => {
    const filteredGoals = goals.filter(goal => goal.type === type);
    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={() => toggleExpand(type)}
        >
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{type} Goals</h2>
          {expandedType === type ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expandedType === type && (
          <div className="mt-4 space-y-4">
            {filteredGoals.map(goal => (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => editGoal(goal.id)} className="text-blue-500 hover:text-blue-600">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{goal.progress}% Complete</span>
                  <span>Due: {goal.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Goal Management</h1>
          <p className="text-xl text-gray-600">Track and manage your goals</p>
        </div>
        <button
          onClick={addGoal}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <PlusCircle size={20} className="mr-2" />
          Add New Goal
        </button>
      </header>
      {renderGoalList('yearly')}
      {renderGoalList('monthly')}
      {renderGoalList('weekly')}
      {renderGoalList('daily')}
    </div>
  );
};

