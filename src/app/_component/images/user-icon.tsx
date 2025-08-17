"use client";
import React from "react";

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const UserIcon: React.FC<UserIconProps> = ({
  title = "User",
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
        <circle cx="16" cy="12" r="6" fill="#64B5F6" />
        <path
          d="M4 27c0-5.523 4.477-10 10-10h4c5.523 0 10 4.477 10 10"
          fill="#1976D2"
        />
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

export default UserIcon;
