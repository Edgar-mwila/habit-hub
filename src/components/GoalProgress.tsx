import { useSettings } from "../context/settings";
import { Goal } from "../types";

interface GoalProgressProps {
  goal: Goal;
  onProgressUpdate: (progress: number) => void;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({
  goal,
  onProgressUpdate
}) => {
  const { settings } = useSettings();
  const formatProgress = (value: number) => {
    switch (goal.metric.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: goal.metric.format || 'USD'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'distance':
        return `${value} ${goal.metric.unit}`;
      default:
        return value.toString();
    }
  };

  return (
    <div className={`space-y-4 ${settings.darkMode ? 'text-white' : 'text-gray-700'}`}>
      <div className={`flex justify-between ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <span>Current Progress:</span>
        <span>{formatProgress(goal.currentProgress)}</span>
      </div>
      <div className={`flex justify-between ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <span>Target:</span>
        <span>{formatProgress(goal.target)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={goal.target}
        value={goal.currentProgress}
        onChange={(e) => onProgressUpdate(Number(e.target.value))}
        className={`w-full ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      />
    </div>
  );
};
