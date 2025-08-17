"use client";
import React from "react";

interface DriversIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const DriversIcon: React.FC<DriversIconProps> = ({
  title = "Drivers",
  ...props
}) => {
  return (
    <div
      className="flex items-center gap-2 relative"
      style={{
        display: "inline-flex",
        cursor: "pointer",
      }}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        style={{
          flexShrink: 0,
        }}
        {...props}
      >
        {/* Car body */}
        <rect x="6" y="14" width="20" height="8" rx="2" fill="#1976D2" />
        
        {/* Car roof */}
        <path d="M10 14 L13 10 H19 L22 14 Z" fill="#42A5F5" />
        
        {/* Wheels */}
        <circle cx="10" cy="24" r="2" fill="#1565C0" />
        <circle cx="22" cy="24" r="2" fill="#1565C0" />
        
        {/* Driver head inside car */}
        <circle cx="16" cy="13" r="2" fill="#90CAF9" />
        
        {/* Border */}
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          rx="4"
          stroke="#1565C0"
          strokeWidth="2"
        />
      </svg>
      <p className="whitespace-nowrap font-semibold text-sm text-gray-700 tracking-wide">
        {title}
      </p>
    </div>
  );
};

export default DriversIcon;
