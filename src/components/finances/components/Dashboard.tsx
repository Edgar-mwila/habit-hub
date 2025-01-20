import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import RecentTransactions from './RecentTransactions';
import AddTransactionModal from './AddTransactionModal';
import { useFinance } from './FinanceProvider';

const Dashboard = () => {
  const { transactions } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState<'income' | 'expense'>('income');

  const totalBalance = transactions.reduce((sum, transaction) => 
    transaction.type === 'income' ? sum + transaction.amount : sum - transaction.amount, 0
  );

  const openAddModal = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4">
      <div className="bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
        <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
      </div>

      <div className="flex justify-between gap-4">
        <button 
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          onClick={() => openAddModal('income')}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Income
        </button>
        <button 
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          onClick={() => openAddModal('expense')}
        >
          <MinusCircle className="mr-2 h-4 w-4" /> Expense
        </button>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Monthly Overview</h2>
        <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
          Chart Placeholder
        </div>
      </div>

      <RecentTransactions />

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        type={transactionType} 
      />
    </div>
  );
};

export default Dashboard;

