import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Plus, AlertCircle } from 'lucide-react';
import { Budget, Category, FinanceStorageManager } from '../../../services/FinanaceStorageManager';

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [budgetHistory, setBudgetHistory] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = () => {
    const allBudgets = FinanceStorageManager.getBudgets();
    setBudgets(allBudgets);
    setCategories(FinanceStorageManager.getCategories());
    
    // Calculate budget history by analyzing past budgets and their performance
    const transactions = FinanceStorageManager.getTransactions();
    const history = allBudgets.map(budget => {
      const spent = transactions
        .filter(t => 
          t.category === budget.categoryId &&
          t.date >= budget.startDate &&
          t.date <= budget.endDate &&
          t.type === 'expense'
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        adherenceRate: ((budget.amount - spent) / budget.amount) * 100
      };
    });
    setBudgetHistory(history);
  };

  const handleCreateBudget = () => {
    const budget = {
      ...newBudget,
      amount: parseFloat(newBudget.amount),
      id: crypto.randomUUID(),
      spent: 0
    };
    FinanceStorageManager.addBudget(budget as Budget);
    setShowNewBudgetModal(false);
    setNewBudget({
      categoryId: '',
      amount: '',
      period: 'monthly',
      startDate: '',
      endDate: ''
    });
    loadBudgetData();
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <button
          onClick={() => setShowNewBudgetModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Create New Budget
        </button>
      </div>

      {/* Active Budgets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(budget => (
          <div 
            key={budget.id}
            className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedBudget(budget)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{getCategoryName(budget.categoryId)}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                </p>
              </div>
              {budget.spent >= budget.amount * 0.8 && (
                <AlertCircle className="text-yellow-500" size={20} />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`rounded-full h-2 ${
                    budget.spent / budget.amount > 0.8 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spent: ${budget.spent.toFixed(2)}</span>
                <span className="text-gray-500">Budget: ${budget.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="amount"
                  nameKey="categoryId"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${getCategoryName(name)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {budgets.map((entry, index) => (
                    <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Adherence History */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Budget Adherence History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryId" tickFormatter={getCategoryName} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="adherenceRate" fill="#60A5FA" name="Adherence Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Budget Modal */}
      {showNewBudgetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Create New Budget</h2>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowNewBudgetModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBudget.categoryId}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, categoryId: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBudget.period}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, period: e.target.value as "weekly" | "monthly" })
                  }
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBudget.startDate}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBudget.endDate}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCreateBudget}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Budget Details Modal */}
      {selectedBudget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Budget Details</h2>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedBudget(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">Category</h4>
                  <p className="text-lg">{getCategoryName(selectedBudget.categoryId)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Period</h4>
                  <p className="text-lg capitalize">{selectedBudget.period}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Budget Amount</h4>
                  <p className="text-lg">${selectedBudget.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Spent Amount</h4>
                  <p className="text-lg">${selectedBudget.spent.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium text-gray-500 mb-2">Spending Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`rounded-full h-4 ${
                      selectedBudget.spent / selectedBudget.amount > 0.8 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min((selectedBudget.spent / selectedBudget.amount) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {((selectedBudget.spent / selectedBudget.amount) * 100).toFixed(1)}% of budget used
                </p>
              </div>

              {selectedBudget.spent >= selectedBudget.amount * 0.8 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4 flex items-center">
                  <span className="text-yellow-500 text-xl">⚠️</span>
                  <p className="text-yellow-700 ml-2">
                    You've used over 80% of this budget. Consider reviewing your spending in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;