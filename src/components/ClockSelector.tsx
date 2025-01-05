import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context/settings'

interface ClockSelectorProps {
  value: string
  onChange: (time: string) => void
}

export const ClockSelector: React.FC<ClockSelectorProps> = ({ value, onChange }) => {
  const { settings } = useSettings()
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number)
      setHours(h)
      setMinutes(m)
    }
  }, [value])

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const formattedHours = newHours.toString().padStart(2, '0')
    const formattedMinutes = newMinutes.toString().padStart(2, '0')
    onChange(`${formattedHours}:${formattedMinutes}`)
  }

  const getHandRotation = (value: number, maxValue: number) => {
    return (value / maxValue) * 360
  }

  return (
    <div className={`relative w-64 h-64 mx-auto my-4 rounded-full ${
      settings.darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border-4 border-primary">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-4 bg-primary"
            style={{
              transform: `rotate(${i * 30}deg) translateY(8px)`,
              transformOrigin: '50% 100%',
              left: 'calc(50% - 2px)',
            }}
          />
        ))}

        {/* Hour hand */}
        <motion.div
          className="absolute w-1.5 h-20 bg-primary rounded-full origin-bottom"
          style={{
            left: 'calc(50% - 3px)',
            bottom: '50%',
            rotate: getHandRotation(hours % 12, 12),
          }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDrag={(_, info) => {
            const angle = Math.atan2(info.point.y, info.point.x)
            const newHours = Math.round((angle / (2 * Math.PI)) * 12 + 6) % 12
            handleTimeChange(newHours, minutes)
          }}
        />

        {/* Minute hand */}
        <motion.div
          className="absolute w-1 h-24 bg-secondary rounded-full origin-bottom"
          style={{
            left: 'calc(50% - 2px)',
            bottom: '50%',
            rotate: getHandRotation(minutes, 60),
          }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDrag={(_, info) => {
            const angle = Math.atan2(info.point.y, info.point.x)
            const newMinutes = Math.round((angle / (2 * Math.PI)) * 60 + 30) % 60
            handleTimeChange(hours, newMinutes)
          }}
        />

        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-primary rounded-full"
          style={{ left: 'calc(50% - 6px)', top: 'calc(50% - 6px)' }}
        />
      </div>

      {/* Digital display */}
      <div className={`absolute -bottom-10 left-0 right-0 text-center text-lg font-medium ${
        settings.darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
      </div>
    </div>
  )
}