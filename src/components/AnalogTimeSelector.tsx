import React, { useState, MouseEvent } from 'react';

interface AnalogTimePickerProps {
  value: string; // Time in 'HH:mm' format
  onChange: (time: string) => void; // Callback with new time in 'HH:mm' format
}

export const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial value into hour and minute
  const [tempHour, setTempHour] = useState(() => parseInt(value.split(':')[0], 10));
  const [tempMinute, setTempMinute] = useState(() => parseInt(value.split(':')[1], 10));

  const handleTimeClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - 100; // Center point offset
    const y = event.clientY - rect.top - 100; // Center point offset

    // Calculate angle from center
    const angle = Math.atan2(y, x);
    let hour = Math.round(((angle * 180) / Math.PI + 360) % 360 / 30) % 12;
    if (hour === 0) hour = 12;

    setTempHour(hour);

    // Generate new time string and call onChange
    const newTime = formatTimeString(hour, tempMinute);
    onChange(newTime);
  };

  const formatTimeString = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm rounded-md bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800"
      >
        {value}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-purple-200 dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div
            className="relative w-52 h-52 rounded-full border-2 border-purple-600 cursor-pointer"
            onClick={handleTimeClick}
          >
            {/* Clock numbers */}
            {[...Array(12)].map((_, i) => {
              const angle = ((i + 1) * 30 * Math.PI) / 180;
              const x = 100 + 80 * Math.sin(angle);
              const y = 100 - 80 * Math.cos(angle);
              return (
                <span
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 font-semibold"
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  {i + 1}
                </span>
              );
            })}

            {/* Hour hand */}
            <div
              className="absolute w-1 bg-purple-600 origin-bottom rounded-full"
              style={{
                height: '40px',
                left: '100px',
                top: '60px',
                transformOrigin: '0 40px',
                transform: `rotate(${(tempHour % 12) * 30}deg)`,
              }}
            />

            {/* Center dot */}
            <div
              className="absolute w-3 h-3 bg-purple-600 rounded-full"
              style={{ left: '98px', top: '98px' }}
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
