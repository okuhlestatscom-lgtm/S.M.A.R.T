/**
 * Web Audio API synthesizer for clean, reliable sound notifications and sermon audio preview
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private sermonOscillator: OscillatorNode | null = null;
  private sermonGain: GainNode | null = null;
  private isSynthesizingSermonAudio = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Sacred herald chime for live notifications
  playAlertChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Bell-like harmonic chords (E5, G#5, B5, E6)
      const frequencies = [659.25, 830.61, 987.77, 1318.51];
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12 / (idx + 1), now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch {
      // AudioContext may be blocked before interaction, handled gracefully
    }
  }

  // Play subtle prayer pad background when an audio teaching is played
  startAmbientSermonAudio(volume: number = 0.3) {
    try {
      if (this.isSynthesizingSermonAudio) return;
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Low sacred pad drone (A2 110Hz with harmonic overtone)
      osc.frequency.setValueAtTime(110, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.15, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.sermonOscillator = osc;
      this.sermonGain = gain;
      this.isSynthesizingSermonAudio = true;
    } catch {
      // Audio context failure gracefully handled
    }
  }

  stopAmbientSermonAudio() {
    try {
      if (this.sermonGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.sermonGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          if (this.sermonOscillator) {
            this.sermonOscillator.stop();
            this.sermonOscillator.disconnect();
            this.sermonOscillator = null;
          }
          this.isSynthesizingSermonAudio = false;
        }, 550);
      } else {
        this.isSynthesizingSermonAudio = false;
      }
    } catch {
      this.isSynthesizingSermonAudio = false;
    }
  }

  setSermonVolume(volume: number) {
    if (this.sermonGain && this.ctx) {
      this.sermonGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.2)), this.ctx.currentTime);
    }
  }
}

export const soundEffects = new SoundEffectsService();
