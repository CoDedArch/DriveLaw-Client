"use client";
import React from "react";

interface OffensesIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const OffensesIcon: React.FC<OffensesIconProps> = ({
  title = "Offenses",
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
        {/* Shield shape */}
        <path
          d="M16 4L26 8V16C26 21.523 21.523 26 16 26C10.477 26 6 21.523 6 16V8L16 4Z"
          fill="#EF5350"
        />
        
        {/* Exclamation mark */}
        <rect x="15" y="11" width="2" height="7" fill="white" />
        <circle cx="16" cy="20" r="1.5" fill="white" />

        {/* Border */}
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          rx="4"
          stroke="#C62828"
          strokeWidth="2"
        />
      </svg>
      <p className="whitespace-nowrap font-semibold text-sm text-gray-700 tracking-wide">
        {title}
      </p>
    </div>
  );
};

export default OffensesIcon;
