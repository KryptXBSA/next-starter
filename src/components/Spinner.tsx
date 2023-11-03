import React from "react";

export function Spinner() {
  return (
    <div className="flex items-center justify-center ">
      <svg className="animate-spin-fast h-8 w-8">
        <circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          style={{ stroke: "rgb(29, 161, 242)", opacity: "0.2" }}
        />
        <circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          style={{
            stroke: "rgb(29, 161, 242)",
            strokeDasharray: 80,
            strokeDashoffset: 60,
          }}
        />
      </svg>
    </div>
  );
}
