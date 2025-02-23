import { useState, useEffect, useMemo } from "react";
import { useSettings } from "../context/settings";
import { LocalStorageManager } from "../services/LocalStorageManager";
import { TodoList } from "../types";
import { AnalyticsService } from "../services/AnalyticsService";
import { CheckCircle } from "react-feather";
import { ChartColumnStackedIcon, ListTodoIcon } from "lucide-react";

export const TodoAnalytics: React.FC = () => {
    const [todoHistory, setTodoHistory] = useState<TodoList[]>([]);
    const [streak, setStreak] = useState(0)
    const { settings } = useSettings();
  
    const textColor = settings.darkMode ? 'text-purple-200' : 'text-gray-900';
  
    useEffect(() => {
      const todos = LocalStorageManager.getTodoLists();
      const streak = AnalyticsService.getTodoStreak(todos);
      setTodoHistory(todos);
      setStreak(streak);
    }, []);
  
    const stats = useMemo(() => {
      const allTasks = todoHistory.flatMap(list => list.items);
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(item => item.status === 'completed').length;
      const failedTasks = allTasks.filter(item => item.status === 'failed').length;
      const pendingTasks = allTasks.filter(item => item.status === 'pending').length;
  
      const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
      const failureRate = totalTasks ? (failedTasks / totalTasks) * 100 : 0;
  
      // Calculate completion rate by day of week
      const dayStats = [0, 1, 2, 3, 4, 5, 6].map(day => {
        const dayTasks = allTasks.filter(
          task => new Date(task.dueDate).getDay() === day
        );
        const dayCompleted = dayTasks.filter(
          task => task.status === 'completed'
        ).length;
        return {
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
          rate: dayTasks.length ? (dayCompleted / dayTasks.length) * 100 : 0
        };
      });
  
      return {
        totalTasks,
        completedTasks,
        failedTasks,
        pendingTasks,
        completionRate,
        failureRate,
        dayStats
      };
    }, [todoHistory]);
  
    return (
      <div className={`min-h-screen`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
          Todo Analytics
        </h1>
  
        <div className="grid grid-cols-2 gap-2 mb-8">
          <div className={`col-span-2 p-4 rounded-xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
          } shadow-sm`}>
            <ChartColumnStackedIcon  className="h-6 w-6 text-orange-700"/>
            <h3 className="text-sm text-gray-500 mb-1">Streak</h3>
            <p className="text-2xl font-bold text-green-500">
              {streak} <span>todos</span>
            </p>
          </div>

          <div className={`p-4 rounded-xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
          } shadow-sm`}>
            <CheckCircle className="h-6 w-6 text-orange-700"/>
            <h3 className="text-sm text-gray-500 mb-1">Completion Rate</h3>
            <p className="text-2xl font-bold text-green-500">
              {stats.completionRate.toFixed(1)}%
            </p>
          </div>
  
          <div className={`p-4 rounded-xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
          } shadow-sm`}>
            <ListTodoIcon  className="h-6 w-6 text-orange-700"/>
            <h3 className="text-sm text-gray-500 mb-1">Total Tasks</h3>
            <p className={`text-2xl font-bold ${textColor}`}>
              {stats.totalTasks}
            </p>
          </div>
        </div>
  
        <div className={`p-4 rounded-xl ${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        } shadow-sm mb-8`}>
          <h3 className="text-lg font-semibold mb-4">Task Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Completed</span>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${stats.completionRate}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.completedTasks}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Failed</span>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${stats.failureRate}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.failedTasks}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${(stats.pendingTasks / stats.totalTasks) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.pendingTasks}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${
          settings.darkMode ? 'bg-gray-800' : 'bg-purple-200'
        } shadow-sm`}>
          <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
          <div className="space-y-3">
            {stats.dayStats.map(day => (
              <div key={day.day} className="flex items-center space-x-2">
                <span className="w-8 text-sm text-gray-500">{day.day}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${day.rate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{day.rate.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };