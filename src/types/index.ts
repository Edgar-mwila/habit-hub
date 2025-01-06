export interface Metric {
    id: string;
    name: string;
    type: 'number' | 'percentage' | 'currency' | 'distance' | 'time' | 'pages' | 'custom';
    unit?: string;
    format?: string; // For currency formatting or custom display formats
  }
  
export interface Event {
    id: string;
    title: string;
    date: string;
    type: 'event' | 'appointment';
    time?: string;
    description?: string;
  }

export interface Review {
    id: string;
    goalId: string;
    date: string;
    value: number; //As percentage showing how much closer we are to the goal
    notes: string;
  }
  
export interface Goal {
    dueDate: string;
    id: string;
    title: string;
    description?: string;
    category: 'Career' | 'Finanace' | 'Education' | 'Health' | 'Personal';
    status: string;
    currentProgress: number; //As percentage updated each time a review occurs.
    subGoals?: Goal[];
    reviewHistory: Review[];
    reviewFrequency?: 'daily' | 'weekly' | 'never';
  }
  
export interface Category {
    id: string;
    name: string;
    color: string;
    icon?: string;
  }
  
  // Default Categories and Metrics
  export const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Career', color: '#4F46E5', icon: 'briefcase' },
    { id: '2', name: 'Finance', color: '#10B981', icon: 'dollar-sign' },
    { id: '3', name: 'Health', color: '#EF4444', icon: 'heart' },
    { id: '4', name: 'Personal', color: '#F59E0B', icon: 'user' },
    { id: '5', name: 'Education', color: '#4CAF50', icon: 'book'}
  ];
  
  export const DEFAULT_METRICS: Metric[] = [
    { id: '1', name: 'Percentage', type: 'percentage' },
    { id: '2', name: 'Currency', type: 'currency', format: 'USD' },
    { id: '3', name: 'Count', type: 'number' },
    { id: '4', name: 'Distance', type: 'distance', unit: 'km' },
    { id: '5', name: 'Time', type: 'time', unit: 'minutes' },
    { id: '6', name: 'Pages', type: 'pages' }
  ];

  export interface TodoItem {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    dueTime?: string;
    reminderTime?: string;
    status: 'pending' | 'completed' | 'failed';
    isRecurring?: boolean;
    recurrencePattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days?: number[];  // for weekly, which days (0-6)
      date?: number;    // for monthly, which date (1-31)
    };
    createdAt: string;
    completedAt?: string;
    notificationTime?: string;
  }
  
  export interface TodoList {
    id: string;
    date: string;
    items: TodoItem[];
    morningNotificationTime: string;
    eveningNotificationTime: string;
  }