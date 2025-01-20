import React from 'react';
import { useFinance } from '../components/FinanceProvider';

const SavingsGoalsPage = () => {
  const { savingsGoals } = useFinance();

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Savings Goals</h1>
      <div className="space-y-4">
        {savingsGoals.map((goal) => (
          <div key={goal.id} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
            <div className="h-2" style={{ backgroundColor: goal.color }} />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{goal.name}</h2>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  ></div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span>Current: ${goal.currentAmount.toFixed(2)}</span>
                <span>Target: ${goal.targetAmount.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsGoalsPage;

