import { useState, useRef, useEffect, useCallback } from "react";

const TRACKS = [
  {
    id: "lofi-1",
    title: "Your Eyes",
    artist: "Joey Pecoraro",
    category: "Lofi • Study, Chill & More",
    thumb: "/backgrounds/dusk.jpg",
    type: "synth-lofi"
  },
  {
    id: "rain-2",
    title: "Midnight Rain",
    artist: "Ambient Atmosphere",
    category: "Nature • Rain & Thunder",
    thumb: "/backgrounds/cozy.jpg",
    type: "synth-rain"
  },
  {
    id: "sunset-3",
    title: "Golden Dusk",
    artist: "Chillhop Music",
    category: "Focus • Warm Beats",
    thumb: "/backgrounds/sunset.jpg",
    type: "synth-cafe"
  }
];

export function useAmbientAudio() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseNodeRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Initialize Web Audio Synthesizer for Ambient Soundscapes
  const startAmbientSound = useCallback((type) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      // Stop previous noise node if exists
      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.stop(); } catch(e) {}
      }

      const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate Brown/Pink noise for Rain & Lofi atmosphere
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "synth-rain") {
          // Rain filtering: Brown noise filter
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (type === "synth-cafe") {
          // Warm Cafe vinyl noise
          output[i] = (lastOut + 0.01 * white) / 1.01;
          lastOut = output[i];
          output[i] *= 1.8;
        } else {
          // Soft ambient lofi vinyl hum
          output[i] = (lastOut + 0.008 * white) / 1.01;
          lastOut = output[i];
          output[i] *= 1.2;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

      whiteNoise.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
    } catch (e) {
      console.debug("Audio context error:", e);
    }
  }, [volume]);

  const stopAmbientSound = useCallback(() => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        startAmbientSound(currentTrack.type);
      } else {
        stopAmbientSound();
      }
      return next;
    });
  }, [currentTrack, startAmbientSound, stopAmbientSound]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  // Update track when index changes while playing
  useEffect(() => {
    if (isPlaying) {
      startAmbientSound(currentTrack.type);
    }
  }, [currentTrackIndex, isPlaying, currentTrack, startAmbientSound]);

  return {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    tracks: TRACKS,
  };
}
