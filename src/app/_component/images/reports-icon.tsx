"use client";
import React from "react";

interface ReportsIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const ReportsIcon: React.FC<ReportsIconProps> = ({
  title = "Reports",
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
        {/* Document background */}
        <rect x="8" y="6" width="16" height="20" rx="2" fill="#90CAF9" />

        {/* Bar chart */}
        <rect x="11" y="18" width="2" height="4" fill="#1976D2" />
        <rect x="15" y="16" width="2" height="6" fill="#1976D2" />
        <rect x="19" y="14" width="2" height="8" fill="#1976D2" />

        {/* Outer frame */}
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

export default ReportsIcon;
