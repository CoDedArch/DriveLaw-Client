"use client";
import React from "react";

interface DashboardIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const DashboardIcon: React.FC<DashboardIconProps> = ({
  title = "My Dashboard",
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
        <rect x="3" y="3" width="10" height="12" rx="2" fill="#1976D2" />
        <rect x="19" y="3" width="10" height="7" rx="2" fill="#42A5F5" />
        <rect x="19" y="14" width="10" height="15" rx="2" fill="#90CAF9" />
        <rect x="3" y="19" width="10" height="10" rx="2" fill="#64B5F6" />
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

export default DashboardIcon;
