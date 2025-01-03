import { useSettings } from "../context/settings";
import { Metric } from "../types";

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetric: Metric;
  onMetricChange: (metric: Metric) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  metrics,
  selectedMetric,
  onMetricChange
}) => {
  const { settings } = useSettings();

  return (
    <div className={`space-y-4 ${settings.darkMode ? 'text-white' : 'text-gray-700'}`}>
      <label className={`block text-sm font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Select Metric Type
      </label>
      <select
        className={`w-full p-2 border rounded-md ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
        value={selectedMetric.id}
        onChange={(e) => {
          const metric = metrics.find(m => m.id === e.target.value);
          if (metric) onMetricChange(metric);
        }}
      >
        {metrics.map(metric => (
          <option key={metric.id} value={metric.id}>
            {metric.name} {metric.unit ? `(${metric.unit})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
