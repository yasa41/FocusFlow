import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTarget, FiUsers, FiAward, FiClock, FiStar } from 'react-icons/fi';

export default function StatsOverview() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalPoints: 0,
    completedGoals: 0,
    studyHours: 0,
    streakDays: 0
  });

  // Target values
  const targetValues = {
    totalPoints: 2847,
    completedGoals: 23,
    studyHours: 145,
    streakDays: 7
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues({
        totalPoints: Math.round(targetValues.totalPoints * easeOut),
        completedGoals: Math.round(targetValues.completedGoals * easeOut),
        studyHours: Math.round(targetValues.studyHours * easeOut),
        streakDays: Math.round(targetValues.streakDays * easeOut)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      id: 'points',
      title: 'Total Points',
      value: animatedValues.totalPoints.toLocaleString(),
      change: '+156 this week',
      changeType: 'positive',
      icon: FiAward,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      id: 'goals',
      title: 'Goals Completed',
      value: `${animatedValues.completedGoals}/30`,
      change: '77% completion rate',
      changeType: 'positive',
      icon: FiTarget,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      id: 'hours',
      title: 'Study Hours',
      value: `${animatedValues.studyHours}h`,
      change: '+12h this week',
      changeType: 'positive',
      icon: FiClock,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500'
    },
    {
      id: 'streak',
      title: 'Current Streak',
      value: `${animatedValues.streakDays} days`,
      change: 'Personal best!',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Your Progress Overview
          </h2>
          <p className="text-gray-600 mt-1">Track your achievements and stay motivated</p>
        </div>
        
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-white hover:shadow-md">
          <FiStar className="w-4 h-4" />
          <span>View Detailed Stats</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                {stat.id === 'streak' && (
                  <div className="text-2xl animate-bounce">🔥</div>
                )}
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <FiTrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">{stat.change}</span>
                </div>
              </div>

              {/* Progress bar for goals */}
              {stat.id === 'goals' && (
                <div className="mt-4">
                  <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(animatedValues.completedGoals / 30) * 100}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Weekly Summary Card */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Achievement</h3>
              <p className="text-gray-600">You're crushing it this week! 🎉</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">+23%</div>
            <div className="text-sm text-gray-500">vs last week</div>
          </div>
        </div>
      </div>
    </section>
  );
}
