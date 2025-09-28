"use client";

import { useState } from "react";
// import { motion } from "framer-motion";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  description?: string;
  enabledText?: string;
  disabledText?: string;
  icon?: React.ReactNode;
  color?: "blue" | "orange" | "green" | "red";
}

export default function ToggleSwitch({
  enabled,
  onToggle,
  disabled = false,
  loading = false,
  label,
  description,
  enabledText = "Enabled",
  disabledText = "Disabled",
  icon,
  color = "blue"
}: ToggleSwitchProps) {
  const [isPressed, setIsPressed] = useState(false);

  const colorClasses = {
    blue: {
      enabled: "bg-blue-600",
      enabledHover: "hover:bg-blue-700",
      enabledBg: "bg-blue-100",
      enabledText: "text-blue-600",
      enabledBorder: "border-blue-200"
    },
    orange: {
      enabled: "bg-orange-600",
      enabledHover: "hover:bg-orange-700",
      enabledBg: "bg-orange-100",
      enabledText: "text-orange-600",
      enabledBorder: "border-orange-200"
    },
    green: {
      enabled: "bg-green-600",
      enabledHover: "hover:bg-green-700",
      enabledBg: "bg-green-100",
      enabledText: "text-green-600",
      enabledBorder: "border-green-200"
    },
    red: {
      enabled: "bg-red-600",
      enabledHover: "hover:bg-red-700",
      enabledBg: "bg-red-100",
      enabledText: "text-red-600",
      enabledBorder: "border-red-200"
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center space-x-4 flex-1">
        {/* Icon */}
        <div className={`p-3 ${enabled ? colors.enabledBg : 'bg-gray-100'} rounded-lg flex-shrink-0 transition-colors duration-200`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {label && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{label}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 mb-2">{description}</p>
          )}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${enabled ? colors.enabledText : 'text-gray-500'}`}>
              {enabled ? enabledText : disabledText}
            </span>
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex-shrink-0">
        <button
          onClick={onToggle}
          disabled={disabled || loading}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${enabled ? colors.enabled : 'bg-gray-300'}
            ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isPressed ? 'scale-95' : 'scale-100'}
          `}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200"
            style={{
              transform: `translateX(${enabled ? '20px' : '4px'})`
            }}
          />
        </button>
      </div>
    </div>
  );
}
