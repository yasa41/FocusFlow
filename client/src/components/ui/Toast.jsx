import React, { useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function Toast({ type = 'success', message, isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${getStyles()} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}>
        {getIcon()}
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
