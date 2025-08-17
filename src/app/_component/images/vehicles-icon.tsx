"use client";
import React from "react";

interface VehiclesIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const VehiclesIcon: React.FC<VehiclesIconProps> = ({
  title = "Vehicles",
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
        {/* Vehicle body */}
        <rect x="5" y="14" width="22" height="8" rx="2" fill="#42A5F5" />

        {/* Roof / cabin */}
        <path d="M9 14 L12 10 H20 L23 14 Z" fill="#90CAF9" />

        {/* Wheels */}
        <circle cx="10" cy="24" r="2" fill="#1565C0" />
        <circle cx="22" cy="24" r="2" fill="#1565C0" />

        {/* Outline */}
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

export default VehiclesIcon;
