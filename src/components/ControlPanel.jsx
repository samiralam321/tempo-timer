import React from "react";

export function ControlPanel({ status, onStart, onPause, onReset }) {
  return (
    <div className="controls-group">
      {status === "ready" && (
        <button
          type="button"
          className="btn-primary"
          onClick={onStart}
          aria-label="Start timer"
        >
          START
        </button>
      )}

      {status === "running" && (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={onPause}
            aria-label="Pause timer"
          >
            PAUSE
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            aria-label="Reset timer"
          >
            RESET
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={onStart}
            aria-label="Resume timer"
          >
            RESUME
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            aria-label="Reset timer"
          >
            RESET
          </button>
        </>
      )}

      {status === "completed" && (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={onStart}
            aria-label="Restart timer"
          >
            RESTART
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            aria-label="Reset timer"
          >
            RESET
          </button>
        </>
      )}
    </div>
  );
}
