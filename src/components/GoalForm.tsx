import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Goal, DEFAULT_CATEGORIES } from '../types';
import { ClockSelector } from './ClockSelector';
import { useSettings } from '../context/settings';

// Custom colors based on HabbitHub logo
const colors = {
  primary: '#E67E22', // Warm orange
  primaryDark: '#D35400', // Darker orange
  accent: '#8E44AD', // Purple
  accentLight: '#9B59B6', // Light purple
  background: {
    light: '#FFF',
    dark: '#2D283E' // Dark purple for dark mode
  },
  text: {
    light: '#4A4A4A',
    dark: '#F5F5F5'
  }
};

interface GoalFormProps {
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  selectedGoal: Goal | null;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal, onUpdateGoal, selectedGoal }) => {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    type: 'quantitative',
    category: '',
    timeframe: 'daily',
    startDate: '',
    endDate: '',
    target: 0,
    metric: { id: '', name: '', type: 'number' },
    reminderFrequency: 'never',
    reminderTime: '',
  });

  useEffect(() => {
    if (selectedGoal) {
      setGoal(selectedGoal);
    }
  }, [selectedGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal) {
      onUpdateGoal(goal as Goal);
    } else {
      onAddGoal({
        ...goal,
        id: Date.now().toString(),
        currentProgress: 0,
        status: 'not-started',
        progressHistory: [],
      } as Goal);
    }
    setStep(1);
    setGoal({
      title: '',
      description: '',
      type: 'quantitative',
      category: 'Personal',
      timeframe: 'daily',
      startDate: '',
      endDate: '',
      target: 0,
      metric: { id: '', name: '', type: 'number' },
      reminderFrequency: 'never',
      reminderTime: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGoal(prevGoal => ({ ...prevGoal, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg ${
        settings.darkMode 
          ? `bg-[${colors.background.dark}] text-[${colors.text.dark}]`
          : `bg-[${colors.background.light}] text-[${colors.text.light}]`
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className={`text-2xl font-bold text-[${colors.primary}]`}>
              {selectedGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Goal Title"
                value={goal.title}
                onChange={handleInputChange}
                required
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />

              <textarea
                name="description"
                placeholder="Description"
                value={goal.description}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />

              <select
                name="type"
                value={goal.type}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <option value="quantitative">Quantitative</option>
                <option value="qualitative">Qualitative</option>
                <option value="recurring">Recurring</option>
                <option value="hybrid">Hybrid</option>
                <option value="milestone">Milestone</option>
              </select>

              <select
                name="category"
                value={goal.category}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {DEFAULT_CATEGORIES.map((category) => (
                    <option value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
              type="button"
              className={`w-full p-3 rounded-lg bg-[${colors.primary}] text-white font-medium hover:bg-[${colors.primaryDark}]`}
            >
              Next
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className={`text-2xl font-bold text-[${colors.primary}]`}>Schedule & Metrics</h2>
            
            <div className="space-y-4">
              <select
                name="timeframe"
                value={goal.timeframe}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={goal.startDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                    settings.darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                />

                <input
                  type="date"
                  name="endDate"
                  value={goal.endDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                    settings.darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <input
                type="number"
                name="target"
                placeholder="Target Value"
                value={goal.target}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />

              <div className="space-y-2">
                <select
                  name="reminderFrequency"
                  value={goal.reminderFrequency}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-[${colors.primary}] ${
                    settings.darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="never">No Reminders</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>

                {goal.reminderFrequency !== 'never' && (
                  <ClockSelector
                    value={goal.reminderTime || ''}
                    onChange={(time) => setGoal({ ...goal, reminderTime: time })}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(1)}
                type="button"
                className={`flex-1 p-3 rounded-lg border-2 font-medium ${
                  settings.darkMode 
                    ? 'border-gray-600 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                Back
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`flex-1 p-3 rounded-lg bg-[${colors.primary}] text-white font-medium hover:bg-[${colors.primaryDark}]`}
              >
                {selectedGoal ? 'Update Goal' : 'Create Goal'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};