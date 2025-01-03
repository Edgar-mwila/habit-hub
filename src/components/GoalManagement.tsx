import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2, Calendar, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { MetricSelector } from './MetricSelector';
import { GoalProgress } from './GoalProgress';
import type { Goal, Metric, Category } from '../types';
import { useSettings } from '../context/settings';

const GoalForm: React.FC<{
  onSubmit: (data: Partial<Goal>) => void;
  onCancel: () => void;
  initialData?: Partial<Goal>;
  categories: Category[];
  metrics: Metric[];
  isDarkMode: boolean;
}> = ({ onSubmit, onCancel, initialData, categories, metrics,isDarkMode }) => {

  const [formData, setFormData] = useState<Partial<Goal>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || categories[0].name,
    timeframe: initialData?.timeframe || 'daily',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    target: initialData?.target || 0,
    metric: initialData?.metric || metrics[0],
    type: 'yearly',
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
  });

  const containerClasses = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black';
  const inputClasses = isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-purple-500' : 'bg-white text-black border-gray-300 focus:ring-2 focus:ring-purple-500';
  const buttonClasses = isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:from-purple-700 hover:to-orange-600';

  return (
    <div className={`p-6 rounded-lg shadow-lg ${containerClasses}`}>
      <h3 className="text-xl font-semibold mb-4 text-purple-800">
        {initialData ? 'Edit Goal' : 'Create New Goal'}
      </h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }} className="space-y-4">
        <input
          type="text"
          placeholder="Goal Title"
          className={`w-full p-2 border rounded-md ${inputClasses}`}
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Description"
          className={`w-full p-2 border rounded-md ${inputClasses}`}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <select
          className={`w-full p-2 border rounded-md ${inputClasses}`}
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
        >
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className={`w-full p-2 border rounded-md ${inputClasses}`}
          value={formData.timeframe}
          onChange={e => setFormData({...formData, timeframe: e.target.value as Goal['timeframe']})}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <MetricSelector
          metrics={metrics}
          selectedMetric={formData.metric!}
          onMetricChange={metric => setFormData({...formData, metric})}
        />

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className={`w-full p-2 border rounded-md ${inputClasses}`}
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className={`w-full p-2 border rounded-md ${inputClasses}`}
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target ({formData.metric!.unit || 'units'})
          </label>
          <input
            type="number"
            className={`w-full p-2 border rounded-md ${inputClasses}`}
            value={formData.target}
            onChange={e => setFormData({...formData, target: Number(e.target.value)})}
            required
            min="0"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${buttonClasses}`}
          >
            {initialData ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showNoteInput, setShowNoteInput] = useState<string | null>(null);
  const [progressNote, setProgressNote] = useState('');
  const { settings } = useSettings();

  useEffect(() => {
    setGoals(LocalStorageManager.getGoals());
    setCategories(LocalStorageManager.getCategories());
    setMetrics(LocalStorageManager.getMetrics());
  }, []);

  const handleSubmit = (data: Partial<Goal>) => {
    const newGoal: Goal = {
      ...data,
      id: editingGoal?.id || Math.random().toString(36).substring(7),
      currentProgress: editingGoal?.currentProgress || 0,
      status: 'not-started',
      progressHistory: editingGoal?.progressHistory || [],
    } as Goal;

    const updatedGoals = editingGoal 
      ? goals.map(g => g.id === editingGoal.id ? newGoal : g)
      : [...goals, newGoal];

    setGoals(updatedGoals);
    LocalStorageManager.saveGoals(updatedGoals);
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    setShowNoteInput(goalId);
  };

  const saveProgressWithNote = (goalId: string, progress: number) => {
    const now = new Date().toISOString();
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newProgress = {
          id: Math.random().toString(36).substring(7),
          goalId,
          date: now,
          value: progress,
          notes: progressNote || undefined
        };
        return {
          ...goal,
          currentProgress: progress,
          progressHistory: [...goal.progressHistory, newProgress],
          status: progress >= goal.target ? 'completed' : 'in-progress'
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    LocalStorageManager.saveGoals(updatedGoals);
    setShowNoteInput(null);
    setProgressNote('');
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    LocalStorageManager.saveGoals(updatedGoals);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getDaysUntilDue = (dueDate: string | number | Date) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUpcomingGoals = () => {
    return goals.filter(goal => {
      const daysUntilDue = getDaysUntilDue(goal.dueDate);
      return daysUntilDue <= 7 && daysUntilDue > 0 && goal.status !== 'completed';
    });
  };

  const categorizedGoals = categories.map(category => ({
    category,
    goals: goals.filter(goal => goal.category === category.name)
  }));

  return (
    <div
      className={`max-w-6xl mx-auto p-6 space-y-8 ${settings.darkMode ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-white'}`}
    >
      {/* Upcoming Deadlines Section */}
      {getUpcomingGoals().length > 0 && (
        <div
          className={`p-4 rounded-lg border ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-200'}`}
        >
          <h2 className={`text-lg font-semibold ${settings.darkMode ? 'text-orange-200' : 'text-orange-800'} mb-4 flex items-center`}>
            <AlertTriangle className="mr-2" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {getUpcomingGoals().map(goal => (
              <div
                key={goal.id}
                className={`flex items-center justify-between p-3 rounded-md shadow-sm ${settings.darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div>
                  <h3 className={`font-medium ${settings.darkMode ? 'text-white' : ''}`}>{goal.title}</h3>
                  <p className={`text-sm ${settings.darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    Due in {getDaysUntilDue(goal.dueDate)} days
                  </p>
                </div>
                <GoalProgress
                  goal={goal}
                  onProgressUpdate={(progress) => handleProgressUpdate(goal.id, progress)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Your Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Goal
        </button>
      </div>
  
      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <GoalForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
              initialData={editingGoal || undefined}
              categories={categories}
              metrics={metrics}
              isDarkMode={settings.darkMode}
            />
          </div>
        </div>
      )}
  
      {/* Categorized Goals */}
      <div className="space-y-6">
        {categorizedGoals.map(({ category, goals: categoryGoals }) => (
          <div key={category.id} className={`border rounded-lg overflow-hidden ${settings.darkMode ? 'bg-gray-800' : ''}`}>
            <button
              onClick={() => toggleCategory(category.name)}
              className={`w-full flex items-center justify-between p-4 ${settings.darkMode ? 'bg-gray-700' : 'bg-white'} hover:bg-gray-50`}
              style={{ borderLeft: `4px solid ${category.color}` }}
            >
              <div className="flex items-center">
                <span className={`font-semibold text-lg ${settings.darkMode ? 'text-white' : ''}`}>{category.name}</span>
                <span className="ml-3 text-sm text-gray-500">
                  {categoryGoals.length} goals
                </span>
              </div>
              {expandedCategories.includes(category.name) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
  
            {expandedCategories.includes(category.name) && (
              <div className="divide-y">
                {categoryGoals.map(goal => (
                  <div key={goal.id} className={`p-4 ${settings.darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`font-medium text-lg ${settings.darkMode ? 'text-white' : ''}`}>{goal.title}</h3>
                        <p className={`text-gray-600 text-sm ${settings.darkMode ? 'text-gray-300' : ''}`}>{goal.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingGoal(goal);
                            setShowForm(true);
                          }}
                          className={`p-2 ${settings.darkMode ? 'text-gray-200 hover:text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className={`p-2 ${settings.darkMode ? 'text-gray-200 hover:text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      <GoalProgress
                        goal={goal}
                        onProgressUpdate={(progress) => handleProgressUpdate(goal.id, progress)}
                      />
  
                      {showNoteInput === goal.id && (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Add a note about this progress update..."
                            value={progressNote}
                            onChange={(e) => setProgressNote(e.target.value)}
                            className={`w-full p-2 border rounded-md ${settings.darkMode ? 'bg-gray-600 text-white' : ''}`}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowNoteInput(null)}
                              className={`px-3 py-1 ${settings.darkMode ? 'text-gray-200 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveProgressWithNote(goal.id, goal.currentProgress)}
                              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                              Save Progress
                            </button>
                          </div>
                        </div>
                      )}
  
                      {/* Progress History */}
                      {goal.progressHistory.length > 0 && (
                        <div className="mt-4">
                          <h4 className={`text-sm font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Progress History
                          </h4>
                          <div className="space-y-2">
                            {goal.progressHistory.slice(-3).reverse().map(progress => (
                              <div key={progress.id} className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} flex justify-between items-center`}>
                                <span>{new Date(progress.date).toLocaleDateString()}</span>
                                <span>{progress.value} {goal.metric.unit}</span>
                                {progress.notes && (
                                  <span className="text-gray-500 italic">"{progress.notes}"</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );  
};