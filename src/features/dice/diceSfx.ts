/**
 * diceSfx
 * Web Audio (synthesized) sound effects for the dice scene:
 * - collision, throw, settle, bounce, scrape
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

/**
 * playThrowSfx
 * 投掷起手音效：短促的轻微「咔」声，模拟手指离开骰子时的摩擦/释放。
 *
 * Design notes:
 * - Slightly band-passed noise with a fast downward sweep.
 * - Very short tail so it doesn't mask the first collision.
 */
export const playThrowSfx = (): void => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return;
  if (context.state !== 'running') return;

  const now = context.currentTime;

  // Output envelope: fast attack, very short decay.
  const throwGain = context.createGain();
  throwGain.gain.setValueAtTime(0, now);
  throwGain.gain.linearRampToValueAtTime(0.28, now + 0.005);
  throwGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  throwGain.connect(masterGain);

  // Mid-frequency noise + sweep to form a "tick".
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(1.2, now);

  const sweepFilter = context.createBiquadFilter();
  sweepFilter.type = 'bandpass';
  sweepFilter.frequency.setValueAtTime(2000, now);
  sweepFilter.frequency.exponentialRampToValueAtTime(600, now + 0.04);
  sweepFilter.Q.setValueAtTime(1.5, now);

  noiseSource.connect(sweepFilter);
  sweepFilter.connect(throwGain);

  noiseSource.start(now);
  noiseSource.stop(now + 0.06);
};

/**
 * playSettleSfx
 * 骰子落定音效：低沉短促的「笃」，用于强调“完全静止”的结束点。
 *
 * Design notes:
 * - Low sine "thump" with a tiny bit of filtered noise for texture.
 * - Kept quiet to act like a punctuation mark, not a highlight.
 */
export const playSettleSfx = (): void => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return;
  if (context.state !== 'running') return;

  const now = context.currentTime;

  const settleGain = context.createGain();
  settleGain.gain.setValueAtTime(0, now);
  settleGain.gain.linearRampToValueAtTime(0.22, now + 0.005);
  settleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  settleGain.connect(masterGain);

  // Low-frequency thump.
  const thumpOsc = context.createOscillator();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(70, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
  thumpOsc.connect(settleGain);

  // A touch of noise to avoid sounding too "pure".
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(0.85, now);

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(520, now);

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(settleGain);

  thumpOsc.start(now);
  thumpOsc.stop(now + 0.1);

  noiseSource.start(now);
  noiseSource.stop(now + 0.08);
};

export interface BounceSfxParams {
  /**
   * Vertical impact speed (downward is positive in our caller).
   * Typical range: 0..8
   */
  impactSpeed: number;
}

/**
 * playBounceSfx
 * 弹跳音效：强调垂直冲击的「砰」声。
 *
 * Returns:
 * - `true` if the sound was played (useful for mutual exclusion with other SFX)
 * - `false` if the impact is too small or audio is not available
 */
export const playBounceSfx = ({ impactSpeed }: BounceSfxParams): boolean => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return false;
  if (context.state !== 'running') return false;

  const normalized = clamp01((impactSpeed - 1.5) / 4.5);
  if (normalized <= 0) return false;

  const now = context.currentTime;
  const volume = 0.18 + normalized * 0.35;

  const bounceGain = context.createGain();
  bounceGain.gain.setValueAtTime(0, now);
  bounceGain.gain.linearRampToValueAtTime(volume, now + 0.003);
  bounceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  bounceGain.connect(masterGain);

  // Low "boom": pitch up then down to create a bouncy impression.
  const bounceOsc = context.createOscillator();
  bounceOsc.type = 'sine';
  const baseFreq = 80 + normalized * 40;
  bounceOsc.frequency.setValueAtTime(baseFreq, now);
  bounceOsc.frequency.linearRampToValueAtTime(baseFreq * 1.3, now + 0.01);
  bounceOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.12);
  bounceOsc.connect(bounceGain);

  // Add a tiny noise transient for texture.
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(600, now);

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.12 * normalized, now + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(bounceGain);

  bounceOsc.start(now);
  bounceOsc.stop(now + 0.15);

  noiseSource.start(now);
  noiseSource.stop(now + 0.1);

  return true;
};

export interface ScrapeSfxParams {
  /**
   * Horizontal sliding speed (XZ plane).
   * Typical range: 0..4
   */
  horizontalSpeed: number;
  /**
   * Vertical speed (Y axis magnitude). Used to distinguish scraping from bouncing.
   */
  verticalSpeed: number;
}

/**
 * playScrapeSfx
 * 边缘摩擦/刮擦音效：骰子贴边滑动时的短促「刺啦」声。
 *
 * Triggering:
 * - A simplified heuristic: `horizontalSpeed > verticalSpeed * 2`
 * - Caller should also apply a small cooldown to avoid rapid-fire scrapes.
 *
 * Returns:
 * - `true` if played, so the caller can skip the normal collision SFX.
 */
export const playScrapeSfx = ({ horizontalSpeed, verticalSpeed }: ScrapeSfxParams): boolean => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return false;
  if (context.state !== 'running') return false;

  // If vertical component dominates, it's more likely a bounce/impact than a scrape.
  if (horizontalSpeed < verticalSpeed * 2) return false;

  const normalized = clamp01((horizontalSpeed - 0.8) / 2.5);
  if (normalized <= 0) return false;

  const now = context.currentTime;
  const volume = 0.08 + normalized * 0.18;

  const scrapeGain = context.createGain();
  scrapeGain.gain.setValueAtTime(0, now);
  scrapeGain.gain.linearRampToValueAtTime(volume, now + 0.005);
  scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  scrapeGain.connect(masterGain);

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(0.8 + normalized * 0.4, now);

  const scrapeFilter = context.createBiquadFilter();
  scrapeFilter.type = 'bandpass';
  scrapeFilter.frequency.setValueAtTime(1800 + normalized * 1200, now);
  scrapeFilter.Q.setValueAtTime(2.5, now);

  noiseSource.connect(scrapeFilter);
  scrapeFilter.connect(scrapeGain);

  noiseSource.start(now);
  noiseSource.stop(now + 0.1);

  return true;
};
