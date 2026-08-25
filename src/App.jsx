import React, { useState, useEffect, useCallback } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { Header } from "./components/Header";
import { HeroTimer } from "./components/HeroTimer";
import { Controls } from "./components/Controls";
import { LofiPlayer } from "./components/LofiPlayer";
import { SettingsModal } from "./components/SettingsModal";

const BOY_STUDYING_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/Boy_studying_at_desk_in_202608211057.jpeg";
const YOUR_NAME_ANIME_URL = "https://go-file-storage.onrender.com/file_storage/wp5529802-hd-4k-anime-your-name-wallpapers.jpg";
const COOL_ANIME_LANDSCAPE_URL = "https://go-file-storage.onrender.com/file_storage/wp6434841-cool-anime-landscape-wallpapers.jpg";
const SAMURAI_MOONLIT_LAKE_URL = "https://go-file-storage.onrender.com/file_storage/serene-samurai-amidst-cherry-blossoms-moonlit-lake (1).jpg";
const AESTHETIC_ANIME_NIGHT_URL = "https://go-file-storage.onrender.com/file_storage/2152014291.jpg";
const ANIME_NIGHT_SKY_URL = "https://go-file-storage.onrender.com/file_storage/anime-night-sky-illustration.jpg";
const PEACEFUL_ANIME_SUNSET_URL = "https://go-file-storage.onrender.com/file_storage/wp9315335-peaceful-anime-4k-wallpapers.jpg";
const PEACEFUL_ANIME_NIGHT_URL = "https://go-file-storage.onrender.com/file_storage/wp9315303-peaceful-anime-4k-wallpapers.jpg";
const SCENERY_4K_URL = "https://go-file-storage.onrender.com/file_storage/wp12575021-scenary-4k-wallpapers.jpg";
const PEACEFUL_DESKTOP_URL = "https://go-file-storage.onrender.com/file_storage/wp9899910-desktop-peaceful-wallpapers.jpg";
const SUNSET_VALLEY_URL = "https://go-file-storage.onrender.com/file_storage/uwp5081657.jpeg";
const CALM_ULTRA_HD_URL = "https://go-file-storage.onrender.com/file_storage/wp11527838-calm-ultra-hd-wallpapers.jpg";

const WALLPAPERS = [
  { id: "boy-studying", name: "Boy Studying at Desk", type: "image", url: BOY_STUDYING_IMAGE_URL },
  { id: "your-name-anime", name: "Your Name 4K Anime", type: "image", url: YOUR_NAME_ANIME_URL },
  { id: "cool-anime-landscape", name: "Cool Anime Landscape", type: "image", url: COOL_ANIME_LANDSCAPE_URL },
  { id: "samurai-moonlit-lake", name: "Samurai Moonlit Lake", type: "image", url: SAMURAI_MOONLIT_LAKE_URL },
  { id: "aesthetic-anime-night", name: "Aesthetic Anime Night", type: "image", url: AESTHETIC_ANIME_NIGHT_URL },
  { id: "anime-night-sky", name: "Anime Night Sky", type: "image", url: ANIME_NIGHT_SKY_URL },
  { id: "peaceful-anime-sunset", name: "Peaceful Anime Sunset 4K", type: "image", url: PEACEFUL_ANIME_SUNSET_URL },
  { id: "peaceful-anime-night", name: "Peaceful Anime Night 4K", type: "image", url: PEACEFUL_ANIME_NIGHT_URL },
  { id: "scenary-4k", name: "Scenery 4K", type: "image", url: SCENERY_4K_URL },
  { id: "peaceful-desktop", name: "Peaceful Landscape", type: "image", url: PEACEFUL_DESKTOP_URL },
  { id: "sunset-valley", name: "Sunset Valley", type: "image", url: SUNSET_VALLEY_URL },
  { id: "calm-ultra-hd", name: "Calm Horizon 4K", type: "image", url: CALM_ULTRA_HD_URL },
];

export default function App() {
  const {
    mode,
    status,
    remainingSec,
    config,
    changeMode,
    startTimer,
    pauseTimer,
    resetTimer,
    updateConfig,
  } = usePomodoro();

  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedId = localStorage.getItem("studywithme_bg");
      const found = WALLPAPERS.find((w) => w.id === savedId);
      if (found) return found;
    } catch (e) {}
    return WALLPAPERS[0];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Preload all wallpaper images into browser memory for lag-free instant switching
  useEffect(() => {
    WALLPAPERS.forEach((w) => {
      const img = new Image();
      img.src = w.url;
    });
  }, []);

  const handleSelectTheme = (theme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem("studywithme_bg", theme.id);
    } catch (e) {}
  };

  // Cross-browser helper to get active fullscreen element
  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  };

  // Robust Cross-Browser Fullscreen API Toggle
  const toggleFullscreen = useCallback(() => {
    const fsElement = getFullscreenElement();
    const docEl = document.documentElement;

    if (!fsElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {
          setIsFullscreen((prev) => !prev);
        });
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
        setIsFullscreen(true);
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
        setIsFullscreen(true);
      } else {
        setIsFullscreen((prev) => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, []);

  // Listen to native fullscreen changes across all vendor prefixes
  useEffect(() => {
    const handleFsChange = () => {
      const active = !!getFullscreenElement();
      setIsFullscreen(active);
    };

    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    events.forEach((evt) => document.addEventListener(evt, handleFsChange));
    return () => {
      events.forEach((evt) => document.removeEventListener(evt, handleFsChange));
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === "input") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (status === "running") pauseTimer();
        else startTimer();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetTimer();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, startTimer, pauseTimer, resetTimer, toggleFullscreen]);

  return (
    <div className={`study-space ${isFullscreen ? "is-fullscreen-fallback" : ""}`}>
      {/* Background Image Layer */}
      <div
        className="bg-layer"
        style={{ backgroundImage: `url(${currentTheme.url})` }}
      />
      
      {/* Soft Dark Vignette Overlay */}
      <div className="bg-overlay" />

      {/* TOP HEADER */}
      <Header
        mode={mode}
        onChangeMode={changeMode}
      />

      {/* CENTER ZONE */}
      <div className="center-zone">
        <HeroTimer remainingSec={remainingSec} />
        <Controls
          status={status}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* BOTTOM ZONE */}
      <footer className="bottom-nav">
        {/* Bottom Left: Embedded YouTube Lofi Player */}
        <LofiPlayer />

        {/* Bottom Right: Identical Glass Action Buttons */}
        <div className="bottom-right-actions">
          <button
            type="button"
            className="btn-glass-action"
            onClick={() => setIsSettingsOpen(true)}
            title="Wallpapers & Settings"
            aria-label="Wallpapers & Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>

          <button
            type="button"
            className="btn-glass-action"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      </footer>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={updateConfig}
        wallpapers={WALLPAPERS}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
}
