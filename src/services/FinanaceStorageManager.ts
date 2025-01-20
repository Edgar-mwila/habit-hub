// types.ts
export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
    accountId: string;
    receiptImage?: string;
    isRecurring: boolean;
    recurringDetails?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      endDate?: string;
    };
  }
  
  export interface Budget {
    id: string;
    categoryId: string;
    amount: number;
    spent: number;
    period: 'monthly' | 'weekly';
    startDate: string;
    endDate: string;
  }
  
  export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
    color: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: 'income' | 'expense';
  }
  
  export interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    category: string;
    recurringDetails?: {
      frequency: 'monthly' | 'weekly';
      endDate?: string;
    };
  }
  
  export interface Account {
    id: string;
    name: string;
    type: 'savings' | 'checking' | 'credit';
    balance: number;
    color: string;
  }
  
  export interface Notification {
    id: string;
    type: 'bill' | 'budget' | 'goal';
    message: string;
    date: string;
    isRead: boolean;
    relatedId: string;
  }
  
  export interface Settings {
    theme: 'light' | 'dark';
    currency: string;
    notifications: {
      billReminders: boolean;
      budgetAlerts: boolean;
      goalAchievements: boolean;
    };
  }
  
  // Default values
  export const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Salary', color: '#4CAF50', icon: 'wallet', type: 'income' },
    { id: '2', name: 'Food', color: '#FF9800', icon: 'shopping-bag', type: 'expense' },
    { id: '3', name: 'Transport', color: '#2196F3', icon: 'car', type: 'expense' },
    { id: '4', name: 'Entertainment', color: '#9C27B0', icon: 'film', type: 'expense' },
    { id: '5', name: 'Bills', color: '#F44336', icon: 'file-text', type: 'expense' }
  ];
  
  export const defaultSettings: Settings = {
    theme: 'light',
    currency: 'USD',
    notifications: {
      billReminders: true,
      budgetAlerts: true,
      goalAchievements: true
    }
  };
  
  // FinanceStorageManager.ts
  export class FinanceStorageManager {
    private static readonly STORAGE_KEYS = {
      TRANSACTIONS: 'financeApp_transactions',
      BUDGETS: 'financeApp_budgets',
      SAVINGS_GOALS: 'financeApp_savings',
      CATEGORIES: 'financeApp_categories',
      BILLS: 'financeApp_bills',
      ACCOUNTS: 'financeApp_accounts',
      NOTIFICATIONS: 'financeApp_notifications',
      SETTINGS: 'financeApp_settings'
    };
  
    // Transaction Methods
    static saveTransactions(transactions: Transaction[]): void {
      localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  
    static getTransactions(): Transaction[] {
      const transactions = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
      return transactions ? JSON.parse(transactions) : [];
    }
  
    static addTransaction(transaction: Transaction): void {
      const transactions = this.getTransactions();
      transactions.push(transaction);
      this.saveTransactions(transactions);
      this.updateAccountBalance(transaction);
      if (transaction.type === 'expense') {
        this.updateBudgetSpending(transaction);
      }
    }
  
    static deleteTransaction(transactionId: string): void {
      const transactions = this.getTransactions();
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        // Reverse the account balance update
        this.updateAccountBalance({
          ...transaction,
          amount: -transaction.amount
        });
        // Remove the transaction
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        this.saveTransactions(updatedTransactions);
      }
    }
  
    static updateTransaction(transactionId: string, updates: Partial<Transaction>): void {
      const transactions = this.getTransactions();
      const index = transactions.findIndex(t => t.id === transactionId);
      if (index !== -1) {
        // If amount changed, update account balance
        if (updates.amount && updates.amount !== transactions[index].amount) {
          const difference = updates.amount - transactions[index].amount;
          this.updateAccountBalance({
            ...transactions[index],
            amount: difference
          });
        }
        transactions[index] = { ...transactions[index], ...updates };
        this.saveTransactions(transactions);
      }
    }
  
    // Budget Methods
    static saveBudgets(budgets: Budget[]): void {
      localStorage.setItem(this.STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    }
  
    static getBudgets(): Budget[] {
      const budgets = localStorage.getItem(this.STORAGE_KEYS.BUDGETS);
      return budgets ? JSON.parse(budgets) : [];
    }
  
    static addBudget(budget: Budget): void {
      const budgets = this.getBudgets();
      budgets.push(budget);
      this.saveBudgets(budgets);
    }
  
    static updateBudget(budgetId: string, updates: Partial<Budget>): void {
      const budgets = this.getBudgets();
      const index = budgets.findIndex(b => b.id === budgetId);
      if (index !== -1) {
        budgets[index] = { ...budgets[index], ...updates };
        this.saveBudgets(budgets);
      }
    }
  
    static deleteBudget(budgetId: string): void {
      const budgets = this.getBudgets();
      const updatedBudgets = budgets.filter(b => b.id !== budgetId);
      this.saveBudgets(updatedBudgets);
    }
  
    private static updateBudgetSpending(transaction: Transaction): void {
      if (transaction.type === 'expense') {
        const budgets = this.getBudgets();
        const relevantBudget = budgets.find(b => b.categoryId === transaction.category);
        if (relevantBudget) {
          relevantBudget.spent += transaction.amount;
          this.saveBudgets(budgets);
          this.checkBudgetAlerts(relevantBudget);
        }
      }
    }
  
    // Savings Goals Methods
    static saveSavingsGoals(goals: SavingsGoal[]): void {
      localStorage.setItem(this.STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    }
  
    static getSavingsGoals(): SavingsGoal[] {
      const goals = localStorage.getItem(this.STORAGE_KEYS.SAVINGS_GOALS);
      return goals ? JSON.parse(goals) : [];
    }
  
    static addSavingsGoal(goal: SavingsGoal): void {
      const goals = this.getSavingsGoals();
      goals.push(goal);
      this.saveSavingsGoals(goals);
    }
  
    static updateSavingsGoal(goalId: string, updates: Partial<SavingsGoal>): void {
      const goals = this.getSavingsGoals();
      const index = goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        this.saveSavingsGoals(goals);
        this.checkGoalAchievement(goals[index]);
      }
    }
  
    static deleteSavingsGoal(goalId: string): void {
      const goals = this.getSavingsGoals();
      const updatedGoals = goals.filter(g => g.id !== goalId);
      this.saveSavingsGoals(updatedGoals);
    }
  
    // Account Methods
    static saveAccounts(accounts: Account[]): void {
      localStorage.setItem(this.STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
  
    static getAccounts(): Account[] {
      const accounts = localStorage.getItem(this.STORAGE_KEYS.ACCOUNTS);
      return accounts ? JSON.parse(accounts) : [];
    }
  
    static addAccount(account: Account): void {
      const accounts = this.getAccounts();
      accounts.push(account);
      this.saveAccounts(accounts);
    }
  
    static updateAccount(accountId: string, updates: Partial<Account>): void {
      const accounts = this.getAccounts();
      const index = accounts.findIndex(a => a.id === accountId);
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updates };
        this.saveAccounts(accounts);
      }
    }
  
    static deleteAccount(accountId: string): void {
      const accounts = this.getAccounts();
      const updatedAccounts = accounts.filter(a => a.id !== accountId);
      this.saveAccounts(updatedAccounts);
    }
  
    private static updateAccountBalance(transaction: Transaction): void {
      const accounts = this.getAccounts();
      const accountIndex = accounts.findIndex(a => a.id === transaction.accountId);
      if (accountIndex !== -1) {
        accounts[accountIndex].balance += transaction.type === 'income' ? 
          transaction.amount : -transaction.amount;
        this.saveAccounts(accounts);
      }
    }
  
    // Bill Methods
    static saveBills(bills: Bill[]): void {
      localStorage.setItem(this.STORAGE_KEYS.BILLS, JSON.stringify(bills));
    }
  
    static getBills(): Bill[] {
      const bills = localStorage.getItem(this.STORAGE_KEYS.BILLS);
      return bills ? JSON.parse(bills) : [];
    }
  
    static addBill(bill: Bill): void {
      const bills = this.getBills();
      bills.push(bill);
      this.saveBills(bills);
      this.scheduleBillReminder(bill);
    }
  
    static updateBill(billId: string, updates: Partial<Bill>): void {
      const bills = this.getBills();
      const index = bills.findIndex(b => b.id === billId);
      if (index !== -1) {
        bills[index] = { ...bills[index], ...updates };
        this.saveBills(bills);
        this.scheduleBillReminder(bills[index]);
      }
    }
  
    static deleteBill(billId: string): void {
      const bills = this.getBills();
      const updatedBills = bills.filter(b => b.id !== billId);
      this.saveBills(updatedBills);
    }
  
    // Notification Methods
    static saveNotifications(notifications: Notification[]): void {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  
    static getNotifications(): Notification[] {
      const notifications = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      return notifications ? JSON.parse(notifications) : [];
    }
  
    static addNotification(notification: Notification): void {
      const notifications = this.getNotifications();
      notifications.push(notification);
      this.saveNotifications(notifications);
    }
  
    static markNotificationAsRead(notificationId: string): void {
      const notifications = this.getNotifications();
      const index = notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        notifications[index].isRead = true;
        this.saveNotifications(notifications);
      }
    }
  
    static deleteNotification(notificationId: string): void {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      this.saveNotifications(updatedNotifications);
    }
  
    // Settings Methods
    static saveSettings(settings: Settings): void {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  
    static getSettings(): Settings {
      const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : defaultSettings;
    }
  
    static updateSettings(updates: Partial<Settings>): void {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...updates };
      this.saveSettings(newSettings);
    }
  
    // Utility Methods
    private static checkBudgetAlerts(budget: Budget): void {
      const settings = this.getSettings();
      if (settings.notifications.budgetAlerts) {
        const spentPercentage = (budget.spent / budget.amount) * 100;
        if (spentPercentage >= 80) {
          this.addNotification({
            id: crypto.randomUUID(),
            type: 'budget',
            message: `You've spent ${spentPercentage.toFixed(1)}% of your ${budget.categoryId} budget`,
            date: new Date().toISOString(),
            isRead: false,
            relatedId: budget.id
          });
        }
      }
    }
  
    private static checkGoalAchievement(goal: SavingsGoal): void {
      const settings = this.getSettings();
      if (settings.notifications.goalAchievements && goal.currentAmount >= goal.targetAmount) {
        this.addNotification({
          id: crypto.randomUUID(),
          type: 'goal',
          message: `Congratulations! You've achieved your ${goal.name} savings goal!`,
          date: new Date().toISOString(),
          isRead: false,
          relatedId: goal.id
        });
      }
    }
  
    private static scheduleBillReminder(bill: Bill): void {
      const settings = this.getSettings();
      if (settings.notifications.billReminders) {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
        if (daysDiff <= 3 && daysDiff > 0) {
          this.addNotification({
            id: crypto.randomUUID(),
            type: 'bill',
            message: `${bill.name} bill due in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`,
            date: new Date().toISOString(),
            isRead: false,
            relatedId: bill.id
          });
        }
      }
    }
  
    static exportData(): string {
      const data = {
        transactions: this.getTransactions(),
        budgets: this.getBudgets(),
        savingsGoals: this.getSavingsGoals(),
        bills: this.getBills(),
        accounts: this.getAccounts(),
        notifications: this.getNotifications(),
        settings: this.getSettings(),
        categories: this.getCategories()
    };
    return JSON.stringify(data);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.budgets) this.saveBudgets(data.budgets);
      if (data.savingsGoals) this.saveSavingsGoals(data.savingsGoals);
      if (data.bills) this.saveBills(data.bills);
      if (data.accounts) this.saveAccounts(data.accounts);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.settings) this.saveSettings(data.settings);
      if (data.categories) this.saveCategories(data.categories);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }

  // Category Methods
  static saveCategories(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static getCategories(): Category[] {
    const categories = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : DEFAULT_CATEGORIES;
  }

  static addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  static updateCategory(categoryId: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
    }
  }

  static deleteCategory(categoryId: string): void {
    const categories = this.getCategories();
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    this.saveCategories(updatedCategories);
  }

  // Data Management Methods
  static clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  static clearTransactionHistory(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TRANSACTIONS);
  }

  static resetToDefaults(): void {
    this.clearAllData();
    this.saveSettings(defaultSettings);
    this.saveCategories(DEFAULT_CATEGORIES);
  }

  // Analytics Methods
  static getMonthlySpending(month: number, year: number): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && 
               date.getFullYear() === year && 
               t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static getMonthlyIncome(month: number, year: number): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && 
               date.getFullYear() === year && 
               t.type === 'income';
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static getCategorySpending(categoryId: string, startDate: string, endDate: string): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => 
        t.category === categoryId &&
        t.type === 'expense' &&
        t.date >= startDate &&
        t.date <= endDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static getBudgetOverview(): {
    categoryId: string;
    allocated: number;
    spent: number;
    remaining: number;
  }[] {
    const budgets = this.getBudgets();
    return budgets.map(budget => ({
      categoryId: budget.categoryId,
      allocated: budget.amount,
      spent: budget.spent,
      remaining: budget.amount - budget.spent
    }));
  }

  static getUpcomingBills(days: number = 7): Bill[] {
    const bills = this.getBills();
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && dueDate >= today && dueDate <= futureDate;
    });
  }

  static getTotalBalance(): number {
    const accounts = this.getAccounts();
    return accounts.reduce((total, account) => total + account.balance, 0);
  }

  // Validation Methods
  private static validateTransaction(transaction: Transaction): boolean {
    return (
      transaction.amount > 0 &&
      ['income', 'expense'].includes(transaction.type) &&
      Boolean(transaction.accountId) &&
      Boolean(transaction.category)
    );
  }

  private static validateBudget(budget: Budget): boolean {
    return (
      budget.amount > 0 &&
      Boolean(budget.categoryId) &&
      Boolean(budget.startDate) &&
      Boolean(budget.endDate)
    );
  }

  private static validateAccount(account: Account): boolean {
    return (
      Boolean(account.name) &&
      ['savings', 'checking', 'credit'].includes(account.type)
    );
  }

  // Error Handling Methods
  private static handleStorageError(operation: string, error: Error): void {
    console.error(`Storage operation failed: ${operation}`, error);
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
}