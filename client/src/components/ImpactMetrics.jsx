import React, { useState, useEffect } from 'react'
import { Users, Briefcase, GraduationCap, Award } from 'lucide-react'

const metrics = [
  {
    icon: <Users className="w-8 h-8 text-ajira-blue" />,
    value: 1000,
    label: 'Active Students',
    suffix: '+'
  },
  {
    icon: <Briefcase className="w-8 h-8 text-ajira-orange" />,
    value: 500,
    label: 'Job Placements',
    suffix: '+'
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-ajira-gold" />,
    value: 25,
    label: 'Training Programs',
    suffix: ''
  },
  {
    icon: <Award className="w-8 h-8 text-ajira-lightBlue" />,
    value: 95,
    label: 'Success Rate',
    suffix: '%'
  }
]

const Counter = ({ value, duration = 2000, suffix }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    let animationFrame
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      if (progress < duration) {
        setCount(Math.floor((progress / duration) * value))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(value)
      }
    }
    
    animationFrame = requestAnimationFrame(updateCount)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])
  
  return (
    <span className="text-4xl md:text-5xl font-bold text-ajira-blue">
      {count}{suffix}
    </span>
  )
}

const ImpactMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="card hover:translate-y-[-4px] transition-transform duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-ajira-lightGray rounded-full">
              {metric.icon}
            </div>
            <Counter value={metric.value} suffix={metric.suffix} />
            <p className="text-lg text-ajira-gray font-medium">
              {metric.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImpactMetrics 