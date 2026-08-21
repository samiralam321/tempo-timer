import { useState, useEffect, useRef, useCallback } from "react";
import { playCompletionChime } from "../utils/audio";

const DEFAULT_CONFIG = {
  pomodoro: 1500,  // 25 min
  shortBreak: 300, // 5 min
  longBreak: 900,  // 15 min
};

export function usePomodoro() {
  // Configurable Durations in seconds with robust fallback
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("studywithme_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.pomodoro === "number" && parsed.pomodoro > 0) {
          return {
            pomodoro: parsed.pomodoro || DEFAULT_CONFIG.pomodoro,
            shortBreak: parsed.shortBreak || DEFAULT_CONFIG.shortBreak,
            longBreak: parsed.longBreak || DEFAULT_CONFIG.longBreak,
          };
        }
      }
    } catch (e) {
      /* ignore */
    }
    return DEFAULT_CONFIG;
  });

  const [mode, setMode] = useState("pomodoro"); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [status, setStatus] = useState("ready"); // 'ready' | 'running' | 'paused' | 'completed'
  const [remainingSec, setRemainingSec] = useState(() => config.pomodoro || 1500);

  const endTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Sync remainingSec whenever mode or config changes (if ready)
  useEffect(() => {
    if (status === "ready") {
      const targetSec = config[mode] || DEFAULT_CONFIG[mode] || 1500;
      setRemainingSec(targetSec);
    }
  }, [mode, config, status]);

  // Save config changes to localStorage
  const updateConfig = useCallback((newConfig) => {
    const sanitized = {
      pomodoro: newConfig.pomodoro || DEFAULT_CONFIG.pomodoro,
      shortBreak: newConfig.shortBreak || DEFAULT_CONFIG.shortBreak,
      longBreak: newConfig.longBreak || DEFAULT_CONFIG.longBreak,
    };
    setConfig(sanitized);
    try {
      localStorage.setItem("studywithme_config", JSON.stringify(sanitized));
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Switch mode helper
  const changeMode = useCallback(
    (newMode) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const targetSec = config[newMode] || DEFAULT_CONFIG[newMode] || 1500;
      setMode(newMode);
      setStatus("ready");
      setRemainingSec(targetSec);
      endTimeRef.current = null;
    },
    [config]
  );

  // Start / Resume
  const startTimer = useCallback(() => {
    if (status === "running") return;
    const modeDefault = config[mode] || DEFAULT_CONFIG[mode] || 1500;
    const initialSec = remainingSec > 0 ? remainingSec : modeDefault;
    if (remainingSec <= 0) {
      setRemainingSec(modeDefault);
    }
    endTimeRef.current = Date.now() + initialSec * 1000;
    setStatus("running");
  }, [status, remainingSec, config, mode]);

  // Pause
  const pauseTimer = useCallback(() => {
    if (status !== "running") return;
    if (endTimeRef.current) {
      const currentRemaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRemainingSec(currentRemaining);
    }
    setStatus("paused");
  }, [status]);

  // Reset
  const resetTimer = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const modeDefault = config[mode] || DEFAULT_CONFIG[mode] || 1500;
    setStatus("ready");
    setRemainingSec(modeDefault);
    endTimeRef.current = null;
  }, [config, mode]);

  // High-precision animation frame tick loop
  useEffect(() => {
    if (status !== "running") return;

    const tick = () => {
      if (!endTimeRef.current) return;
      const diffMs = endTimeRef.current - Date.now();
      const nextSec = Math.max(0, Math.ceil(diffMs / 1000));

      setRemainingSec((prev) => (prev !== nextSec ? nextSec : prev));

      if (diffMs <= 0) {
        setStatus("completed");
        setRemainingSec(0);
        endTimeRef.current = null;
        try {
          playCompletionChime();
        } catch (e) {}
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status]);

  // Document Title update
  useEffect(() => {
    const validSec = typeof remainingSec === "number" && !isNaN(remainingSec) ? remainingSec : 1500;
    const pad = (n) => String(n).padStart(2, "0");
    const m = Math.floor(validSec / 60);
    const s = validSec % 60;
    const formatted = `${pad(m)}:${pad(s)}`;
    const modeName = mode === "pomodoro" ? "Pomodoro" : mode === "shortBreak" ? "Short Break" : "Long Break";
    document.title = `${formatted} - ${modeName} | study with me`;
  }, [remainingSec, mode]);

  return {
    mode,
    status,
    remainingSec,
    config,
    changeMode,
    startTimer,
    pauseTimer,
    resetTimer,
    updateConfig,
  };
}
