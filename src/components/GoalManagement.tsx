import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalStorageManager } from '../services/LocalStorageManager';
import { Goal } from '../types';
import { GoalList } from './GoalList';
import { GoalForm } from './GoalForm';
import { useSettings } from '../context/settings';
import { Plus, X, Target, Award } from 'lucide-react';

// Matching color scheme from other components
const colors = {
  primary: '#E67E22',
  primaryDark: '#D35400',
  accent: '#8E44AD',
  accentLight: '#9B59B6',
  background: {
    light: '#FFF',
    dark: '#2D283E'
  },
  text: {
    light: '#4A4A4A',
    dark: '#F5F5F5'
  }
};

export const GoalManagementPage: React.FC = () => {
  const { settings } = useSettings();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    const loadedGoals = LocalStorageManager.getGoals();
    setGoals(loadedGoals);
  }, []);

  const handleAddGoal = (newGoal: Goal) => {
    const updatedGoals = [...goals, newGoal];
    LocalStorageManager.saveGoals(updatedGoals);
    setGoals(updatedGoals);
    setIsFormVisible(false);
    setAnimateForm(true);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map(goal =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    LocalStorageManager.saveGoals(updatedGoals);
    setGoals(updatedGoals);
    setSelectedGoal(null);
    setIsFormVisible(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    LocalStorageManager.saveGoals(updatedGoals);
    setGoals(updatedGoals);
    setSelectedGoal(null);
  };

  const getCompletionStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(
      goal => (goal.currentProgress / goal.target) >= 1
    ).length;
    const inProgressGoals = goals.filter(
      goal => goal.currentProgress > 0 && goal.currentProgress < goal.target
    ).length;
    
    return { totalGoals, completedGoals, inProgressGoals };
  };

  const stats = getCompletionStats();

  return (
    <div className={`min-h-screen ${
      settings.darkMode 
        ? `bg-[${colors.background.dark}]` 
        : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-4xl font-bold text-[${colors.primary}] flex items-center gap-3`}
              >
                <Target className={`text-[${colors.primary}]`} size={32} />
                Goal Tracker
              </motion.h1>
              <p className={`mt-2 text-lg ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Track and manage your personal goals
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFormVisible(!isFormVisible);
                setSelectedGoal(null);
              }}
              className={`px-6 py-3 rounded-lg bg-[${colors.primary}] text-white 
                font-medium flex items-center gap-2 hover:bg-[${colors.primaryDark}] 
                transition-colors duration-200`}
            >
              {isFormVisible ? (
                <>
                  <X size={20} />
                  Close Form
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add New Goal
                </>
              )}
            </motion.button>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${
            goals.length > 0 ? 'block' : 'hidden'
          }`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl ${
                settings.darkMode
                  ? 'bg-gray-800'
                  : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-lg font-medium mb-2">Total Goals</h3>
              <p className="text-3xl font-bold text-[${colors.primary}]">{stats.totalGoals}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-xl ${
                settings.darkMode
                  ? 'bg-gray-800'
                  : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-lg font-medium mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-500">{stats.completedGoals}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl ${
                settings.darkMode
                  ? 'bg-gray-800'
                  : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="text-lg font-medium mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-[${colors.accent}]">{stats.inProgressGoals}</p>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <AnimatePresence mode="wait">
          {isFormVisible && (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <GoalForm
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                selectedGoal={selectedGoal}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals List Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GoalList
            goals={goals}
            onSelectGoal={(goal) => {
              setSelectedGoal(goal);
              setIsFormVisible(true);
            }}
            onDeleteGoal={handleDeleteGoal}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};