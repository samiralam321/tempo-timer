import React from "react";

export function Header({ mode, onChangeMode }) {
  return (
    <header className="top-nav">
      {/* Left Empty Spacer */}
      <div className="brand-wrap" />

      {/* Mode Switcher Pills Bar */}
      <div className="mode-pills-bar">
        <button
          type="button"
          className={`mode-pill ${mode === "pomodoro" ? "active" : ""}`}
          onClick={() => onChangeMode("pomodoro")}
        >
          pomodoro
        </button>

        <button
          type="button"
          className={`mode-pill ${mode === "shortBreak" ? "active" : ""}`}
          onClick={() => onChangeMode("shortBreak")}
        >
          short break
        </button>

        <button
          type="button"
          className={`mode-pill ${mode === "longBreak" ? "active" : ""}`}
          onClick={() => onChangeMode("longBreak")}
        >
          long break
        </button>
      </div>

      {/* Right Empty Spacer to keep mode pills centered */}
      <div className="brand-wrap" />
    </header>
  );
}
