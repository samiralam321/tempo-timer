import React, { useState, useRef, useEffect, useCallback } from "react";

const PLAYLIST = [
  {
    id: "CeItO4-ARfk",
    title: "Ghibli Music",
    artist: "Relaxing Piano",
    type: "youtube",
  },
  {
    id: "every-breath-you-take",
    title: "Every Breath You Take (Slowed)",
    artist: "The Police / Stranger Things",
    type: "audio",
    url: "https://res.cloudinary.com/dxarkutme/video/upload/v1788326091/the-police-every-breath-you-take-slowed-down_scatgn.m4a",
  },
  {
    id: "-pHfPJGatgE",
    title: "Sparkle",
    artist: "Lofi Beats",
    type: "youtube",
  },
  {
    id: "brown-rice",
    title: "Brown Rice",
    artist: "Dido (Slowed & Reverb)",
    type: "audio",
    url: "https://go-file-storage.onrender.com/file_storage/Dido-Thank-you-Slowed-Reverb.m4a",
  },
  {
    id: "golden-brown-love-story",
    title: "Golden Brown x Love Story",
    artist: "Slowed Remix",
    type: "audio",
    url: "https://go-file-storage.onrender.com/file_storage/Golden-Brown-X-Love-Story-slowed-Remix.m4a",
  },
  {
    id: "kids-m4a",
    title: "Kids",
    artist: "Aesthetic Chill",
    type: "audio",
    url: "https://go-file-storage.onrender.com/file_storage/Kids.m4a",
  },
  {
    id: "Njt1io9jakQ",
    title: "Lofi Girl Beats",
    artist: "Lofi Girl",
    type: "youtube",
  },
  {
    id: "MzgMBrtrFc4",
    title: "Deep Focus Beats",
    artist: "Chill Study",
    type: "youtube",
  },
];

export function LofiPlayer({ externalTrackId }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[trackIndex];

  // Listen to external track trigger (e.g. Stranger Things wallpaper selected)
  useEffect(() => {
    if (externalTrackId) {
      const foundIdx = PLAYLIST.findIndex((t) => t.id === externalTrackId);
      if (foundIdx !== -1) {
        setTrackIndex(foundIdx);
        setIsPlaying(true);
      }
    }
  }, [externalTrackId]);

  // PostMessage commands to YouTube IFrame API
  const sendIframeCommand = (command, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args }),
        "*"
      );
    }
  };

  const handleNextTrack = useCallback(() => {
    setTrackIndex((prevIdx) => (prevIdx + 1) % PLAYLIST.length);
    setIsPlaying(true);
  }, []);

  const handlePrevTrack = useCallback(() => {
    setTrackIndex((prevIdx) => (prevIdx - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (currentTrack.type === "audio" && audioRef.current) {
        audioRef.current.pause();
      } else if (currentTrack.type === "youtube") {
        sendIframeCommand("pauseVideo");
      }
      setIsPlaying(false);
    } else {
      if (currentTrack.type === "audio" && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else if (currentTrack.type === "youtube") {
        sendIframeCommand("playVideo");
      }
      setIsPlaying(true);
    }
  };

  // Play/Pause & autoPlay handler for HTML5 audio tracks
  useEffect(() => {
    if (currentTrack.type === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  // Listen for YouTube iframe state changes & ended events to auto-advance
  useEffect(() => {
    const handleMessage = (e) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!data) return;
        const playerState = data.info?.playerState ?? data.info ?? data.data;
        // YT.PlayerState.ENDED is 0
        if (playerState === 0 || (data.event === "onStateChange" && data.info === 0)) {
          handleNextTrack();
        }
      } catch (err) {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNextTrack]);

  return (
    <div className="lofi-compact-pill-card">
      {/* Hidden Audio Engines */}
      {currentTrack.type === "youtube" ? (
        <iframe
          ref={iframeRef}
          key={currentTrack.id}
          className="hidden-youtube-audio"
          src={`https://www.youtube-nocookie.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=0`}
          title="Lofi Audio Stream"
          allow="autoplay; encrypted-media"
          aria-hidden="true"
        />
      ) : (
        <audio
          ref={audioRef}
          key={currentTrack.id}
          src={currentTrack.url}
          autoPlay={isPlaying}
          onEnded={handleNextTrack}
          aria-hidden="true"
        />
      )}

      {/* Music Icon & Track Title */}
      <div className="lofi-pill-content">
        <span className={`pill-vinyl ${isPlaying ? "spinning" : ""}`}>🎵</span>
        <span className="pill-track-title">{currentTrack.title}</span>
      </div>

      {/* Control Buttons: Prev, Play/Pause, Next */}
      <div className="pill-controls-group">
        <button
          type="button"
          className="pill-ctrl-btn"
          onClick={handlePrevTrack}
          title="Previous Track"
          aria-label="Previous Track"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="3" />
          </svg>
        </button>

        <button
          type="button"
          className="pill-play-btn"
          onClick={togglePlay}
          title={isPlaying ? "Pause Music" : "Play Music"}
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "1.5px" }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="pill-ctrl-btn"
          onClick={handleNextTrack}
          title="Next Track"
          aria-label="Next Track"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
