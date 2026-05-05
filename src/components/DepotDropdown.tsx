import React, { useState } from "react";

interface DepotDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

const DepotDropdown: React.FC<DepotDropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className = "",
  buttonClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    console.log("Depot selected:", option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative z-50 w-full ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`relative z-50 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 px-6 py-3 rounded-lg shadow-lg font-bold text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer touch-manipulation w-full justify-between ${buttonClassName}`}
      >
        <span className="truncate text-left">{label}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Dropdown Content */}
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-[60] w-full min-w-[260px] max-h-[400px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-4 py-3 rounded-t-lg">
              <p className="text-white font-bold text-sm">Select Depot</p>
            </div>

            {/* Scrollable Options */}
            <div className="overflow-y-auto flex-1">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 text-sm border-b border-gray-100 last:border-0 cursor-pointer
                    ${
                      selectedValue === option
                        ? "bg-orange-50 font-bold text-orange-700"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:pl-6"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedValue === option && (
                      <span className="text-orange-600 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepotDropdown;
