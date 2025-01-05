import { Goal } from "../types";

export class AnalyticsService {
  static calculateCategoryProgress(goals: Goal[], category: string): number {
    const categoryGoals = goals.filter(goal => goal.category === category);
    if (!categoryGoals.length) return 0;
    
    const totalProgress = categoryGoals.reduce((sum, goal) => {
      return sum + this.getGoalProgress(goal);
    }, 0);
    
    return Math.round(totalProgress / categoryGoals.length);
  }

  static getStreakCount(goals: Goal[]): number {
    const today = new Date();
    let streak = 0;
    const dailyGoals = goals.filter(goal => goal.timeframe === 'daily' || (goal.recurrence && goal.recurrence.frequency === 'daily'));
    
    if (!dailyGoals.length) return 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const allGoalsUpdated = dailyGoals.every(goal => {
        if (goal.type === 'recurring' || goal.type === 'hybrid') {
          return goal.progressHistory.some(progress => 
            progress.date.split('T')[0] === dateStr && 
            progress.value >= (goal.recurrence?.target || goal.target)
          );
        } else {
          return goal.progressHistory.some(progress => 
            progress.date.split('T')[0] === dateStr && 
            progress.value >= goal.target
          );
        }
      });
      
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
    if (goal.type === 'qualitative') {
      return goal.status === 'completed' ? 100 : 0;
    }
    
    if (goal.type === 'recurring' || goal.type === 'hybrid') {
      const completionRate = goal.recurrence ? (goal.recurrence.completed / goal.recurrence.target) : (goal.currentProgress / goal.target);
      return Math.min(100, Math.round(completionRate * 100));
    }
    
    return Math.min(100, Math.round((goal.currentProgress / goal.target) * 100));
  }

  static getMilestoneProgress(goal: Goal): number {
    if (!goal.milestones || goal.milestones.length === 0) return 0;
    const completedMilestones = goal.milestones.filter(milestone => milestone.completed).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  }

  static getCompletionRate(goals: Goal[], timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): number {
    const relevantGoals = goals.filter(goal => goal.timeframe === timeframe);
    if (relevantGoals.length === 0) return 0;
    
    const completedGoals = relevantGoals.filter(goal => goal.status === 'completed').length;
    return Math.round((completedGoals / relevantGoals.length) * 100);
  }
}

