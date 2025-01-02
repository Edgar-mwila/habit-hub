import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2, Calendar, CheckCircle, AlertCircle } from 'react-feather';

type GoalType = 'yearly' | 'monthly' | 'weekly' | 'daily';
type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'at-risk';

interface Goal {
  id: string;
  title: string;
  type: GoalType;
  progress: number;
  dueDate: string;
  description?: string;
  status: GoalStatus;
  subGoals?: string[];
}

interface GoalFormData {
  title: string;
  type: GoalType;
  dueDate: string;
  description?: string;
}

export const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      title: 'Read 12 books', 
      type: 'yearly', 
      progress: 25, 
      dueDate: '2024-12-31',
      status: 'in-progress',
      description: 'Focus on personal development and fiction books'
    },
    { 
      id: '2', 
      title: 'Exercise 3 times a week', 
      type: 'weekly', 
      progress: 66, 
      dueDate: '2024-05-07',
      status: 'completed'
    }
  ]);
  
  const [expandedType, setExpandedType] = useState<GoalType | null>('yearly');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const statusColors = {
    'not-started': 'bg-gray-200',
    'in-progress': 'bg-purple-200',
    'completed': 'bg-green-200',
    'at-risk': 'bg-orange-200'
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-purple-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const GoalForm: React.FC<{
    onSubmit: (data: GoalFormData) => void;
    onCancel: () => void;
    initialData?: Partial<Goal>;
  }> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState<GoalFormData>({
      title: initialData?.title || '',
      type: initialData?.type || 'daily',
      dueDate: initialData?.dueDate || '',
      description: initialData?.description || ''
    });

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">
          {initialData ? 'Edit Goal' : 'Add New Goal'}
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Goal Title"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <textarea
              placeholder="Description (optional)"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as GoalType})}
            >
              <option value="daily">Daily Goal</option>
              <option value="weekly">Weekly Goal</option>
              <option value="monthly">Monthly Goal</option>
              <option value="yearly">Yearly Goal</option>
            </select>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded hover:from-purple-700 hover:to-orange-600"
              >
                {initialData ? 'Update Goal' : 'Add Goal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const renderGoalCard = (goal: Goal) => {
    const isEditing = editingGoal === goal.id;
    
    if (isEditing) {
      return (
        <GoalForm
          initialData={goal}
          onSubmit={(data) => {
            setGoals(goals.map(g => g.id === goal.id ? {...g, ...data} : g));
            setEditingGoal(null);
          }}
          onCancel={() => setEditingGoal(null)}
        />
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-purple-800">{goal.title}</h3>
            {goal.description && (
              <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setEditingGoal(goal.id)}
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}
              className="text-orange-500 hover:text-orange-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${getProgressColor(goal.progress)} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className={`px-2 py-1 rounded-full ${statusColors[goal.status]} text-gray-800`}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </span>
            <span className="flex items-center text-gray-600">
              <Calendar size={14} className="mr-1" />
              {new Date(goal.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
            Goal Management
          </h1>
          <p className="text-gray-600">Track and manage your journey</p>
        </div>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Goal
        </button>
      </header>

      {isAddingGoal && (
        <div className="mb-8">
          <GoalForm
            onSubmit={(data) => {
              setGoals([...goals, {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                progress: 0,
                status: 'not-started'
              }]);
              setIsAddingGoal(false);
            }}
            onCancel={() => setIsAddingGoal(false)}
          />
        </div>
      )}

      {(['yearly', 'monthly', 'weekly', 'daily'] as GoalType[]).map(type => (
        <div key={type} className="mb-6">
          <div
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedType(expandedType === type ? null : type)}
          >
            <h2 className="text-xl font-semibold text-purple-800 capitalize">{type} Goals</h2>
            {expandedType === type ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {expandedType === type && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {goals.filter(goal => goal.type === type).map(goal => (
                <div key={goal.id}>
                  {renderGoalCard(goal)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};