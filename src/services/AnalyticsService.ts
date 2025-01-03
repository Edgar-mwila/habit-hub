import { Goal } from "../types";

export class AnalyticsService {
    static calculateCategoryProgress(goals: Goal[], category: string): number {
      const categoryGoals = goals.filter(goal => goal.category === category);
      if (!categoryGoals.length) return 0;
      
      const totalProgress = categoryGoals.reduce((sum, goal) => {
        return sum + (goal.currentProgress / goal.target);
      }, 0);
      
      return Math.round((totalProgress / categoryGoals.length) * 100);
    }
  
    static getStreakCount(goals: Goal[]): number {
      const today = new Date();
      let streak = 0;
      const dailyGoals = goals.filter(goal => goal.timeframe === 'daily');
      
      if (!dailyGoals.length) return 0;
  
      // Check last 30 days for continuous progress
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        const allGoalsUpdated = dailyGoals.every(goal => 
          goal.progressHistory.some(progress => 
            progress.date.split('T')[0] === dateStr && 
            progress.value >= goal.target
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
      return Math.min(100, Math.round((goal.currentProgress / goal.target) * 100));
    }
  }