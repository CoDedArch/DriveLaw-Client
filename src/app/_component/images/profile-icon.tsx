"use client";
import React from "react";

interface ProfileIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  title = "Profile",
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
        {/* Head */}
        <circle cx="16" cy="11" r="4" fill="#42A5F5" />

        {/* Shoulders */}
        <path
          d="M8 24c0-4.418 3.582-8 8-8s8 3.582 8 8"
          fill="#1976D2"
        />

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

export default ProfileIcon;
