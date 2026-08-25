import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { Header } from "./components/Header";
import { HeroTimer } from "./components/HeroTimer";
import { Controls } from "./components/Controls";
import { LofiPlayer } from "./components/LofiPlayer";
import { SettingsModal } from "./components/SettingsModal";

const BOY_STUDYING_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/Boy_studying_at_desk_in_202608211057.jpeg";
const JAPANESE_RAIN_FOREST_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/Japanese_forest_during_rain_2K_202608211049.jpeg";
const JAPANESE_VILLAGE_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/Japanese_mountain_village_at_sunset_202608211050.jpeg";
const TREE_SWIRL_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/Tree_trunk_and_swirling_sky_202608211032_upscayl_4x_ultrasharp-4x.png";
const SAVETWITTER_IMAGE_URL = "https://go-file-storage.onrender.com/file_storage/SaveTwitter.Net_HP6v5uBbsAAreIS.jpg";
const PARK_BENCH_VIDEO_URL = "https://go-file-storage.onrender.com/file_storage/Park_bench_facing_calm_ocean_202608211036.mp4";
const CLOUDS_VIDEO_URL = "https://go-file-storage.onrender.com/file_storage/Clouds_drifting_through_tree_leaves_202608211024.mp4";

const WALLPAPERS = [
  { id: "boy-studying", name: "Boy Studying at Desk", type: "image", url: BOY_STUDYING_IMAGE_URL },
  { id: "japanese-rain-forest", name: "Japanese Rain Forest 2K", type: "image", url: JAPANESE_RAIN_FOREST_IMAGE_URL },
  { id: "japanese-village", name: "Japanese Mountain Sunset", type: "image", url: JAPANESE_VILLAGE_IMAGE_URL },
  { id: "tree-swirl-sky", name: "Swirling Sky & Tree", type: "image", url: TREE_SWIRL_IMAGE_URL },
  { id: "aesthetic-room", name: "Aesthetic Space", type: "image", url: SAVETWITTER_IMAGE_URL },
  { id: "park-bench-video", name: "Calm Ocean Bench", type: "video", url: PARK_BENCH_VIDEO_URL },
  { id: "clouds-video", name: "Clouds & Leaves", type: "video", url: CLOUDS_VIDEO_URL },
  { id: "dusk", name: "Dusk City", type: "image", url: "/backgrounds/dusk.jpg" },
  { id: "cozy", name: "Cozy Rain", type: "image", url: "/backgrounds/cozy.jpg" },
  { id: "sunset", name: "Golden Sunset", type: "image", url: "/backgrounds/sunset.jpg" },
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
  const videoRef = useRef(null);

  // Set low background volume (15%) for video backgrounds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.15;
    }
  }, [currentTheme]);

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
      // Enter Fullscreen
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
        // Fallback for browsers/devices that block native fullscreen API
        setIsFullscreen((prev) => !prev);
      }
    } else {
      // Exit Fullscreen
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
      {/* Background Live Video or Image Layer */}
      {currentTheme.type === "video" ? (
        <video
          ref={videoRef}
          key={currentTheme.url}
          className="bg-video-layer"
          src={currentTheme.url}
          autoPlay
          loop
          playsInline
        />
      ) : (
        <div
          className="bg-layer"
          style={{ backgroundImage: `url(${currentTheme.url})` }}
        />
      )}
      
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
