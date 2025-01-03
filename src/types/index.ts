export interface Metric {
    id: string;
    name: string;
    type: 'number' | 'percentage' | 'currency' | 'distance' | 'time' | 'pages' | 'custom';
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
    progress(progress: any): unknown | undefined;
    dueDate: string | number | Date;
    type: string;
    id: string;
    title: string;
    description?: string;
    category: string;
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    target: number;
    currentProgress: number;
    metric: Metric;
    // status: 'not-started' | 'in-progress' | 'completed' | 'at-risk';
    status: string;
    subGoals?: Goal[];
    progressHistory: Progress[];
    reminderFrequency?: 'daily' | 'weekly' | 'never';
    tags?: string[];
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
    { id: '3', name: 'Health', color: '#EF4444', icon: 'heart' },
    { id: '4', name: 'Personal', color: '#F59E0B', icon: 'user' }
  ];
  
  export const DEFAULT_METRICS: Metric[] = [
    { id: '1', name: 'Percentage', type: 'percentage' },
    { id: '2', name: 'Currency', type: 'currency', format: 'USD' },
    { id: '3', name: 'Count', type: 'number' },
    { id: '4', name: 'Distance', type: 'distance', unit: 'km' },
    { id: '5', name: 'Time', type: 'time', unit: 'minutes' },
    { id: '6', name: 'Pages', type: 'pages' }
  ];