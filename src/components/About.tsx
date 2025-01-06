import React, { useState } from 'react';
import { useSettings } from '../context/settings';
import { ArrowRight, Star, Award, Target, Calendar, ChartBar, ListTodo } from 'lucide-react';
import {  } from '../types/index';

export const About = () => {
  const { settings } = useSettings();
  const isDarkMode = settings.darkMode;
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);;

  const Features = [
    {
      icon: Target,
      title: "Goal Setting Framework",
      description: "Transform dreams into actionable plans with our SMART goal system",
      stats: "50,000+ goals created"
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Never miss a milestone with intelligent scheduling and reminders",
      stats: "1M+ review sessions completed"
    },
    {
      icon: ChartBar,
      title: "Analytics Dashboard",
      description: "Gain insights from detailed progress tracking and pattern analysis",
      stats: "250,000+ data points analyzed"
    },
    {
      icon: ListTodo,
      title: "Community Support",
      description: "Join a community of achievers and share your journey",
      stats: "85% success rate"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section with Gradient */}
      <div className={`relative overflow-hidden ${
        isDarkMode ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900' 
        : 'bg-gradient-to-br from-purple-100 via-purple-200 to-orange-100'
      } py-20`}>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className={`text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-purple-100' : 'text-purple-800'
          }`}>
            GoalCraft
          </h1>
          <p className={`text-2xl ${
            isDarkMode ? 'text-purple-200' : 'text-purple-700'
          }`}>
            Where Dreams Transform into Achievements
          </p>
          
          {/* Animated Decorative Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className={`max-w-4xl mx-auto px-4 py-16 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div className={`p-8 rounded-2xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:shadow-lg'
        }`}>
          <h2 className={`text-3xl font-bold mb-6 ${
            isDarkMode ? 'text-purple-300' : 'text-purple-600'
          }`}>Our Mission</h2>
          <p className="text-lg leading-relaxed mb-4">
            GoalCraft empowers individuals to transform their aspirations into tangible achievements through science-backed goal-setting methods and intuitive tools.
          </p>
          <p className="text-lg leading-relaxed">
            Built by dreamers for dreamers, we combine behavioral science with cutting-edge technology to create a goal management system that adapts to your unique journey.
          </p>
        </div>
      </div>

      {/* Interactive Feature Cards */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold mb-12 text-center ${
          isDarkMode ? 'text-purple-300' : 'text-purple-600'
        }`}>
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all duration-300 transform cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-750'
                  : 'bg-white hover:shadow-xl'
              } ${hoveredFeature === index ? 'scale-105' : ''}`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <feature.icon 
                className={`w-12 h-12 mb-4 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
              />
              <h3 className={`text-xl font-semibold mb-3 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>
                {feature.title}
              </h3>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                {feature.stats}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section with Animated Stats */}
      <div className={`py-16 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-900 via-gray-800 to-orange-900'
          : 'bg-gradient-to-r from-purple-100 via-gray-100 to-orange-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${
            isDarkMode ? 'text-purple-300' : 'text-purple-600'
          }`}>
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard 
              number="50,000+"
              label="Active Users"
              isDarkMode={isDarkMode}
            />
            <StatsCard 
              number="250,000+"
              label="Goals Achieved"
              isDarkMode={isDarkMode}
            />
            <StatsCard 
              number="85%"
              label="Success Rate"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-purple-300' : 'text-purple-600'
        }`}>
          Meet Our Team
        </h2>
        <div className={`p-8 rounded-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <p className={`text-lg leading-relaxed mb-6 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Our diverse team brings together expertise from leading tech companies, research institutions, and successful startups. Led by founder Sarah Chen, we combine deep technical knowledge with genuine empathy for users' challenges.
          </p>
          <div className={`flex items-center justify-center p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-750' : 'bg-purple-50'
          }`}>
            <Star className={`w-6 h-6 mr-2 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-500'
            }`} />
            <span className={`text-lg font-medium ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Join our growing team of dreamers and achievers
            </span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`py-16 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-900 to-orange-900'
          : 'bg-gradient-to-br from-purple-100 to-orange-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${
            isDarkMode ? 'text-purple-200' : 'text-purple-800'
          }`}>
            Ready to Achieve Your Dreams?
          </h2>
          <button className={`
            px-8 py-4 rounded-full text-lg font-medium transition-all duration-300
            flex items-center justify-center mx-auto
            ${isDarkMode 
              ? 'bg-purple-500 text-white hover:bg-purple-400' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
            }
          `}>
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


// Define Props for StatsCard
interface StatsCardProps {
  number: string;
  label: string;
  isDarkMode: boolean;
}
// Stats Card Component with Animation
const StatsCard: React.FC<StatsCardProps> = ({ number, label, isDarkMode }) => (
    <div className={`text-center p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
      isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-750' 
        : 'bg-white hover:shadow-lg'
    }`}>
      <div className={`text-4xl font-bold mb-2 ${
        isDarkMode ? 'text-orange-400' : 'text-orange-600'
      }`}>
        {number}
      </div>
      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
        {label}
      </div>
    </div>
  );