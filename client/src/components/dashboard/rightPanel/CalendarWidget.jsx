import { useState } from 'react';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Important dates (mock data)
  const importantDates = {
    15: { type: 'deadline', title: 'CS Project Due' },
    22: { type: 'study', title: 'Group Study Session' },
    28: { type: 'exam', title: 'Midterm Exam' }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const getDayClasses = (day) => {
    let classes = "w-8 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 ";
    
    if (isCurrentMonth && day === today) {
      classes += "bg-purple-600 text-white font-bold ";
    } else if (importantDates[day]) {
      const type = importantDates[day].type;
      if (type === 'deadline') classes += "bg-red-100 text-red-600 font-medium ";
      else if (type === 'study') classes += "bg-blue-100 text-blue-600 font-medium ";
      else if (type === 'exam') classes += "bg-orange-100 text-orange-600 font-medium ";
    } else {
      classes += "hover:bg-gray-100 text-gray-700 ";
    }
    
    return classes;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            ⟨
          </button>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            ⟩
          </button>
        </div>
      </div>
      
      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 h-6 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8"></div>
        ))}
        
        {/* Days of the month */}
        {Array(daysInMonth).fill(null).map((_, index) => {
          const day = index + 1;
          return (
            <div key={day} className={getDayClasses(day)} title={importantDates[day]?.title}>
              {day}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span className="text-gray-600">Deadlines</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span className="text-gray-600">Study Sessions</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-orange-100 rounded"></div>
          <span className="text-gray-600">Exams</span>
        </div>
      </div>
    </div>
  );
}
