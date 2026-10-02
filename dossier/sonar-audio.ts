function noiseBuffer(ctx: AudioContext, duration: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export class SonarAudio {
  enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private humNodes: AudioNode[] = [];
  private humOscillators: OscillatorNode[] = [];
  private blipTimer: number | null = null;
  private stopTimer: number | null = null;

  private ensure() {
    if (this.ctx && this.master) return this.ctx;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    return ctx;
  }

  async setEnabled(on: boolean) {
    this.enabled = on;
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (on) {
      const ctx = this.ensure();
      if (ctx.state === "suspended") await ctx.resume();
      this.master?.gain.setTargetAtTime(0.85, ctx.currentTime, 0.06);
      this.startHum();
      this.startBlips();
      return;
    }
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.04);
    this.stopBlips();
    this.stopTimer = window.setTimeout(() => this.stopHum(), 280);
  }

  click() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx, 0.028);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(now);
    source.stop(now + 0.035);
  }

  latch() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const thud = ctx.createOscillator();
    thud.type = "sine";
    thud.frequency.setValueAtTime(92, now);
    thud.frequency.exponentialRampToValueAtTime(38, now + 0.28);
    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.0001, now);
    thudGain.gain.exponentialRampToValueAtTime(0.45, now + 0.012);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    thud.connect(thudGain);
    thudGain.connect(this.master);
    thud.start(now);
    thud.stop(now + 0.44);

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx, 0.12);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 640;
    filter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.28, now + 0.008);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.master);
    source.start(now);
    source.stop(now + 0.15);
  }

  private startHum() {
    if (!this.ctx || !this.master || this.humOscillators.length > 0) return;
    const ctx = this.ctx;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 160;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.55;
    filter.connect(humGain);
    humGain.connect(this.master);

    const fundamental = ctx.createOscillator();
    fundamental.type = "sine";
    fundamental.frequency.value = 46;
    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(fundamentalGain.gain);
    fundamental.connect(fundamentalGain);
    fundamentalGain.connect(filter);

    const harmonic = ctx.createOscillator();
    harmonic.type = "triangle";
    harmonic.frequency.value = 92;
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = 0.012;
    harmonic.connect(harmonicGain);
    harmonicGain.connect(filter);

    fundamental.start();
    harmonic.start();
    lfo.start();
    this.humOscillators = [fundamental, harmonic, lfo];
    this.humNodes = [filter, humGain, fundamentalGain, harmonicGain, lfoGain];
  }

  private stopHum() {
    this.humOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
    });
    this.humNodes.forEach((node) => node.disconnect());
    this.humOscillators = [];
    this.humNodes = [];
  }

  private startBlips() {
    this.stopBlips();
    this.blip();
    this.blipTimer = window.setInterval(() => this.blip(), 4200);
  }

  private stopBlips() {
    if (this.blipTimer !== null) {
      window.clearInterval(this.blipTimer);
      this.blipTimer = null;
    }
  }

  private blip() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2480, now);
    osc.frequency.exponentialRampToValueAtTime(1680, now + 0.09);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  dispose() {
    this.enabled = false;
    this.stopBlips();
    if (this.stopTimer !== null) window.clearTimeout(this.stopTimer);
    this.stopHum();
    this.master?.disconnect();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
