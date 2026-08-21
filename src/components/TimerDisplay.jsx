import React, { useState, useEffect, useRef } from "react";
import { formatTime, parseTimeString } from "../utils/format";

export function TimerDisplay({
  remainingSec,
  durationSec,
  status,
  isEditing,
  setIsEditing,
  onSetCustomDuration,
}) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef(null);

  // Initialize input value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setInputValue(formatTime(durationSec));
      setInputError(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isEditing, durationSec]);

  const handleStartEdit = () => {
    // Only allow editing if ready or paused
    if (status === "running") return;
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const parsed = parseTimeString(inputValue);
    if (parsed && parsed > 0) {
      onSetCustomDuration(parsed);
      setIsEditing(false);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
      setInputError(false);
    }
  };

  const presets = [
    { label: "5M", sec: 300 },
    { label: "15M", sec: 900 },
    { label: "25M", sec: 1500 },
    { label: "45M", sec: 2700 },
    { label: "60M", sec: 3600 },
  ];

  return (
    <div className="timer-zone">
      {isEditing ? (
        <div className="timer-edit-wrap">
          <input
            ref={inputRef}
            type="text"
            className="timer-edit-input"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError(false);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            placeholder="25:00"
            aria-label="Set custom duration (format MM:SS or HH:MM:SS)"
            style={inputError ? { borderColor: "#D32F2F" } : {}}
          />
          <div className="edit-hint">
            {inputError ? "Invalid time format. Use MM:SS or HH:MM:SS" : "Press Enter to save · Esc to cancel"}
          </div>
        </div>
      ) : (
        <div
          className="timer-display-wrap"
          onClick={handleStartEdit}
          role="button"
          tabIndex={status !== "running" ? 0 : -1}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && status !== "running") {
              e.preventDefault();
              handleStartEdit();
            }
          }}
          title={status !== "running" ? "Click or press E to set custom duration" : "Timer running"}
          aria-label={`Timer display ${formatTime(remainingSec)}. Current state: ${status}.`}
        >
          <div className={`timer-digits ${status === "completed" ? "completed" : ""}`}>
            {formatTime(remainingSec)}
          </div>
          <div className="timer-sublabel">
            {status === "ready" && "CLICK TO EDIT"}
            {status === "running" && "RUNNING"}
            {status === "paused" && "PAUSED — CLICK TO EDIT"}
            {status === "completed" && "COMPLETED"}
          </div>
        </div>
      )}

      {/* Quick Presets Bar */}
      {!isEditing && status !== "running" && (
        <div className="presets-bar" role="group" aria-label="Timer presets">
          {presets.map((p) => (
            <button
              key={p.sec}
              type="button"
              className={`preset-btn ${durationSec === p.sec && status === "ready" ? "active" : ""}`}
              onClick={() => onSetCustomDuration(p.sec)}
              title={`Set ${p.label} timer`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
