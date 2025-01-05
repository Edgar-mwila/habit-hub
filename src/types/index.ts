export interface Metric {
    id: string;
    name: string;
    type: 'number' | 'percentage' | 'currency' | 'distance' | 'time' | 'pages' | 'custom' | 'checked';
    unit?: string;
    format?: string; // For currency formatting or custom display formats
  }
  
export interface Progress {
    id: string;
    goalId: string;
    date: string;
    value: number;
    notes?: string;
  }

export interface Event {
    id: string;
    title: string;
    date: string;
    type: 'goal' | 'task' | 'appointment';
    time?: string;
    description?: string;
  }
  
  export interface Goal {
    id: string;
    title: string;
    description?: string;
    type: 'quantitative' | 'qualitative' | 'recurring' | 'hybrid' | 'milestone';
    category: string;
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    target: number;
    currentProgress: number;
    metric: Metric;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'at-risk';
    subGoals?: Goal[];
    progressHistory: Progress[];
    reminderFrequency?: 'daily' | 'weekly' | 'never';
    reminderTime?: string; // New field for reminder time
    tags?: string[];
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days?: string[]; // For weekly goals
      target: number; // Target sessions
      completed: number; // Sessions completed in the current period
    };
    milestones?: {
      id: string;
      title: string;
      completed: boolean;
    }[];
    tasks?: {
      id: string;
      title: string;
      status: 'pending' | 'completed' | 'failed';
      dueDate?: string;
      reminderTime?: string;
    }[];
  }
  
export interface Event {
    id: string;
    title: string;
    date: string;
    type: 'goal' | 'task' | 'appointment';
    time?: string;
    description?: string;
  }

export interface Category {
    id: string;
    name: string;
    color: string;
    icon?: string;
  }
  
export interface User {
    id: string;
    preferences: {
      categories: Category[];
      customMetrics: Metric[];
      defaultTimeframe: Goal['timeframe'];
      theme: 'light' | 'dark';
    }
  }
  
  // Default Categories and Metrics
  export const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Career', color: '#4F46E5', icon: 'briefcase' },
    { id: '2', name: 'Finance', color: '#10B981', icon: 'dollar-sign' },
    { id: '6', name: 'Education', color: '#30C48D', icon: 'book' },
    { id: '3', name: 'Health', color: '#EF4444', icon: 'heart' },
    { id: '4', name: 'Personal', color: '#F59E0B', icon: 'user' }
  ];
  
  export const DEFAULT_METRICS: Metric[] = [
    { id: '1', name: 'Checked', type: 'checked'},
    { id: '7', name: 'Percentage', type: 'percentage' },
    { id: '2', name: 'Currency', type: 'currency', format: 'ZMW' },
    { id: '3', name: 'Count', type: 'number' },
    { id: '4', name: 'Distance', type: 'distance', unit: 'km' },
    { id: '5', name: 'Time', type: 'time', unit: 'minutes' },
    { id: '6', name: 'Pages', type: 'pages' },
  ];