import { defaultSettings, Settings } from "../context/settings";
import { Goal, Progress, User, Category, Event, DEFAULT_CATEGORIES, Metric, DEFAULT_METRICS, TodoList, TodoItem } from "../types";

export class LocalStorageManager {
  private static readonly STORAGE_KEYS = {
    GOALS: 'habitHub_goals',
    USER: 'habitHub_user',
    CATEGORIES: 'habitHub_categories',
    EVENTS: 'habitHub_events',
    METRICS: 'habitHub_metrics',
    TODOS: 'habitHub_todos',
    SETTINGS: 'habitHub_settings',
  };

  // Goal Management
  static saveGoals(goals: Goal[]): void {
    localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static getGoals(): Goal[] {
    const goals = localStorage.getItem(this.STORAGE_KEYS.GOALS);
    return goals ? JSON.parse(goals) : [];
  }

  static updateGoalProgress(goalId: string, progress: Progress): Goal[] {
    const goals = this.getGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex !== -1) {
      goals[goalIndex].progressHistory.push(progress);
      goals[goalIndex].currentProgress = progress.value;
      
      // Update status based on progress
      const progressPercentage = (progress.value / goals[goalIndex].target) * 100;
      if (progressPercentage >= 100) {
        goals[goalIndex].status = 'completed';
      } else if (progressPercentage > 0) {
        goals[goalIndex].status = 'in-progress';
      }
      
      this.saveGoals(goals);
    }
    
    return goals;
  }

  //Event management
  static saveEvents(events: Event[]): void {
    localStorage.setItem(this.STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  static getEvents(): Event[] {
    const events = localStorage.getItem(this.STORAGE_KEYS.EVENTS);
    return events ? JSON.parse(events) : [];
  }

  static addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.saveEvents(events);
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents();
    const updatedEvents = events.filter(event => event.id !== eventId);
    this.saveEvents(updatedEvents);
  }

  //to do list
  static saveTodoLists(todos: TodoList[]): void {
    localStorage.setItem(this.STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }
  
  static getTodoLists(): TodoList[] {
    const todos = localStorage.getItem(this.STORAGE_KEYS.TODOS);
    return todos ? JSON.parse(todos) : [];
  }
  
  static addTodoItem(listId: string, item: TodoItem): void {
    const lists = this.getTodoLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex !== -1) {
      lists[listIndex].items.push(item);
      this.saveTodoLists(lists);
    }
  }
  
  static updateTodoItem(listId: string, itemId: string, updates: Partial<TodoItem>): void {
    const lists = this.getTodoLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex !== -1) {
      const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        lists[listIndex].items[itemIndex] = {
          ...lists[listIndex].items[itemIndex],
          ...updates,
        };
        this.saveTodoLists(lists);
      }
    }
  }

  // User Management
  static saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const user = localStorage.getItem(this.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  // Category Management
  static saveCategories(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static getCategories(): Category[] {
    const categories = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : DEFAULT_CATEGORIES;
  }

  // Metric Management
  static saveMetrics(metrics: Metric[]): void {
    localStorage.setItem(this.STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  }

  static getMetrics(): Metric[] {
    const metrics = localStorage.getItem(this.STORAGE_KEYS.METRICS);
    return metrics ? JSON.parse(metrics) : DEFAULT_METRICS;
  }

  // Settings Management
  static saveSettings(settings: Settings): void {
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getSettings(): Settings {
    const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : defaultSettings;
  }

  // Utility Functions
  static clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  static exportData(): string {
    const data = {
      goals: this.getGoals(),
      user: this.getUser(),
      categories: this.getCategories(),
      events: this.getEvents(),
      metrics: this.getMetrics(),
      todos: this.getTodoLists(),
    };
    return JSON.stringify(data);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.goals) this.saveGoals(data.goals);
      if (data.user) this.saveUser(data.user);
      if (data.categories) this.saveCategories(data.categories);
      if (data.metrics) this.saveMetrics(data.metrics);
      if (data.todos) this.saveTodoLists(data.todos);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }
}