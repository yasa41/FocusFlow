import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, title]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          onClose();
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex flex-col max-w-3xl mx-auto p-6 bg-white rounded shadow-lg top-[10%] left-0 right-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={() => {
              onClose();
            }}
            aria-label="Close modal"
            className="text-gray-600 hover:text-gray-900"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="overflow-auto max-h-[70vh]">{children}</div>
      </div>
    </>
  );
}
