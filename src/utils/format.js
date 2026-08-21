/**
 * Utility functions for time formatting and string parsing
 */

/**
 * Formats total seconds into MM:SS or HH:MM:SS string
 * @param {number} totalSeconds 
 * @returns {string} e.g. "25:00" or "01:15:30"
 */
export function formatTime(totalSeconds) {
  if (totalSeconds < 0 || isNaN(totalSeconds)) return "00:00";

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (num) => String(num).padStart(2, "0");

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Parses user input into total seconds
 * Supports formats: "25:00", "01:30:00", "45", "10m", "1h 30m"
 * @param {string} str 
 * @returns {number|null} Total seconds or null if invalid
 */
export function parseTimeString(str) {
  if (!str || typeof str !== "string") return null;

  const trimmed = str.trim().toLowerCase();
  if (!trimmed) return null;

  // Handles standard "HH:MM:SS" or "MM:SS" or "SS"
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((p) => p.trim());
    if (parts.some((p) => isNaN(p) || p === "")) return null;

    const nums = parts.map(Number);
    if (nums.some((n) => n < 0)) return null;

    if (nums.length === 2) {
      const [m, s] = nums;
      if (s >= 60) return null; // invalid seconds
      return m * 60 + s;
    } else if (nums.length === 3) {
      const [h, m, s] = nums;
      if (m >= 60 || s >= 60) return null;
      return h * 3600 + m * 60 + s;
    }
    return null;
  }

  // Handle unit suffixes e.g., "25m", "90s", "1h"
  if (/^\d+[hms]$/.test(trimmed)) {
    const val = parseInt(trimmed, 10);
    const unit = trimmed.slice(-1);
    if (unit === "s") return val;
    if (unit === "m") return val * 60;
    if (unit === "h") return val * 3600;
  }

  // Plain number default to minutes if > 0 and <= 300, or seconds if specified
  const num = Number(trimmed);
  if (!isNaN(num) && num > 0) {
    // If user enters e.g. "25", assume 25 minutes (1500 seconds)
    return num * 60;
  }

  return null;
}

/**
 * Formats time string for document.title
 */
export function formatTitleTime(remainingSec, status) {
  const formatted = formatTime(remainingSec);
  if (status === "running") {
    return `${formatted} — ATTO`;
  }
  if (status === "paused") {
    return `[PAUSED] ${formatted} — ATTO`;
  }
  if (status === "completed") {
    return `00:00 [DONE] — ATTO`;
  }
  return `ATTO — Precision Timer`;
}
