"use client";
import React from "react";

interface AppealsIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const AppealsIcon: React.FC<AppealsIconProps> = ({
  title = "Appeals",
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
        {/* Document base */}
        <rect x="8" y="6" width="16" height="20" rx="2" fill="#64B5F6" />

        {/* Upward arrow (appeal/escalate) */}
        <path
          d="M16 20V12M16 12L12 16M16 12L20 16"
          stroke="#1565C0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

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

export default AppealsIcon;
