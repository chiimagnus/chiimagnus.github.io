/**
 * diceSfx
 * Lightweight collision sound effects for the dice scene.
 *
 * Why Web Audio (instead of mp3/wav files)?
 * - No asset needed: sounds are synthesized at runtime.
 * - Lower latency and better control (gain, pitch, filtering).
 *
 * Notes:
 * - Browsers require a user gesture to start audio; call `unlockDiceAudio()` on first pointer interaction.
 * - This module avoids creating AudioContext at import-time to keep SSR/dev tools safe.
 */

export interface DiceCollisionSfxParams {
  /**
   * Relative linear speed between the two colliding bodies (rough approximation).
   * Typical range in this scene is ~0..6; values above that will be clamped.
   */
  relativeSpeed: number;
}

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let cachedNoise: { buffer: AudioBuffer; sampleRate: number } | null = null;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const getOrCreateContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    const ContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!ContextCtor) return null;
    audioContext = new ContextCtor();
  }

  if (!masterGain) {
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.55; // overall mix level for the dice page
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
};

/**
 * unlockDiceAudio
 * Call this once from a user gesture (pointerdown/click) to allow audio playback.
 */
export const unlockDiceAudio = (): void => {
  const context = getOrCreateContext();
  if (!context) return;
  if (context.state !== 'suspended') return;
  void context.resume();
};

const getNoiseBuffer = (context: AudioContext): AudioBuffer => {
  if (cachedNoise && cachedNoise.sampleRate === context.sampleRate) return cachedNoise.buffer;

  // Short burst noise used for "click / scrape" part of the hit.
  const durationSeconds = 0.12;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  // White noise with a mild decay baked in (cheap).
  for (let i = 0; i < frameCount; i += 1) {
    const t = i / frameCount;
    const envelope = (1 - t) * (1 - t);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  cachedNoise = { buffer, sampleRate: context.sampleRate };
  return buffer;
};

/**
 * playDiceCollisionSfx
 * Synthesizes a short "dice hit" sound from a thump + filtered noise.
 */
export const playDiceCollisionSfx = ({ relativeSpeed }: DiceCollisionSfxParams): void => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return;

  // If audio hasn't been unlocked yet, don't spam resume attempts here.
  if (context.state !== 'running') return;

  // Map relative speed to perceived loudness.
  // - ignore tiny contacts (resting micro-collisions)
  // - clamp to keep it pleasant
  const normalized = clamp01((relativeSpeed - 0.35) / 4.2);
  if (normalized <= 0) return;

  const now = context.currentTime;
  const volume = 0.15 + normalized * 0.55;

  // Shared output gain for this hit (envelope).
  const hitGain = context.createGain();
  hitGain.gain.setValueAtTime(0, now);
  hitGain.gain.linearRampToValueAtTime(volume, now + 0.002);
  hitGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  hitGain.connect(masterGain);

  // Low "thump": short sine oscillator.
  const thumpOsc = context.createOscillator();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(110 + Math.random() * 55, now);

  const thumpGain = context.createGain();
  thumpGain.gain.setValueAtTime(0, now);
  thumpGain.gain.linearRampToValueAtTime(0.55, now + 0.001);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  thumpOsc.connect(thumpGain);
  thumpGain.connect(hitGain);

  // High "click": filtered noise burst.
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(0.92 + Math.random() * 0.18, now);

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1200 + Math.random() * 900, now);
  noiseFilter.Q.setValueAtTime(0.9 + Math.random() * 0.6, now);

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.65, now + 0.001);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(hitGain);

  // Schedule.
  thumpOsc.start(now);
  thumpOsc.stop(now + 0.12);

  noiseSource.start(now);
  noiseSource.stop(now + 0.12);
};

