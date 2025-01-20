import React, { createContext, useContext, useState, useEffect } from 'react'
import { Bill, Budget, FinanceStorageManager, SavingsGoal, Settings, Transaction, Notification } from '../../../services/FinanaceStorageManager'

type FinanceContextType = {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  budgets: Budget[]
  updateBudget: (budget: Budget) => void
  savingsGoals: SavingsGoal[]
  updateSavingsGoal: (goal: SavingsGoal) => void
  bills: Bill[]
  updateBill: (bill: Bill) => void
  notifications: Notification[]
  markNotificationAsRead: (id: string) => void
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<Settings>(FinanceStorageManager.getSettings())

  useEffect(() => {
    setTransactions(FinanceStorageManager.getTransactions())
    setBudgets(FinanceStorageManager.getBudgets())
    setSavingsGoals(FinanceStorageManager.getSavingsGoals())
    setBills(FinanceStorageManager.getBills())
    setNotifications(FinanceStorageManager.getNotifications())
  }, [])

  const addTransaction = (transaction: Transaction) => {
    FinanceStorageManager.addTransaction(transaction)
    setTransactions(FinanceStorageManager.getTransactions())
    setBudgets(FinanceStorageManager.getBudgets()) // Update budgets as they might have changed
  }

  const updateBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map(b => b.id === budget.id ? budget : b)
    FinanceStorageManager.saveBudgets(updatedBudgets)
    setBudgets(updatedBudgets)
  }

  const updateSavingsGoal = (goal: SavingsGoal) => {
    const updatedGoals = savingsGoals.map(g => g.id === goal.id ? goal : g)
    FinanceStorageManager.saveSavingsGoals(updatedGoals)
    setSavingsGoals(updatedGoals)
  }

  const updateBill = (bill: Bill) => {
    const updatedBills = bills.map(b => b.id === bill.id ? bill : b)
    FinanceStorageManager.saveBills(updatedBills)
    setBills(updatedBills)
  }

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    )
    FinanceStorageManager.saveNotifications(updatedNotifications)
    setNotifications(updatedNotifications)
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    FinanceStorageManager.saveSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      budgets,
      updateBudget,
      savingsGoals,
      updateSavingsGoal,
      bills,
      updateBill,
      notifications,
      markNotificationAsRead,
      settings,
      updateSettings
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

