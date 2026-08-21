import { useState, useEffect, useRef, useCallback } from "react";
import { playCompletionChime } from "../utils/audio";
import { formatTitleTime } from "../utils/format";

const DEFAULT_DURATION = 1500; // 25 minutes in seconds

export function useTimer() {
  // Read persisted duration or fallback to 25 mins
  const [durationSec, setDurationSec] = useState(() => {
    try {
      const saved = localStorage.getItem("atto_duration");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch (e) {
      /* ignore storage errors */
    }
    return DEFAULT_DURATION;
  });

  const [remainingSec, setRemainingSec] = useState(durationSec);
  const [status, setStatus] = useState("ready"); // 'ready' | 'running' | 'paused' | 'completed'
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("atto_sound") === "true";
    } catch (e) {
      return false;
    }
  });

  const endTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Sync remainingSec when duration changes in ready state
  const setCustomDuration = useCallback((newSec) => {
    if (newSec <= 0 || isNaN(newSec)) return false;
    setDurationSec(newSec);
    setRemainingSec(newSec);
    setStatus("ready");
    try {
      localStorage.setItem("atto_duration", newSec.toString());
    } catch (e) {
      /* ignore */
    }
    return true;
  }, []);

  // Sound toggle handler
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("atto_sound", next.toString());
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Start / Resume timer
  const startTimer = useCallback(() => {
    if (status === "running") return;
    
    // If starting from completed or 0, reset first
    const initialSec = remainingSec > 0 ? remainingSec : durationSec;
    if (remainingSec <= 0) {
      setRemainingSec(durationSec);
    }

    endTimeRef.current = Date.now() + initialSec * 1000;
    setStatus("running");
  }, [status, remainingSec, durationSec]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (status !== "running") return;

    if (endTimeRef.current) {
      const currentRemaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRemainingSec(currentRemaining);
    }
    setStatus("paused");
  }, [status]);

  // Reset timer
  const resetTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setStatus("ready");
    setRemainingSec(durationSec);
    endTimeRef.current = null;
  }, [durationSec]);

  // Main high-precision animation frame tick loop
  useEffect(() => {
    if (status !== "running") return;

    const tick = () => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const diffMs = endTimeRef.current - now;
      const nextSec = Math.max(0, Math.ceil(diffMs / 1000));

      setRemainingSec((prev) => (prev !== nextSec ? nextSec : prev));

      if (diffMs <= 0) {
        setStatus("completed");
        setRemainingSec(0);
        endTimeRef.current = null;

        if (soundEnabled) {
          playCompletionChime();
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, soundEnabled]);

  // Dynamic Document Title update
  useEffect(() => {
    document.title = formatTitleTime(remainingSec, status);
  }, [remainingSec, status]);

  return {
    durationSec,
    remainingSec,
    status,
    soundEnabled,
    toggleSound,
    startTimer,
    pauseTimer,
    resetTimer,
    setCustomDuration,
  };
}
