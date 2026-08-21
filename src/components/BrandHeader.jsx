import React from "react";

export function BrandHeader({ status, remainingSec, durationSec, soundEnabled, onToggleSound }) {
  // Calculate progress percentage (0 to 100)
  const progressPercent = durationSec > 0 
    ? Math.min(100, Math.max(0, ((durationSec - remainingSec) / durationSec) * 100))
    : 0;

  return (
    <>
      {/* Top Hairline Progress Bar */}
      <div 
        className="top-progress-hairline"
        style={{ 
          width: `${progressPercent}%`,
          opacity: status === "ready" ? 0 : 0.85
        }}
        aria-hidden="true"
      />

      <header className="header-zone">
        <div className="brand-mark">
          <span className="brand-title">ATTO</span>
          <span className="brand-subtitle">10⁻¹⁸</span>
        </div>

        <div className="top-status">
          <div className="status-indicator" aria-live="polite">
            <span className={`status-dot ${status}`} />
            <span>{status}</span>
          </div>

          <button
            type="button"
            className="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundEnabled ? "Audio chime active (Click to mute)" : "Audio chime muted (Click to enable)"}
            aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            <span>{soundEnabled ? "SND: ON" : "SND: OFF"}</span>
          </button>
        </div>
      </header>
    </>
  );
}
