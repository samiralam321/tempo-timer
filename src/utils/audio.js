/**
 * Subtle acoustic completion tone synthesizer using Web Audio API
 * Requires zero external audio assets.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a calm, warm dual-tone chime (440Hz + 880Hz octave harmonic)
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    masterGain.connect(ctx.destination);

    // Primary Tone A4 (440Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, now);
    osc1.connect(masterGain);

    // Subtle Harmonic Tone E5 (659.25Hz) - Warm Perfect Fifth
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.05);
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.04, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 1.8);

    osc2.start(now + 0.05);
    osc2.stop(now + 1.4);
  } catch (err) {
    // Audio Context blocked or unavailable, fail silently
    console.debug("Audio playback suppressed:", err);
  }
}
