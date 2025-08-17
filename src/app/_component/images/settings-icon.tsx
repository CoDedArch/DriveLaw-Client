"use client";
import React from "react";

interface SettingsIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const SettingsIcon: React.FC<SettingsIconProps> = ({
  title = "Settings",
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
        {/* Gear shape */}
        <path
          d="M19.4 4.6l1.2 2.7a1 1 0 001 .6l2.9.3a1 1 0 01.9 1.2l-.6 2.8a1 1 0 00.3.9l2 2a1 1 0 010 1.4l-2 2a1 1 0 00-.3.9l.6 2.8a1 1 0 01-.9 1.2l-2.9.3a1 1 0 00-1 .6l-1.2 2.7a1 1 0 01-1.4.5l-2.5-1.1a1 1 0 00-1 0l-2.5 1.1a1 1 0 01-1.4-.5l-1.2-2.7a1 1 0 00-1-.6l-2.9-.3a1 1 0 01-.9-1.2l.6-2.8a1 1 0 00-.3-.9l-2-2a1 1 0 010-1.4l2-2a1 1 0 00.3-.9L4.6 9.4a1 1 0 01.9-1.2l2.9-.3a1 1 0 001-.6l1.2-2.7a1 1 0 011.4-.5l2.5 1.1a1 1 0 001 0l2.5-1.1a1 1 0 011.4.5z"
          fill="#64B5F6"
        />
        {/* Gear center */}
        <circle cx="16" cy="16" r="3" fill="#1565C0" />
        
        {/* Outer border */}
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

export default SettingsIcon;
