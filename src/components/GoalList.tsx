import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Goal } from '../types'
import { useSettings } from '../context/settings'

interface GoalListProps {
  goals: Goal[]
  onSelectGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

export const GoalList: React.FC<GoalListProps> = ({ goals, onSelectGoal, onDeleteGoal }) => {
  const { settings } = useSettings()

  return (
    <div className={`w-full max-w-md mx-auto ${
      settings.darkMode ? 'text-white' : 'text-gray-800'
    }`}>
      <h2 className="text-2xl font-bold mb-4 text-primary">Your Goals</h2>
      <AnimatePresence>
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 p-4 rounded-xl ${
              settings.darkMode 
                ? 'bg-gray-800 shadow-lg' 
                : 'bg-white shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{goal.title}</h3>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectGoal(goal)}
                  className="p-2 rounded-lg bg-primary/10 text-primary"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500"
                >
                  Delete
                </motion.button>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="text-sm opacity-70">{goal.description}</div>
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.currentProgress / goal.target) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="mt-1 text-sm opacity-70">
                  {goal.currentProgress} / {goal.target} {goal.metric.unit}
                </div>
              </div>
              {goal.reminderTime && (
                <div className="mt-2 text-sm">
                  <span className="opacity-70">Reminder: </span>
                  {goal.reminderTime}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}