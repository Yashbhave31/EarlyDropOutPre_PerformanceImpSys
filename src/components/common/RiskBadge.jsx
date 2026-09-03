import React from 'react';
import { getRiskColorClass } from '../../utils/formatters';

export default function RiskBadge({ risk, showDot = true, size = "md" }) {
  const riskClass = getRiskColorClass(risk);
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3.5 py-1.5 font-bold"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${riskClass.badge} ${sizeClasses[size] || sizeClasses.md}`}>
      {showDot && (
        <span className={`relative flex ${dotSizes[size] || dotSizes.md}`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: riskClass.accent }} />
          <span className={`relative inline-flex rounded-full h-full w-full`} style={{ backgroundColor: riskClass.accent }} />
        </span>
      )}
      <span>{risk?.toUpperCase() || "UNKNOWN"} RISK</span>
    </span>
  );
}
