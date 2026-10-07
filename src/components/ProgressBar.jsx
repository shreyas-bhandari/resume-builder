import React from "react";

export default function ProgressBar({ value }) {
  const label =
    value === 100 ? "Complete! 🎉" :
    value >= 75 ? "Almost there!" :
    value >= 50 ? "Looking good" :
    value >= 25 ? "Keep going..." :
    "Just starting";

  return (
    <div className="progress-container" title={`Resume ${value}% complete`}>
      <div className="progress-label">
        <span className="progress-pct">{value}%</span>
        <span className="progress-text">{label}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
