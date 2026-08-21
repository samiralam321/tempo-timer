import React, { useState, useRef } from "react";

const PLAYLIST = [
  {
    id: "Njt1io9jakQ",
    title: "Lofi Girl Beats",
    artist: "Lofi Girl",
  },
  {
    id: "-pHfPJGatgE",
    title: "Sparkle",
    artist: "Lofi Beats",
  },
  {
    id: "CeItO4-ARfk",
    title: "Ghibli Music",
    artist: "Relaxing Piano",
  },
  {
    id: "MzgMBrtrFc4",
    title: "Deep Focus Beats",
    artist: "Chill Study",
  },
];

export function LofiPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  const currentTrack = PLAYLIST[trackIndex];

  // PostMessage commands to YouTube IFrame API
  const sendIframeCommand = (command) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      sendIframeCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendIframeCommand("playVideo");
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const prevIdx = (trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  return (
    <div className="lofi-compact-pill-card">
      {/* Hidden YouTube Iframe Audio Engine */}
      <iframe
        ref={iframeRef}
        key={currentTrack.id}
        className="hidden-youtube-audio"
        src={`https://www.youtube-nocookie.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=0`}
        title="Lofi Audio Stream"
        allow="autoplay; encrypted-media"
        aria-hidden="true"
      />

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
          title="Previous Audio Track"
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
          title="Next Audio Track"
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
