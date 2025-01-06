import { Goal, TodoList, TodoItem } from "../types";

export class AnalyticsService {
  static calculateCategoryProgress(goals: Goal[], category: string): number {
    const categoryGoals = goals.filter(goal => goal.category === category);
    if (!categoryGoals.length) return 0;
    const totalProgress = categoryGoals.reduce((sum, goal) => {
      return sum + goal.currentProgress/100;
    }, 0);
    const progress = (totalProgress / categoryGoals.length) * 100;
    return isNaN(progress) ? 0 : Math.round(progress);
  }

  static getTodoCompletionRate(todoLists: TodoList[]): number {
    const allItems = todoLists.flatMap(list => list.items);
    if (allItems.length === 0) return 0;
    
    const completedItems = allItems.filter(item => item.status === 'completed');
    const rate = (completedItems.length / allItems.length) * 100;
    return isNaN(rate) ? 0 : Math.round(rate);
  }

  static getTodoStreak(todoLists: TodoList[]): number {
    const today = new Date();
    let streak = 0;
    
    // Check last 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Find list for this date
      const list = todoLists.find(l => l.date.split('T')[0] === dateStr);
      if (!list) break;
      
      // Check if all non-recurring items due on this date were completed
      const dueItems = list.items.filter(item => !item.isRecurring);
      if (dueItems.length === 0) break;
      
      const allCompleted = dueItems.every(item => item.status === 'completed');
      if (allCompleted) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static getGoalStreak(goals: Goal[]): number {
    const today = new Date();
    let streak = 0;
    const dailyGoals = goals.filter(goal => goal.reviewFrequency === 'daily');
    
    if (!dailyGoals.length) return 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const allGoalsUpdated = dailyGoals.every(goal =>
        goal.reviewHistory.some(review =>
          review.date.split('T')[0] === dateStr &&
          review.value >= 0
        )
      );
      
      if (allGoalsUpdated) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static generateMotivationalMessage(progress: number): string {
    if (progress >= 100) return "Amazing job! You've reached your goal! 🎉";
    if (progress >= 75) return "You're almost there! Keep pushing! 💪";
    if (progress >= 50) return "Halfway there! You're making great progress! 🌟";
    if (progress >= 25) return "Great start! Keep up the momentum! 🚀";
    return "Every step counts! Let's get started! 🌱";
  }

  static getGoalProgress(goal: Goal): number {
    const progress = goal.currentProgress;
    return isNaN(progress) ? 0 : Math.min(100, Math.round(progress));
  }
}