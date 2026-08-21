import React from "react";

export function HeroTimer({ remainingSec }) {
  const formatTime = (totalSec) => {
    if (totalSec < 0 || isNaN(totalSec)) return "00:00";
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="timer-digits-hero" role="timer" aria-live="polite">
      {formatTime(remainingSec)}
    </div>
  );
}
