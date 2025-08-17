"use client";
import React from "react";

interface InfoIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  title = "Info",
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
        {/* Circle background */}
        <circle cx="16" cy="16" r="8" fill="#64B5F6" />

        {/* "i" symbol */}
        <rect x="15" y="13" width="2" height="7" fill="#1565C0" />
        <circle cx="16" cy="10" r="1.5" fill="#1565C0" />

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

export default InfoIcon;
