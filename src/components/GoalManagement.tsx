import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/settings';
import { Goal, DEFAULT_CATEGORIES, Review } from '../types';

const REVIEW_TIME = '20:00';

const GoalForm: React.FC<{
  onSubmit: (data: Partial<Goal>) => void;
  onCancel: () => void;
  initialData?: Partial<Goal>;
  isDarkMode: boolean;
}> = ({ onSubmit, onCancel, initialData, isDarkMode }) => {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Career',
    status: 'not-started',
    currentProgress: 0,
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
    reviewFrequency: initialData?.reviewFrequency || 'weekly',
    reviewHistory: [],
  });

  const containerClasses = isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-black';
  const inputClasses = isDarkMode ? 'bg-gray-700 text-purple-200 border-gray-600' : 'bg-purple-200 text-black border-gray-300';

  return (
    <div className={`p-6 rounded-lg shadow-lg ${containerClasses}`}>
      <h3 className="text-xl font-semibold mb-4">
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
          onChange={e => setFormData({...formData, category: e.target.value as Goal['category']})}
        >
          {DEFAULT_CATEGORIES.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className={`w-full p-2 border rounded-md ${inputClasses}`}
          value={formData.reviewFrequency}
          onChange={e => setFormData({...formData, reviewFrequency: e.target.value as Goal['reviewFrequency']})}
        >
          <option value="daily">Daily Review</option>
          <option value="weekly">Weekly Review</option>
          <option value="never">Manual Review Only</option>
        </select>

        <label>
          Due Date
          <input
            type="date"
            className={`w-full p-2 border rounded-md ${inputClasses}`}
            value={formData.dueDate}
            onChange={e => setFormData({...formData, dueDate: e.target.value})}
            required
          />
        </label>

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
            className="px-4 py-2 bg-purple-600 text-purple-200 rounded-md hover:bg-purple-700"
          >
            {initialData ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  goal: Goal;
  isDarkMode: boolean;
}

interface FormData {
  goalId: string;
  date: string;
  value: number;
  notes: string;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({ isOpen, onClose, onSubmit, goal, isDarkMode }) => {
  const [formData, setFormData] = useState({
    goalId: goal.id,
    date: new Date().toISOString(),
    value: goal.currentProgress,
    notes: ''
  });

  // Reset form data when dialog opens with a new goal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        goalId: goal.id,
        date: new Date().toISOString(),
        value: goal.currentProgress,
        notes: ''
      });
    }
  }, [isOpen, goal]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.UIEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent event propagation for dialog content clicks
  const handleDialogClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
  };

  const getDaysRemaining = () => {
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSliderChange = (e: { stopPropagation: () => void; target: { value: string; }; }) => {
    e.stopPropagation(); // Prevent event bubbling
    setFormData(prev => ({ ...prev, value: parseInt(e.target.value) }));
  };

  const handleSubmit = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault(); // Prevent form submission from closing dialog
    e.stopPropagation(); // Prevent event bubbling
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className={`w-full max-w-md rounded-xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-purple-200 text-gray-900'
        } p-6 transform transition-all`}
        onClick={handleDialogClick}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Update Progress</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your progress for <span className="font-medium text-purple-500">{goal.title}</span>
            </p>
          </div>

          {/* Goal Summary Card */}
          <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Current Progress</span>
                <span className="font-medium">{goal.currentProgress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Days Remaining</span>
                <span className="font-medium">{getDaysRemaining()} days</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${goal.currentProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              New Progress: {formData.value}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.value}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Progress Notes
            </label>
            <textarea
              placeholder="What progress did you make? Any challenges or insights?"
              className={`w-full p-3 border rounded-lg resize-none h-24 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 focus:border-purple-500' 
                  : 'bg-purple-200 border-gray-300 focus:border-purple-500'
              }`}
              value={formData.notes}
              onChange={e => {
                e.stopPropagation();
                setFormData({...formData, notes: e.target.value});
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-purple-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-purple-200 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              Save Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [reviewingGoal, setReviewingGoal] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    loadGoals();
    const interval = setInterval(checkReviewSchedule, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadGoals = () => {
    const savedGoals = LocalStorageManager.getGoals();
    setGoals(savedGoals);
  };

  const checkReviewSchedule = () => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    if (currentTime === REVIEW_TIME) {
      goals.forEach(goal => {
        if (!shouldShowReviewNotification(goal)) return;
        
        const notification = `Time to review your goal: ${goal.title}`;
        if (!notifications.includes(notification)) {
          setNotifications(prev => [...prev, notification]);
        }
      });
    }
  };

  const shouldShowReviewNotification = (goal: Goal) => {
    if (goal.status === 'completed') return false;
    if (goal.reviewFrequency === 'never') return false;
    
    const lastReview = goal.reviewHistory[goal.reviewHistory.length - 1];
    if (!lastReview) return true;
    
    const lastReviewDate = new Date(lastReview.date);
    const today = new Date();
    
    if (goal.reviewFrequency === 'daily') {
      return lastReviewDate.getDate() !== today.getDate();
    }
    
    if (goal.reviewFrequency === 'weekly') {
      const diffTime = Math.abs(today.getTime() - lastReviewDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 7;
    }
    
    return false;
  };

  const handleSubmit = (data: Partial<Goal>) => {
    const newGoal: Goal = {
      ...data,
      id: editingGoal?.id || Math.random().toString(36).substring(7),
      status: 'in-progress',
      currentProgress: editingGoal?.currentProgress || 0,
      reviewHistory: editingGoal?.reviewHistory || [],
    } as Goal;

    const updatedGoals = editingGoal 
      ? goals.map(g => g.id === editingGoal.id ? newGoal : g)
      : [...goals, newGoal];

    setGoals(updatedGoals);
    LocalStorageManager.saveGoals(updatedGoals);
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleReviewSubmit = (review: Partial<Review>) => {
    if (!reviewingGoal) return;

    const reviewObj: Review = {
      ...review,
      id: Math.random().toString(36).substring(7),
      goalId: reviewingGoal,
      date: new Date().toISOString(),
    } as Review;

    const updatedGoals = goals.map(goal => {
      if (goal.id === reviewingGoal) {
        const newProgress = review.value || 0;
        return {
          ...goal,
          currentProgress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'in-progress',
          reviewHistory: [...goal.reviewHistory, reviewObj],
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    LocalStorageManager.saveGoals(updatedGoals);
    setReviewingGoal(null);
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

  return (
    <div className={`max-w-6xl mx-auto space-y-8`}>
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`flex items-start p-4 mb-4 rounded-lg border ${
                settings.darkMode
                  ? 'bg-gray-800 border-purple-500 text-purple-200'
                  : 'bg-purple-50 border-purple-200 text-gray-800'
              }`}
            >
              <AlertTriangle className="h-4 w-4 text-purple-500"/>
              <div className="ml-3">
                <p className="text-sm">{notification}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${settings.darkMode ? 'text-purple-200' : 'text-orange-800'}`}>Your Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-purple-200 rounded-lg hover:bg-purple-700"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Goal
        </button>
      </div>

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
              isDarkMode={settings.darkMode}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {DEFAULT_CATEGORIES.map(category => {
          const categoryGoals = goals.filter(goal => goal.category === category.name);
          
          return (
              <div
                className={`cursor-pointer p-2 rounded-lg shadow-sm border ${
                  settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-200 border-gray-300'
                }`}
                onClick={() => toggleCategory(category.name)}
                style={{ borderLeft: `4px solid ${category.color}` }}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-semibold flex items-center ${
                      settings.darkMode ? 'text-purple-200' : 'text-gray-900'
                    }`}
                  >
                    {category.name}
                    <span className="ml-3 text-sm text-gray-500">
                      {categoryGoals.length} goals
                    </span>
                  </h3>
                  {expandedCategories.includes(category.name) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

              {expandedCategories.includes(category.name) && (
                <div className="mt-4 space-y-4">
                  {categoryGoals.map(goal => (
                    <div key={goal.id} className={`p-4 border rounded-lg ${settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-200 border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className={`font-medium text-lg ${settings.darkMode ? 'text-purple-200' : ''}`}>
                            {goal.title}
                          </h3>
                          <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {goal.description}
                          </p>
                          <div className={`text-sm mt-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Review Frequency: {goal.reviewFrequency || 'weekly'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingGoal(goal);
                              setShowForm(true);
                            }}
                            className={`p-2 ${settings.darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className={`p-2 ${settings.darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${goal.currentProgress}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Progress: {goal.currentProgress}%
                          </span>
                          <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setReviewingGoal(goal.id)
                              }
                            }
                            className="px-3 py-1 text-sm bg-purple-600 text-purple-200 rounded-md hover:bg-purple-700"
                          >
                            Add Review
                          </button>
                        </div>

                        {/* Review Form */}
                        {reviewingGoal === goal.id && (
                          <ReviewDialog
                            isOpen={reviewingGoal === goal.id}
                            onClose={() => setReviewingGoal(null)}
                            onSubmit={handleReviewSubmit}
                            goal={goal}
                            isDarkMode={settings.darkMode}
                          />
                        )}

                        {/* Review History */}
                        {goal.reviewHistory.length > 0 && (
                          <div className="mt-4">
                            <h4 className={`text-sm font-medium mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Review History
                            </h4>
                            <div className="space-y-2">
                              {goal.reviewHistory.slice(-3).reverse().map(review => (
                                <div
                                  key={review.id}
                                  className={`p-3 rounded-md ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                    <span className={`text-sm font-medium ${settings.darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                      {review.value}%
                                    </span>
                                  </div>
                                  {review.notes && (
                                    <p className={`text-sm mt-1 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      "{review.notes}"
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subgoals Section */}
                        {goal.subGoals && goal.subGoals.length > 0 && (
                          <div className="mt-4">
                            <h4 className={`text-sm font-medium mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Subgoals
                            </h4>
                            <div className="space-y-2 pl-4">
                              {goal.subGoals.map(subgoal => (
                                <div
                                  key={subgoal.id}
                                  className={`p-3 rounded-md border ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={settings.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {subgoal.title}
                                    </span>
                                    <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {subgoal.currentProgress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2">
                                    <div
                                      className="bg-purple-600 h-1.5 rounded-full"
                                      style={{ width: `${subgoal.currentProgress}%` }}
                                    />
                                  </div>
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
          );
        })}
      </div>
    </div>
  );
};

export default GoalManagement;