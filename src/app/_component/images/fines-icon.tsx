"use client";
import React from "react";

interface FinesIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const FinesIcon: React.FC<FinesIconProps> = ({
  title = "Fines",
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
        {/* Document shape */}
        <rect x="8" y="6" width="16" height="20" rx="2" fill="#90CAF9" />
        
        {/* Dollar symbol */}
        <path
          d="M16 11V21M13.5 13.5C13.5 12.1193 14.6193 11 16 11C17.3807 11 18.5 12.1193 18.5 13.5C18.5 14.8807 17.3807 16 16 16C14.6193 16 13.5 17.1193 13.5 18.5C13.5 19.8807 14.6193 21 16 21C17.3807 21 18.5 19.8807 18.5 18.5"
          stroke="#1565C0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Document border */}
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

export default FinesIcon;
