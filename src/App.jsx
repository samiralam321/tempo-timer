import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { Header } from "./components/Header";
import { HeroTimer } from "./components/HeroTimer";
import { Controls } from "./components/Controls";
import { LofiPlayer } from "./components/LofiPlayer";
import { SettingsModal } from "./components/SettingsModal";

const WALLPAPERS = [
  {
    id: "batman-video",
    name: "Batman (Video)",
    type: "youtube-video",
    youtubeId: "W9nZ6u15yis",
  },
  {
    id: "naruto-video",
    name: "Naruto (Video)",
    type: "youtube-video",
    youtubeId: "7e90gBu4pas",
  },
  {
    id: "samurai-moonlit-lake",
    name: "Samurai Moonlit Lake",
    type: "image",
    url: "/backgrounds/samurai-moonlit-lake.jpg",
  },
  {
    id: "boy-studying",
    name: "Boy Studying at Desk",
    type: "image",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000",
  },
  {
    id: "your-name-anime",
    name: "Your Name 4K Anime",
    type: "image",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000",
  },
  {
    id: "cool-anime-landscape",
    name: "Cool Anime Landscape",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
  },
  {
    id: "aesthetic-anime-night",
    name: "Aesthetic Anime Night",
    type: "image",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000",
  },
  {
    id: "anime-night-sky",
    name: "Anime Night Sky",
    type: "image",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000",
  },
  {
    id: "peaceful-anime-sunset",
    name: "Peaceful Anime Sunset 4K",
    type: "image",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000",
  },
  {
    id: "peaceful-anime-night",
    name: "Peaceful Anime Night 4K",
    type: "image",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000",
  },
  {
    id: "scenary-4k",
    name: "Scenery 4K",
    type: "image",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000",
  },
  {
    id: "peaceful-landscape",
    name: "Peaceful Landscape",
    type: "image",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2000",
  },
  {
    id: "sunset-valley",
    name: "Sunset Valley",
    type: "image",
    url: "/backgrounds/sunset.jpg",
  },
  {
    id: "calm-horizon",
    name: "Calm Horizon 4K",
    type: "image",
    url: "/backgrounds/dusk.jpg",
  },
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
    // Default to Batman (Video) for first-time users
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

  // Preload wallpaper images into memory for instant, zero-lag switching
  useEffect(() => {
    WALLPAPERS.forEach((w) => {
      if (w.type === "image" && w.url) {
        const img = new Image();
        img.src = w.url;
      }
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
      {/* Background Live Video or Image Layer */}
      {currentTheme.type === "youtube-video" ? (
        <iframe
          key={currentTheme.youtubeId}
          className="bg-video-layer"
          src={`https://www.youtube-nocookie.com/embed/${currentTheme.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${currentTheme.youtubeId}&controls=0&showinfo=0&rel=0&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          title="Background Live Video"
          style={{ pointerEvents: "none" }}
        />
      ) : currentTheme.type === "video" ? (
        <video
          ref={videoRef}
          key={currentTheme.url}
          className="bg-video-layer"
          src={currentTheme.url}
          autoPlay
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <div
          className="bg-layer"
          style={{ backgroundImage: `url("${currentTheme.url}")` }}
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
