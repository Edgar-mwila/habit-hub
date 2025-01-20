import React from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useFinance } from './FinanceProvider';

const RecentTransactions = () => {
  const { transactions } = useFinance();

  // Sort transactions by date (most recent first) and take the last 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <ul className="space-y-4">
        {recentTransactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center">
              {transaction.type === 'expense' ? (
                <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              <span>{transaction.description}</span>
            </div>
            <div className="text-right">
              <p className={transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                ${transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;

