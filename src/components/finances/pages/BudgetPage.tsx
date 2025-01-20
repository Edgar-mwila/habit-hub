import React from 'react';
import { useFinance } from '../components/FinanceProvider';

const BudgetPage = () => {
  const { budgets } = useFinance();

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>
      <div className="space-y-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{budget.categoryId}</h2>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                <div 
                  style={{ width: `${(budget.spent / budget.amount) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span>Spent: ${budget.spent.toFixed(2)}</span>
              <span>Budget: ${budget.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;

