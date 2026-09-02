import React, { useState } from "react";

export function SettingsModal({ isOpen, onClose, config, onSaveConfig, wallpapers, currentTheme, onSelectTheme }) {
  const [pomoMin, setPomoMin] = useState(Math.floor((config.pomodoro || 1500) / 60));
  const [shortMin, setShortMin] = useState(Math.floor((config.shortBreak || 300) / 60));
  const [longMin, setLongMin] = useState(Math.floor((config.longBreak || 900) / 60));

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const p = Math.max(1, parseInt(pomoMin, 10) || 25);
    const sb = Math.max(1, parseInt(shortMin, 10) || 5);
    const lb = Math.max(1, parseInt(longMin, 10) || 15);

    onSaveConfig({
      pomodoro: p * 60,
      shortBreak: sb * 60,
      longBreak: lb * 60,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Timer Settings</h2>
          <div className="settings-header-actions">
            <a
              href="https://github.com/samiralam321"
              target="_blank"
              rel="noopener noreferrer"
              className="github-header-link"
              title="GitHub Profile (samiralam321)"
              aria-label="GitHub Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="setting-group">
            <label className="setting-label">Time Durations (Minutes)</label>
            <div className="time-inputs-grid">
              <div className="time-input-box">
                <label>Pomodoro</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={pomoMin}
                  onChange={(e) => setPomoMin(e.target.value)}
                />
              </div>

              <div className="time-input-box">
                <label>Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={shortMin}
                  onChange={(e) => setShortMin(e.target.value)}
                />
              </div>

              <div className="time-input-box">
                <label>Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longMin}
                  onChange={(e) => setLongMin(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="setting-group" style={{ marginTop: "1.25rem" }}>
            <label className="setting-label">Background Atmosphere</label>
            <div className="wallpaper-grid">
              {wallpapers.map((w) => (
                <div
                  key={w.id}
                  className={`wallpaper-thumb-card ${currentTheme.id === w.id ? "active" : ""}`}
                  onClick={() => onSelectTheme(w)}
                >
                  {w.thumbUrl ? (
                    <img src={w.thumbUrl} alt="" className="wallpaper-thumb-img" />
                  ) : w.youtubeId ? (
                    <img src={`https://img.youtube.com/vi/${w.youtubeId}/mqdefault.jpg`} alt="" className="wallpaper-thumb-img" />
                  ) : w.type === "video" ? (
                    <video src={w.url} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={w.url} alt="" className="wallpaper-thumb-img" />
                  )}
                  <div className="wallpaper-title">{w.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-save-settings">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
