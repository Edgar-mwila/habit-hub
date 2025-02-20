import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { Bill, Budget, BudgetOverview, Category, FinanceStorageManager, Transaction } from '../../../services/FinanaceStorageManager';

const Dashboard = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expenses: number; }[]>([]);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load initial data
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Get total balance
    setTotalBalance(FinanceStorageManager.getTotalBalance());

    // Get latest transactions
    const allTransactions = FinanceStorageManager.getTransactions();
    setTransactions(allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Get categories
    setCategories(FinanceStorageManager.getCategories());

    // Get budget overview
    setBudgetOverview(FinanceStorageManager.getBudgetOverview());

    // Get upcoming bills
    setUpcomingBills(FinanceStorageManager.getUpcomingBills(7));

    // Calculate monthly data for the last 6 months
    const monthlyDataArray = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      monthlyDataArray.push({
        month: date.toLocaleString('default', { month: 'short' }),
        income: FinanceStorageManager.getMonthlyIncome(month, year),
        expenses: FinanceStorageManager.getMonthlySpending(month, year)
      });
    }
    setMonthlyData(monthlyDataArray);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
        <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Income</p>
              <p className="text-2xl font-bold">${monthlyData[5]?.income.toFixed(2) || '0.00'}</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Expenses</p>
              <p className="text-2xl font-bold">${monthlyData[5]?.expenses.toFixed(2) || '0.00'}</p>
            </div>
            <CreditCard className="text-red-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Upcoming Bills</p>
              <p className="text-2xl font-bold">{upcomingBills.length}</p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Budget Alerts</p>
              <p className="text-2xl font-bold">
                {budgetOverview.filter(b => (b.spent / b.allocated) > 0.8).length}
              </p>
            </div>
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryId" tickFormatter={getCategoryName} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="allocated" fill="#60A5FA" name="Allocated" />
                <Bar dataKey="spent" fill="#F87171" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Latest Transactions</h3>
          <button 
            onClick={() => setShowTransactionsModal(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()} - {getCategoryName(transaction.category)}
                </p>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Modal */}
      {showTransactionsModal && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[80vh] overflow-y-auto w-full p-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">All Transactions</h2>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowTransactionsModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} -{" "}
                    {getCategoryName(transaction.category)}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Dashboard;