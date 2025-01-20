import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "./components/ThemeProvider";
import { FinanceProvider } from './components/FinanceProvider';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BudgetPage from './pages/BudgetPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import BillsPage from './pages/BillsPage';

export function Finance() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <FinanceProvider>
          <div className="bg-purple-200 dark:bg-gray-800 text-gray-800 dark:text-purple-200 min-h-screen pb-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/budgets" element={<BudgetPage />} />
              <Route path="/savings" element={<SavingsGoalsPage />} />
              <Route path="/bills" element={<BillsPage />} />
            </Routes>
            <Navigation />
          </div>
        </FinanceProvider>
      </ThemeProvider>
    </Router>
  );
}