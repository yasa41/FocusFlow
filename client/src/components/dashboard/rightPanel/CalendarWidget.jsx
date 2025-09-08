import React, { useState } from "react";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const todayDate = today.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const navigateMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const getDayClasses = (day) => {
    let base = "w-10 h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer select-none ";
    if(isCurrentMonth && day === todayDate) {
      return base + "bg-blue-600 text-white font-semibold shadow-lg";
    }
    return base + "hover:bg-gray-200 text-gray-700";
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button aria-label="Previous month" onClick={() => navigateMonth(-1)} className="p-2 rounded hover:bg-gray-100">
          ‹
        </button>
        <div className="font-semibold text-lg text-gray-900">{monthNames[month]} {year}</div>
        <button aria-label="Next month" onClick={() => navigateMonth(1)} className="p-2 rounded hover:bg-gray-100">
          ›
        </button>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 text-center mt-2">
        {Array(firstDayOfMonth).fill(null).map((_, idx) => (
          <div key={"empty-" + idx} />
        ))}
        {Array(daysInMonth).fill(null).map((_, idx) => {
          const day = idx + 1;
          return (
            <button key={day} type="button" className={getDayClasses(day)} aria-current={isCurrentMonth && day === todayDate ? "date" : undefined}>
              {day}
            </button>
          )
        })}
      </div>
    </div>
  );
}
