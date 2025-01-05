import { Goal, Progress, User, Category, Event, DEFAULT_CATEGORIES, Metric, DEFAULT_METRICS } from "../types";

export class LocalStorageManager {
  private static readonly STORAGE_KEYS = {
    GOALS: 'habitHub_goals',
    USER: 'habitHub_user',
    CATEGORIES: 'habitHub_categories',
    EVENTS: 'habitHub_events',
    METRICS: 'habitHub_metrics'
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
      const goal = goals[goalIndex];
      goal.progressHistory.push(progress);
      goal.currentProgress = progress.value;
      
      // Update status based on progress
      const progressPercentage = (progress.value / goal.target) * 100;
      if (progressPercentage >= 100) {
        goal.status = 'completed';
      } else if (progressPercentage > 0) {
        goal.status = 'in-progress';
      }
      
      // Update recurrence for recurring goals
      if (goal.recurrence) {
        goal.recurrence.completed += 1;
        if (goal.recurrence.completed >= goal.recurrence.target) {
          goal.recurrence.completed = 0; // Reset for next period
        }
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
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }
}