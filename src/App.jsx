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
    type: "video",
    url: "https://res.cloudinary.com/dxarkutme/video/upload/v1788325509/jwhJZ0R1RB7HKIvM_m8z1u8.mp4",
  },
  {
    id: "naruto-video",
    name: "Naruto (Video)",
    type: "video",
    url: "https://res.cloudinary.com/dxarkutme/video/upload/v1788325508/pHD1kOIDMmjZfwn-_zitzyh.mp4",
  },
  {
    id: "samurai-moonlit-lake",
    name: "Samurai Moonlit Lake",
    type: "image",
    url: "/backgrounds/samurai-moonlit-lake.jpg",
  },
  {
    id: "spiderman",
    name: "SpiderMan",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325508/uwp5081657_ph6plq.jpg",
  },
  {
    id: "your-name",
    name: "YourName",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325508/wp5529802-hd-4k-anime-your-name-wallpapers_oeiol3.jpg",
  },
  {
    id: "night-scenery",
    name: "Night",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325509/wp12575021-scenary-4k-wallpapers_botlbf.jpg",
  },
  {
    id: "aesthetic-horizon",
    name: "Aesthetic",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325508/wp11527838-calm-ultra-hd-wallpapers_nx6a3y.jpg",
  },
  {
    id: "lake-peaceful",
    name: "Lake",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325508/wp9899910-desktop-peaceful-wallpapers_u7v33x.jpg",
  },
  {
    id: "anime-night-room",
    name: "Anime Night",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325508/2151684333_jwprxd.jpg",
  },
  {
    id: "study-room",
    name: "Study",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325507/2152014291_rfno68.jpg",
  },
  {
    id: "evening-landscape",
    name: "Evening",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325507/wp6434841-cool-anime-landscape-wallpapers_yp1xyx.jpg",
  },
  {
    id: "peaceful-anime",
    name: "Peaceful Anime",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325507/wp9315303-peaceful-anime-4k-wallpapers_j24sss.jpg",
  },
  {
    id: "sunset-anime",
    name: "Sunset Anime",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325507/wp9315335-peaceful-anime-4k-wallpapers_xsymjf.jpg",
  },
  {
    id: "stranger-things",
    name: "Stranger Things",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325506/stranger-things-sinopsis-cinematografico_rhlon5.jpg",
    associatedTrackId: "every-breath-you-take",
  },
  {
    id: "kids-art",
    name: "Kids",
    type: "image",
    url: "https://res.cloudinary.com/dxarkutme/image/upload/v1788325506/3168628_wocjxn.jpg",
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

  const [activeTrackId, setActiveTrackId] = useState(null);
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

    // If theme has special associated track (e.g. Stranger Things -> Every Breath You Take)
    if (theme.associatedTrackId) {
      setActiveTrackId(theme.associatedTrackId);
    }
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
      {currentTheme.type === "video" ? (
        <video
          ref={videoRef}
          key={currentTheme.url}
          className="bg-video-layer"
          src={currentTheme.url}
          autoPlay
          loop
          muted
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
        <LofiPlayer externalTrackId={activeTrackId} />

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
