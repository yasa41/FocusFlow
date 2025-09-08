import React, { useState, useEffect, useRef } from "react";

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startPause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      if (secondsLeft === 0) setSecondsLeft(25 * 60); 
      setIsRunning(true);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-xs mx-auto text-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">Focus Timer</h3>
      <div className="text-5xl font-mono mb-4 text-blue-600">{formatTime(secondsLeft)}</div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={startPause}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
